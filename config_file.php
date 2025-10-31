<?php
// config.php - Configuration File

// Database Configuration
define('DB_HOST', 'sql113.infinityfree.com'); // แก้ตาม host ของคุณ
define('DB_NAME', 'if0_40283543_marine_voting_system'); // ตามชื่อที่ InfinityFree สร้าง
define('DB_USER', 'if0_40283543'); // ชื่อผู้ใช้ฐานข้อมูลของคุณ
define('DB_PASS', 'k2o9QWj9w9ky8');
define('DB_CHARSET', 'utf8mb4');

// Application Settings
define('VOTES_PER_DAY', 1); // จำกัดการโหวต 1 ครั้งต่อวัน
define('TIMEZONE', 'Asia/Bangkok');

// Set timezone
date_default_timezone_set(TIMEZONE);

// Error Reporting (ปิดในโปรดักชั่น)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Settings (ปรับตามต้องการ)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

?>