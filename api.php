<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// api.php - REST API Endpoint
require_once 'php.php';
require_once 'config_file.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

// รับ Request
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getAnimals':
            // ดึงข้อมูลสัตว์ทั้งหมด
            $animals = AnimalFactory::getAllAnimals();
            $data = array_map(function($animal) {
                return array_merge(
                    $animal->toArray(),
                    ['votes' => $animal->getVoteCount()]
                );
            }, $animals);
            
            echo json_encode([
                'success' => true,
                'data' => $data
            ]);
            break;
            
        case 'getAnimal':
            // ดึงข้อมูลสัตว์ตัวเดียว
            $id = $_GET['id'] ?? 0;
            $animal = AnimalFactory::getAnimalById($id);
            
            if ($animal) {
                $data = array_merge(
                    $animal->toArray(),
                    [
                        'votes' => $animal->getVoteCount(),
                        'swim_method' => $animal->swim()
                    ]
                );
                
                echo json_encode([
                    'success' => true,
                    'data' => $data
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'ไม่พบสัตว์ที่ต้องการ'
                ]);
            }
            break;
            
        case 'vote':
            // โหวตสัตว์
            if ($method !== 'POST') {
                throw new Exception('Method not allowed');
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            $animalId = $data['animal_id'] ?? 0;
            $voterIp = $_SERVER['REMOTE_ADDR'];
            
            $animal = AnimalFactory::getAnimalById($animalId);
            
            if ($animal) {
                $result = $animal->addVote($voterIp);
                echo json_encode($result);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'ไม่พบสัตว์ที่ต้องการโหวต'
                ]);
            }
            break;
            
        case 'leaderboard':
            // ดึงตารางคะแนน
            $limit = $_GET['limit'] ?? 10;
            $leaderboard = VotingManager::getLeaderboard($limit);
            
            $data = array_map(function($item) {
                return [
                    'animal' => $item['animal']->toArray(),
                    'votes' => $item['votes']
                ];
            }, $leaderboard);
            
            echo json_encode([
                'success' => true,
                'data' => $data,
                'total_votes' => VotingManager::getTotalVotes()
            ]);
            break;
            
        case 'stats':
            // สถิติทั้งหมด
            $conn = Database::getInstance()->getConnection();
            
            // นับสัตว์แต่ละประเภท
            $typeStats = $conn->query("
                SELECT animal_type, COUNT(*) as count 
                FROM animals 
                GROUP BY animal_type
            ")->fetch_all(MYSQLI_ASSOC);
            
            // โหวตต่อวัน (7 วันล่าสุด)
            $dailyVotes = $conn->query("
                SELECT vote_date, COUNT(*) as count 
                FROM votes 
                WHERE vote_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY vote_date 
                ORDER BY vote_date DESC
            ")->fetch_all(MYSQLI_ASSOC);
            
            echo json_encode([
                'success' => true,
                'data' => [
                    'total_animals' => count(AnimalFactory::getAllAnimals()),
                    'total_votes' => VotingManager::getTotalVotes(),
                    'type_stats' => $typeStats,
                    'daily_votes' => $dailyVotes
                ]
            ]);
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action'
            ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>