<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// 获取请求的JSON数据
$data = json_decode(file_get_contents('php://input'), true);

// 保存到数据库的逻辑
$servername = "47.238.90.41";
$username = "Care"; 
$password = "JSrpBZwn54PW6Gei"; 
$dbname = "care"; 

// 创建数据库连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}

// 准备并绑定参数
$stmt = $conn->prepare("INSERT INTO Diary (DiaryID, PatientID, Date, Sleep, Exercise, Food, Mood, Affirmation, PatientNote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iisssssss", $data['DiaryID'], $data['PatientID'], $data['Date'], $data['Sleep'], $data['Exercise'], $data['Food'], $data['Mood'], $data['Affirmation'], $data['PatientNote']);

// 执行查询并检查结果
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save diary.']);
}

// 关闭连接
$stmt->close();
$conn->close();
?>
