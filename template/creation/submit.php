<?php
header('Content-Type: text/html; charset=utf-8');

function respond($payload, $httpCode = 200) {
	http_response_code($httpCode);
	echo '<pre>' . htmlspecialchars(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), ENT_QUOTES, 'UTF-8') . '</pre>';
	exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	respond([
		'error' => 'POST required',
		'hint' => 'Submit the form from template/creation/index.html'
	], 405);
}

$apiKey = isset($_POST['api_key']) && trim($_POST['api_key']) !== '' ? trim($_POST['api_key']) : getenv('YCLOUD_API_KEY');
$wabaId = isset($_POST['waba_id']) && trim($_POST['waba_id']) !== '' ? trim($_POST['waba_id']) : getenv('YCLOUD_WABA_ID');

if (!$apiKey || !$wabaId) {
	respond([
		'error' => 'Missing YCloud credentials',
		'required_env' => ['YCLOUD_API_KEY', 'YCLOUD_WABA_ID']
	], 400);
}

$templateName = isset($_POST['template_name']) ? trim($_POST['template_name']) : '';
$categoryRaw = isset($_POST['category']) ? trim($_POST['category']) : '';

if ($templateName === '') {
	respond(['error' => 'Template name is required.'], 400);
}

if ($categoryRaw === '') {
	respond(['error' => 'Category is required.'], 400);
}

// Map UI category to YCloud category / subCategory
$category = null;
$subCategory = null;

if (strpos($categoryRaw, 'marketing') === 0) {
	$category = 'MARKETING';
} elseif (strpos($categoryRaw, 'utility') === 0) {
	$category = 'UTILITY';
} elseif (strpos($categoryRaw, 'authentication') === 0) {
	$category = 'AUTHENTICATION';
}

if (strpos($categoryRaw, 'order_status') !== false) {
	$subCategory = 'ORDER_STATUS';
}

if (!$category) {
	respond(['error' => 'Unknown category value.', 'value' => $categoryRaw], 400);
}

function findVariables($text) {
	if (!$text) {
		return [];
	}
	preg_match_all('/\{\{\s*([^}]+)\s*\}\}/', $text, $matches);
	return $matches[1] ?? [];
}

function buildExamplesForText($text, $sampleMap = []) {
	$vars = findVariables($text);
	if (empty($vars)) {
		return null;
	}

	$examples = [];
	$index = 1;
	foreach ($vars as $var) {
		$trimmed = trim($var);
		if (isset($sampleMap[$trimmed]) && $sampleMap[$trimmed] !== '') {
			$examples[] = $sampleMap[$trimmed];
		} else {
			$examples[] = "sample{$index}";
		}
		$index++;
	}

	return $examples;
}

function normalizeVariablesForText($text, $sampleMap = [], $maxVars = null) {
	if (!$text) {
		return [
			'text' => $text,
			'examples' => null,
			'varCount' => 0
		];
	}

	preg_match_all('/\{\{\s*([^}]+)\s*\}\}/', $text, $matches);
	$vars = $matches[1] ?? [];
	if (empty($vars)) {
		return [
			'text' => $text,
			'examples' => null,
			'varCount' => 0
		];
	}

	$indexMap = [];
	$examples = [];
	$nextIndex = 1;

	foreach ($vars as $var) {
		$key = trim($var);
		if (!isset($indexMap[$key])) {
			$indexMap[$key] = $nextIndex;
			$sample = isset($sampleMap[$key]) && $sampleMap[$key] !== '' ? $sampleMap[$key] : "sample{$nextIndex}";
			$examples[] = $sample;
			$nextIndex++;
			if ($maxVars !== null && count($indexMap) > $maxVars) {
				return [
					'error' => "Too many variables in text. Max allowed: {$maxVars}.",
					'text' => $text
				];
			}
		}
	}

	$normalizedText = preg_replace_callback('/\{\{\s*([^}]+)\s*\}\}/', function($match) use ($indexMap) {
		$key = trim($match[1]);
		$index = $indexMap[$key] ?? 1;
		return '{{' . $index . '}}';
	}, $text);

	return [
		'text' => $normalizedText,
		'examples' => $examples,
		'varCount' => count($indexMap)
	];
}

function normalizeUrlWithVariable($url, $isDynamic) {
	if (!$url) {
		return $url;
	}
	if ($isDynamic && strpos($url, '{{') === false) {
		// Add / before {{1}} if URL doesn't end with ? or &
		$url = rtrim($url, '/');
		if (strpos($url, '?') !== false) {
			// URL has query string, append with &
			return $url . '&path={{1}}';
		} else {
			// Add as path segment
			return $url . '/{{1}}';
		}
	}
	return $url;
}

function applySamplesToText($text, $sampleMap = []) {
	if (!$text) {
		return $text;
	}
	$vars = findVariables($text);
	if (empty($vars)) {
		return $text;
	}

	$replaced = $text;
	$index = 1;
	foreach ($vars as $var) {
		$trimmed = trim($var);
		$sample = isset($sampleMap[$trimmed]) && $sampleMap[$trimmed] !== '' ? $sampleMap[$trimmed] : "sample{$index}";
		$replaced = preg_replace('/\{\{\s*' . preg_quote($trimmed, '/') . '\s*\}\}/', $sample, $replaced, 1);
		$index++;
	}

	return $replaced;
}

function extractButtonsFromPost($post, $sampleMap = []) {
	$buttons = [];

	foreach ($post as $key => $value) {
		if (strpos($key, 'button_text_') === 0) {
			$index = substr($key, strlen('button_text_'));
			$text = trim($value);

			if ($text === '') {
				continue;
			}

			$button = [
				'type' => 'QUICK_REPLY',
				'text' => $text
			];

			$phoneKey = 'button_phone_' . $index;
			$urlKey = 'button_url_' . $index;
			$urlTypeKey = 'url_type_' . $index;
			$urlSuffixKey = 'button_url_suffix_' . $index;
			$codeExampleKey = 'button_code_example_' . $index;
			$flowKey = 'button_flow_' . $index;

			if (!empty($post[$phoneKey])) {
				$button['type'] = 'PHONE_NUMBER';
				$button['phone_number'] = trim($post[$phoneKey]);
			} elseif (!empty($post[$urlKey])) {
				$button['type'] = 'URL';
				$urlType = isset($post[$urlTypeKey]) ? $post[$urlTypeKey] : 'static';
				$isDynamic = $urlType === 'dynamic';
				$normalizedUrl = normalizeUrlWithVariable(trim($post[$urlKey]), $isDynamic);
				$button['url'] = $normalizedUrl;

				// For dynamic URLs, build example with suffix value
				if ($isDynamic) {
					$suffixValue = !empty($post[$urlSuffixKey]) ? trim($post[$urlSuffixKey]) : 'example';
					// Strip any {{...}} from suffix value in case user included variable syntax
					$suffixValue = preg_replace('/\{\{[^}]*\}\}/', '', $suffixValue);
					if (empty($suffixValue)) {
						$suffixValue = 'example';
					}
					// Replace {{1}} in the URL with the suffix value
					$exampleUrl = preg_replace('/\{\{\s*1\s*\}\}/', $suffixValue, $normalizedUrl);
					$button['example'] = [$exampleUrl];
				} else {
					$sampleUrl = applySamplesToText($normalizedUrl, $sampleMap);
					if ($sampleUrl !== $normalizedUrl) {
						$button['example'] = [$sampleUrl];
					}
				}
			} elseif (!empty($post[$codeExampleKey])) {
				$button['type'] = 'COPY_CODE';
				// COPY_CODE buttons have fixed text, don't include 'text' field
				unset($button['text']);
				$button['example'] = [trim($post[$codeExampleKey])];
			} elseif (!empty($post[$flowKey])) {
				$button['type'] = 'FLOW';
				$button['flow_id'] = trim($post[$flowKey]);
			}

			$buttons[] = $button;
		}
	}

	return $buttons;
}

$languages = [
	['code' => 'en', 'suffix' => 'en'],
	['code' => 'zh_HK', 'suffix' => 'zh_hk'],
	['code' => 'zh_CN', 'suffix' => 'zh_cn']
];

$buttons = [];

$requests = [];

foreach ($languages as $lang) {
	$langCode = $lang['code'];
	$langSuffix = $lang['suffix'];
	$bodyKey = 'body_' . $langSuffix;
	$bodyText = isset($_POST[$bodyKey]) ? trim($_POST[$bodyKey]) : '';
	if ($bodyText === '') {
		continue;
	}

	$sampleKey = 'variable_samples_' . $langSuffix;
	$sampleMap = [];
	if (!empty($_POST[$sampleKey])) {
		$decodedSamples = json_decode($_POST[$sampleKey], true);
		if (is_array($decodedSamples)) {
			$sampleMap = $decodedSamples;
		}
	}

	$components = [];

	$headerTypeKey = 'header_type_' . $langSuffix;
	$headerTextKey = 'header_text_' . $langSuffix;
	$footerKey = 'footer_' . $langSuffix;

	$headerType = isset($_POST[$headerTypeKey]) ? $_POST[$headerTypeKey] : 'none';
	$headerText = isset($_POST[$headerTextKey]) ? trim($_POST[$headerTextKey]) : '';

	if ($headerType === 'text' && $headerText !== '') {
		$normalizedHeader = normalizeVariablesForText($headerText, $sampleMap, 1);
		if (!empty($normalizedHeader['error'])) {
			respond([
				'error' => $normalizedHeader['error'],
				'language' => $langCode,
				'field' => 'header_text'
			], 400);
		}
		$headerComponent = [
			'type' => 'HEADER',
			'format' => 'TEXT',
			'text' => $normalizedHeader['text']
		];

		if (!empty($normalizedHeader['examples'])) {
			$headerComponent['example'] = [
				'header_text' => [$normalizedHeader['examples'][0]]
			];
		}

		$components[] = $headerComponent;
	}

	if ($headerType === 'media') {
		$mediaTypeKey = 'header_media_type_' . $langSuffix;
		$mediaUrlKey = 'header_media_url_' . $langSuffix;
		$mediaTypeRaw = isset($_POST[$mediaTypeKey]) ? strtolower(trim($_POST[$mediaTypeKey])) : '';
		$mediaUrl = isset($_POST[$mediaUrlKey]) ? trim($_POST[$mediaUrlKey]) : '';

		$mediaTypeMap = [
			'image' => 'IMAGE',
			'video' => 'VIDEO',
			'document' => 'DOCUMENT'
		];
		$mediaFormat = isset($mediaTypeMap[$mediaTypeRaw]) ? $mediaTypeMap[$mediaTypeRaw] : null;
		$mediaExtMap = [
			'image' => ['.jpg', '.jpeg', '.png'],
			'video' => ['.mp4'],
			'document' => ['.pdf']
		];

		if ($mediaFormat && $mediaUrl !== '') {
			$allowedExts = isset($mediaExtMap[$mediaTypeRaw]) ? $mediaExtMap[$mediaTypeRaw] : [];
			$lowerUrl = strtolower($mediaUrl);
			$extOk = false;
			foreach ($allowedExts as $ext) {
				if (substr($lowerUrl, -strlen($ext)) === $ext) {
					$extOk = true;
					break;
				}
			}
			if (!$extOk) {
				respond([
					'error' => 'Invalid header media URL extension.',
					'language' => $langCode,
					'expected' => $allowedExts,
					'url' => $mediaUrl
				], 400);
			}

			$headerComponent = [
				'type' => 'HEADER',
				'format' => $mediaFormat,
				'example' => [
					'header_url' => [$mediaUrl]
				]
			];
			$components[] = $headerComponent;
		}
	}

	if ($headerType === 'location') {
		$components[] = [
			'type' => 'HEADER',
			'format' => 'LOCATION'
		];
	}

	$normalizedBody = normalizeVariablesForText($bodyText, $sampleMap, null);
	$bodyComponent = [
		'type' => 'BODY',
		'text' => $normalizedBody['text']
	];

	if (!empty($normalizedBody['examples'])) {
		$bodyComponent['example'] = [
			'body_text' => [$normalizedBody['examples']]
		];
	}

	$components[] = $bodyComponent;

	$footerText = isset($_POST[$footerKey]) ? trim($_POST[$footerKey]) : '';
	if ($footerText !== '') {
		$footerVars = findVariables($footerText);
		if (!empty($footerVars)) {
			respond([
				'error' => 'Footer cannot contain variables.',
				'language' => $langCode,
				'field' => 'footer'
			], 400);
		}
		$components[] = [
			'type' => 'FOOTER',
			'text' => $footerText
		];
	}

	if (empty($buttons)) {
		$buttons = extractButtonsFromPost($_POST, $sampleMap);
	}

	if (!empty($buttons)) {
		$components[] = [
			'type' => 'BUTTONS',
			'buttons' => $buttons
		];
	}

	$payload = [
		'wabaId' => $wabaId,
		'name' => $templateName,
		'language' => $langCode,
		'category' => $category,
		'components' => $components
	];

	if ($subCategory) {
		$payload['subCategory'] = $subCategory;
	}

	$requests[] = $payload;
}

if (empty($requests)) {
	respond(['error' => 'No language body content provided.'], 400);
}

$results = [];

foreach ($requests as $payload) {
	$ch = curl_init('https://api.ycloud.com/v2/whatsapp/templates');
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, [
		'Content-Type: application/json',
		'X-API-Key: ' . $apiKey
	]);
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

	$response = curl_exec($ch);
	$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	$error = curl_error($ch);
	curl_close($ch);

	$decoded = json_decode($response, true);

	$results[] = [
		'language' => $payload['language'],
		'request' => $payload,
		'httpCode' => $httpCode,
		'response' => $decoded ?: $response,
		'error' => $error ?: null
	];
}

respond([
	'submitted' => count($results),
	'results' => $results
]);