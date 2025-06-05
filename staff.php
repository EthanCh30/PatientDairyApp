<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Patient Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px auto;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 12px;
            text-align: center;
        }

        th {
            background-color: #4CAF50;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

<h1>Patient Information</h1>

<table>
    <thead>
        <tr>
            <th>PatientID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Email</th>
            <th>ContactNo</th>
            <th>Address</th>
            <th>Language</th>
            <th>CaseType</th>
            <th>IsSevere</th>
            <th>GroupName</th>
            <th>TherapistID</th>
        </tr>
    </thead>
    <tbody>
        <?php
        // 数据库连接信息
        $servername = "localhost";
        $username = "root";
        $password = "";  // 默认情况下无密码
        $dbname = "care";

        // 创建连接
        $conn = new mysqli($servername, $username, $password, $dbname);

        // 检查连接
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // 从 patient 表中查询信息
        $sql = "SELECT PatientID, Name, Age, Sex, Height, Weight, Email, ContactNo, Address, Language, CaseType, IsSevere, GroupName, TherapistID FROM patient";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            // 输出每行数据
            while($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["PatientID"] . "</td>";
                echo "<td>" . $row["Name"] . "</td>";
                echo "<td>" . $row["Age"] . "</td>";
                echo "<td>" . $row["Sex"] . "</td>";
                echo "<td>" . $row["Height"] . "</td>";
                echo "<td>" . $row["Weight"] . "</td>";
                echo "<td>" . $row["Email"] . "</td>";
                echo "<td>" . $row["ContactNo"] . "</td>";
                echo "<td>" . $row["Address"] . "</td>";
                echo "<td>" . $row["Language"] . "</td>";
                echo "<td>" . $row["CaseType"] . "</td>";
                echo "<td>" . $row["IsSevere"] . "</td>";
                echo "<td>" . $row["GroupName"] . "</td>";
                echo "<td>" . $row["TherapistID"] . "</td>";
                echo "</tr>";
            }
        } else {
            echo "<tr><td colspan='14'>No data found</td></tr>";
        }

        // 关闭数据库连接
        $conn->close();
        ?>
    </tbody>
</table>

</body>
</html>
