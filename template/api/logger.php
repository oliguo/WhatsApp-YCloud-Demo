<?php
/**
 * Simple Logger for debugging
 */

class Logger {
    private static $logDir;
    
    public static function init() {
        self::$logDir = __DIR__ . '/../logs';
        
        // Create logs directory if not exists
        if (!is_dir(self::$logDir)) {
            mkdir(self::$logDir, 0755, true);
        }
    }
    
    /**
     * Log a message
     * @param string $level - Log level (INFO, ERROR, DEBUG, API)
     * @param string $message - Log message
     * @param mixed $data - Optional data to log
     */
    public static function log($level, $message, $data = null) {
        self::init();
        
        $date = date('Y-m-d');
        $time = date('Y-m-d H:i:s');
        $logFile = self::$logDir . "/{$date}.log";
        
        $logEntry = "[{$time}] [{$level}] {$message}";
        
        if ($data !== null) {
            if (is_array($data) || is_object($data)) {
                $logEntry .= "\n" . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            } else {
                $logEntry .= " | " . $data;
            }
        }
        
        $logEntry .= "\n" . str_repeat('-', 80) . "\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    /**
     * Log API request
     */
    public static function apiRequest($method, $endpoint, $data = null) {
        self::log('API_REQ', "{$method} {$endpoint}", $data);
    }
    
    /**
     * Log API response
     */
    public static function apiResponse($httpCode, $response) {
        $level = $httpCode >= 200 && $httpCode < 300 ? 'API_RES' : 'API_ERR';
        self::log($level, "HTTP {$httpCode}", $response);
    }
    
    /**
     * Log info
     */
    public static function info($message, $data = null) {
        self::log('INFO', $message, $data);
    }
    
    /**
     * Log error
     */
    public static function error($message, $data = null) {
        self::log('ERROR', $message, $data);
    }
    
    /**
     * Log debug
     */
    public static function debug($message, $data = null) {
        self::log('DEBUG', $message, $data);
    }
}
