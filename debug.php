<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'php.php';

echo "✅ php.php loaded successfully<br>";

$db = Database::getInstance()->getConnection();
echo "✅ Database connected successfully<br>";

$sql = "SELECT * FROM animals LIMIT 3";
$result = $db->query($sql);

if (!$result) {
    die("❌ SQL Error: " . $db->error);
}

while ($row = $result->fetch_assoc()) {
    echo "🐟 " . $row['name'] . "<br>";
}

echo "✅ All good!";
?>
