<?php
require_once "inc/dbconn.inc.php";

// 查询患者信息
$sql = "SELECT Name, Height, Weight, Age, Sex FROM Patient";
$result = mysqli_query($conn, $sql);
$patients = array();

if ($result && mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        $patients[] = $row;
    }
}

// 输出 JSON 格式的患者信息
header('Content-Type: application/json');
echo json_encode($patients);

// 关闭数据库连接
mysqli_close($conn);
?>