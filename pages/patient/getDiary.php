<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define("DB_HOST", "47.238.90.41");
define("DB_NAME", "care");
define("DB_USER", "Care");
define("DB_PASS", "JSrpBZwn54PW6Gei");

$patientID = 11; // 默认的 PatientID
// $date = "2023-09-01";
$date = $_GET['date'] ?? null; // 从请求中获取日期参数
if ($date) {
    // 创建数据库连接
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // 检查连接是否成功
    if ($conn->connect_error) {
        echo json_encode(["error" => "连接错误: " . $conn->connect_error]);
        exit;
    }

    // SQL 查询，获取 Mood, Food, Exercise, Affirmation, PatientNote
    $sql = "SELECT Mood, Food, Exercise, Affirmation, PatientNote 
            FROM Diary 
            WHERE PatientID = ? AND Date = ?";
    
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        echo json_encode(["error" => "查询准备失败: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("is", $patientID, $date); // "is" 表示第一个参数是整型，第二个参数是字符串
    $stmt->execute();
    $result = $stmt->get_result();

    $diaryEntries = [];
    while ($row = $result->fetch_assoc()) {
        $diaryEntries[] = $row;
    }

    if ($diaryEntries) {
        echo json_encode($diaryEntries);
    } else {
        echo json_encode(["message" => "没有找到相关记录"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Date parameter is required"]);
}
