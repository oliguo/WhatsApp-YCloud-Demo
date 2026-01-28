<?php
/**
 * YCloud API Proxy
 * Handles all WhatsApp template API requests
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Load configuration
$config = require __DIR__ . '/config.php';

// Validate config
if (empty($config['api_key']) || $config['api_key'] === 'YOUR_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'API key not configured in config.php']);
    exit;
}

if (empty($config['waba_id']) || $config['waba_id'] === 'YOUR_WABA_ID_HERE') {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'WABA ID not configured in config.php']);
    exit;
}

$apiKey = $config['api_key'];
$wabaId = $config['waba_id'];

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Parse request
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Validate required fields (only endpoint and method now)
$required = ['endpoint', 'method'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

$endpoint = $input['endpoint'];
$method = strtoupper($input['method']);
$data = $input['data'] ?? null;

// Build URL
$baseUrl = 'https://api.ycloud.com/v2';

// Add wabaId to query params if not already present
if (strpos($endpoint, 'wabaId=') === false) {
    $separator = strpos($endpoint, '?') !== false ? '&' : '?';
    $endpoint .= $separator . 'wabaId=' . urlencode($wabaId);
}

$url = $baseUrl . $endpoint;

// Initialize cURL
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'X-API-Key: ' . $apiKey
    ]
]);

// Set method and data
switch ($method) {
    case 'POST':
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) {
            // Process template data before sending
            $data = processTemplateData($data);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }
        break;
    
    case 'DELETE':
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        break;
    
    case 'GET':
    default:
        // Default is GET
        break;
}

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Handle cURL errors
if ($error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => "cURL error: $error"]);
    exit;
}

// Parse response
$responseData = json_decode($response, true);

// Return result
if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true, 'data' => $responseData]);
} else {
    $errorMessage = 'API request failed';
    if (isset($responseData['message'])) {
        $errorMessage = $responseData['message'];
    } elseif (isset($responseData['error']['message'])) {
        $errorMessage = $responseData['error']['message'];
    }
    
    http_response_code($httpCode);
    echo json_encode([
        'success' => false, 
        'error' => $errorMessage,
        'details' => $responseData
    ]);
}

/**
 * Process template data before sending to API
 * - Normalize variables to sequential placeholders
 * - Sort buttons (Quick Reply before CTA)
 * - Clean phone numbers
 * - Handle special button types
 */
function processTemplateData($data) {
    if (!isset($data['components'])) {
        return $data;
    }

    $variableMapping = [];
    $variableCounter = 1;

    foreach ($data['components'] as &$component) {
        // Process HEADER
        if ($component['type'] === 'HEADER' && isset($component['text'])) {
            $result = normalizeVariables($component['text'], $variableMapping, $variableCounter);
            $component['text'] = $result['text'];
            $variableMapping = $result['mapping'];
            $variableCounter = $result['counter'];

            // Update header example if exists
            if (isset($component['example']['header_text'])) {
                $component['example']['header_text'] = updateExampleValues(
                    $component['example']['header_text'], 
                    $variableMapping
                );
            }
        }

        // Process BODY
        if ($component['type'] === 'BODY' && isset($component['text'])) {
            $result = normalizeVariables($component['text'], $variableMapping, $variableCounter);
            $component['text'] = $result['text'];
            $variableMapping = $result['mapping'];
            $variableCounter = $result['counter'];

            // Update body example if exists
            if (isset($component['example']['body_text']) && is_array($component['example']['body_text'])) {
                foreach ($component['example']['body_text'] as &$exampleSet) {
                    $exampleSet = updateExampleValues($exampleSet, $variableMapping);
                }
            }
        }

        // Process BUTTONS
        if ($component['type'] === 'BUTTONS' && isset($component['buttons'])) {
            // Sort buttons: QUICK_REPLY first, then others
            usort($component['buttons'], function($a, $b) {
                $aIsQuickReply = ($a['type'] === 'QUICK_REPLY') ? 0 : 1;
                $bIsQuickReply = ($b['type'] === 'QUICK_REPLY') ? 0 : 1;
                return $aIsQuickReply - $bIsQuickReply;
            });

            // Process each button
            foreach ($component['buttons'] as &$button) {
                // Clean phone numbers
                if ($button['type'] === 'PHONE_NUMBER' && isset($button['phone_number'])) {
                    $button['phone_number'] = preg_replace('/[^0-9]/', '', $button['phone_number']);
                }

                // Handle COPY_CODE buttons
                if ($button['type'] === 'COPY_CODE') {
                    unset($button['text']); // COPY_CODE has fixed text
                }
            }
        }
    }

    return $data;
}

/**
 * Normalize variable names to sequential placeholders
 */
function normalizeVariables($text, $mapping, $counter) {
    preg_match_all('/\{\{([^}]+)\}\}/', $text, $matches);

    if (empty($matches[1])) {
        return ['text' => $text, 'mapping' => $mapping, 'counter' => $counter];
    }

    foreach ($matches[1] as $varName) {
        // Skip if already a number
        if (is_numeric($varName)) {
            continue;
        }

        // Create mapping if not exists
        if (!isset($mapping[$varName])) {
            $mapping[$varName] = $counter;
            $counter++;
        }

        // Replace in text
        $text = str_replace('{{' . $varName . '}}', '{{' . $mapping[$varName] . '}}', $text);
    }

    return ['text' => $text, 'mapping' => $mapping, 'counter' => $counter];
}

/**
 * Update example values to match normalized variable order
 */
function updateExampleValues($examples, $mapping) {
    if (empty($mapping) || !is_array($examples)) {
        return $examples;
    }

    $newExamples = [];
    foreach ($mapping as $varName => $index) {
        // Find example value for this variable
        foreach ($examples as $key => $value) {
            if ($key === $varName || $key === (string)$index) {
                $newExamples[$index - 1] = $value;
                break;
            }
        }
    }

    // Fill any gaps with empty strings
    ksort($newExamples);
    return array_values($newExamples);
}
