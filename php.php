<?php
// ============================================
// INTERFACES
// ============================================

// Interface สำหรับสิ่งที่สามารถโหวตได้
interface IVotable {
    public function addVote($voterIp);
    public function getVoteCount();
    public function getTotalVotes();
}

// Interface สำหรับการแสดงผล
interface IDisplayable {
    public function toArray();
    public function displayCard();
}

// ============================================
// ABSTRACT CLASS
// ============================================

// Abstract Class สำหรับสัตว์ทั่วไป
abstract class Animal implements IDisplayable {
    protected $id;
    protected $name;
    protected $scientificName;
    protected $description;
    protected $habitat;
    protected $imageUrl;
    
    public function __construct($data = []) {
        $this->id = $data['id'] ?? null;
        $this->name = $data['name'] ?? '';
        $this->scientificName = $data['scientific_name'] ?? '';
        $this->description = $data['description'] ?? '';
        $this->habitat = $data['habitat'] ?? '';
        $this->imageUrl = $data['image_url'] ?? '';
    }
    
    // Abstract methods ที่ class ลูกต้อง implement
    abstract public function makeSound();
    abstract public function swim();
    abstract public function getAnimalType();
    
    // Getters
    public function getId() { return $this->id; }
    public function getName() { return $this->name; }
    public function getScientificName() { return $this->scientificName; }
    public function getDescription() { return $this->description; }
    public function getHabitat() { return $this->habitat; }
    public function getImageUrl() { return $this->imageUrl; }
    
    // Implementation ของ IDisplayable
    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'scientific_name' => $this->scientificName,
            'description' => $this->description,
            'habitat' => $this->habitat,
            'image_url' => $this->imageUrl,
            'type' => $this->getAnimalType(),
            'sound' => $this->makeSound()
        ];
    }
    
    public function displayCard() {
        return "
        <div class='animal-card' data-id='{$this->id}'>
            <img src='{$this->imageUrl}' alt='{$this->name}'>
            <h3>{$this->name}</h3>
            <p class='scientific'>{$this->scientificName}</p>
            <p class='type'>{$this->getAnimalType()}</p>
        </div>
        ";
    }
}

// ============================================
// MARINE ANIMAL ABSTRACT CLASS (Inheritance)
// ============================================

abstract class MarineAnimal extends Animal implements IVotable {
    protected $sound;
    protected static $db;
    
    public function __construct($data = []) {
        parent::__construct($data);
        $this->sound = $data['sound'] ?? 'Silent';
    }
    
    // Implementation ของ IVotable
    public function addVote($voterIp) {
        $conn = Database::getInstance()->getConnection();
        $date = date('Y-m-d');
        
        // ตรวจสอบว่าโหวตแล้วหรือยัง (จำกัด 1 ครั้ง/วัน)
        $stmt = $conn->prepare("
            SELECT COUNT(*) as count FROM votes 
            WHERE animal_id = ? AND voter_ip = ? AND vote_date = ?
        ");
        $stmt->bind_param("iss", $this->id, $voterIp, $date);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        
        if ($result['count'] > 0) {
            return ['success' => false, 'message' => 'คุณโหวตสัตว์นี้วันนี้แล้ว'];
        }
        
        // เพิ่มคะแนนโหวต
        $stmt = $conn->prepare("
            INSERT INTO votes (animal_id, voter_ip, vote_date) VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iss", $this->id, $voterIp, $date);
        
        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'โหวตสำเร็จ!'];
        }
        return ['success' => false, 'message' => 'เกิดข้อผิดพลาด'];
    }
    
    public function getVoteCount() {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM votes WHERE animal_id = ?");
        $stmt->bind_param("i", $this->id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        return $result['count'];
    }
    
    public function getTotalVotes() {
        return $this->getVoteCount();
    }
}

// ============================================
// CONCRETE CLASSES (Polymorphism)
// ============================================

// คลาสปลา
class Fish extends MarineAnimal {
    private $subtype;
    
    public function __construct($data = []) {
        parent::__construct($data);
        $this->subtype = $data['subtype'] ?? 'General Fish';
    }
    
    public function getAnimalType() {
        return "ปลา ({$this->subtype})";
    }
    
    public function makeSound() {
        return $this->sound;
    }
    
    public function swim() {
        return "ว่ายน้ำด้วยการกระดกหางและครีบ";
    }
}

// คลาสสัตว์เลี้ยงลูกด้วยนม
class Mammal extends MarineAnimal {
    private $subtype;
    
    public function __construct($data = []) {
        parent::__construct($data);
        $this->subtype = $data['subtype'] ?? 'General Mammal';
    }
    
    public function getAnimalType() {
        return "สัตว์เลี้ยงลูกด้วยนม ({$this->subtype})";
    }
    
    public function makeSound() {
        return $this->sound;
    }
    
    public function swim() {
        return "ว่ายน้ำด้วยการกระดกหาง ขึ้นมาหายใจที่ผิวน้ำ";
    }
}

// คลาสสัตว์ไม่มีกระดูกสันหลัง
class Invertebrate extends MarineAnimal {
    private $subtype;
    
    public function __construct($data = []) {
        parent::__construct($data);
        $this->subtype = $data['subtype'] ?? 'General Invertebrate';
    }
    
    public function getAnimalType() {
        return "สัตว์ไม่มีกระดูกสันหลัง ({$this->subtype})";
    }
    
    public function makeSound() {
        return "Silent (ไม่มีเสียง)";
    }
    
    public function swim() {
        return "ว่ายน้ำด้วยการขับน้ำหรือใช้แขน";
    }
}

// ============================================
// DATABASE CLASS (Singleton Pattern)
// ============================================

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $host = 'sql113.infinityfree.com';
        $dbname = 'if0_40283543_marine_voting_system';
        $username = 'if0_40283543';
        $password = 'k2o9QWj9w9ky8';
        
        $this->connection = new mysqli($host, $username, $password, $dbname);
        
        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
        
        $this->connection->set_charset("utf8mb4");
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}

// ============================================
// ANIMAL FACTORY (Factory Pattern)
// ============================================

class AnimalFactory {
    public static function createAnimal($data) {
        $type = $data['animal_type'] ?? '';
        
        switch ($type) {
            case 'Fish':
                return new Fish($data);
            case 'Mammal':
                return new Mammal($data);
            case 'Invertebrate':
                return new Invertebrate($data);
            default:
                throw new Exception("Unknown animal type: $type");
        }
    }
    
    public static function getAllAnimals() {
        $conn = Database::getInstance()->getConnection();
        $result = $conn->query("SELECT * FROM animals ORDER BY name");
        
        $animals = [];
        while ($row = $result->fetch_assoc()) {
            $animals[] = self::createAnimal($row);
        }
        
        return $animals;
    }
    
    public static function getAnimalById($id) {
        $conn = Database::getInstance()->getConnection();
        $stmt = $conn->prepare("SELECT * FROM animals WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            return self::createAnimal($row);
        }
        
        return null;
    }
}

// ============================================
// VOTING MANAGER CLASS
// ============================================

class VotingManager {
    public static function getLeaderboard($limit = 10) {
        $conn = Database::getInstance()->getConnection();
        $query = "
            SELECT a.*, COUNT(v.id) as vote_count
            FROM animals a
            LEFT JOIN votes v ON a.id = v.animal_id
            GROUP BY a.id
            ORDER BY vote_count DESC
            LIMIT ?
        ";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $leaderboard = [];
        while ($row = $result->fetch_assoc()) {
            $animal = AnimalFactory::createAnimal($row);
            $leaderboard[] = [
                'animal' => $animal,
                'votes' => $row['vote_count']
            ];
        }
        
        return $leaderboard;
    }
    
    public static function getTotalVotes() {
        $conn = Database::getInstance()->getConnection();
        $result = $conn->query("SELECT COUNT(*) as total FROM votes");
        $row = $result->fetch_assoc();
        return $row['total'];
    }
}

?>