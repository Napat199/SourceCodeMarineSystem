

-- ตาราง animals - เก็บข้อมูลสัตว์ทะเล
CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150),
    animal_type ENUM('Fish', 'Mammal', 'Invertebrate') NOT NULL,
    subtype VARCHAR(50),
    description TEXT,
    habitat VARCHAR(255),
    image_url VARCHAR(500),
    sound VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง votes - เก็บคะแนนโหวต
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    voter_ip VARCHAR(45),
    vote_date DATE NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
    INDEX idx_animal_votes (animal_id),
    INDEX idx_vote_date (vote_date)
);

-- ตาราง users (Optional - สำหรับระบบ login)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert ข้อมูลสัตว์ทะเลตัวอย่าง
INSERT INTO animals (name, scientific_name, animal_type, subtype, description, habitat, image_url, sound) VALUES
('ปลาการ์ตูน', 'Amphiprion ocellaris', 'Fish', 'ClownFish', 'ปลาสีส้มสดใสที่อาศัยอยู่กับดอกไม้ทะเล มีความสัมพันธ์แบบพึ่งพาอาศัยกัน', 'แนวปะการัง แปซิฟิก', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 'Click click'),
('ฉลามวาฬ', 'Rhincodon typus', 'Fish', 'Shark', 'ปลาที่ใหญ่ที่สุดในโลก กินแพลงก์ตอน มีนิสัยอ่อนโยน', 'มหาสมุทรทั่วโลก', 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=400', 'Silent'),
('โลมา', 'Tursiops truncatus', 'Mammal', 'Dolphin', 'สัตว์เลี้ยงลูกด้วยนมที่ฉลาดมาก สามารถสื่อสารกันได้', 'มหาสมุทรทั่วโลก', 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=400', 'Eee eee eee'),
('วาฬสีน้ำเงิน', 'Balaenoptera musculus', 'Mammal', 'Whale', 'สัตว์ที่ใหญ่ที่สุดในโลก น้ำหนักได้ถึง 200 ตัน', 'มหาสมุทรทั่วโลก', 'https://images.unsplash.com/photo-1564631027894-5bdb4c6e1b5c?w=400', 'Wooooo'),
('ปลาหมึกยักษ์', 'Enteroctopus dofleini', 'Invertebrate', 'Octopus', 'สัตว์ไม่มีกระดูกสันหลังที่ฉลาดที่สุด มี 8 แขน และสมองใน 9 ส่วน', 'แปซิฟิกเหนือ', 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400', 'Silent'),
('แมงกะพรุนกล่อง', 'Chironex fleckeri', 'Invertebrate', 'Jellyfish', 'แมงกะพรุนที่มีพิษรุนแรงที่สุดในโลก มีรูปร่างเหมือนกล่อง', 'มหาสมุทรอินเดีย-แปซิฟิก', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 'Silent'),
('ปลาปักเป้า', 'Tetraodontidae', 'Fish', 'PufferFish', 'ปลาที่สามารถพองตัวขึ้นเมื่อถูกคุกคาม มีพิษในอวัยวะภายใน', 'แนวปะการังเขตร้อน', 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400', 'Puff puff'),
('เต่าทะเล', 'Chelonioidea', 'Invertebrate', 'SeaTurtle', 'สัตว์สูงอายุที่สามารถมีชีวิตได้นานหลายสิบปี ว่ายน้ำข้ามมหาสมุทร', 'มหาสมุทรทั่วโลก', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', 'Silent');

-- สร้าง Admin User ตัวอย่าง (password: admin123)
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('admin', 'admin@marine.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);