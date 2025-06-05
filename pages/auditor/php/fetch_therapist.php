<?php
require_once "../../../inc/dbconn.inc.php"; 

// Query to get therapists and their patient count
$sql = "SELECT t.TherapistID, t.Name,  COUNT(DISTINCT p.PatientID) as patient_count 
        FROM Therapist t
        LEFT JOIN Patient p ON t.TherapistID = p.TherapistID 
        GROUP BY t.TherapistID";

$statement = mysqli_stmt_init($conn);

if (mysqli_stmt_prepare($statement, $sql)) {
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);

    $therapistData = [];

    while ($row = mysqli_fetch_assoc($result)) {
        $therapistData[] = $row;  // Collect therapist info and patient count
    }

    // Send the data back as JSON
    echo json_encode($therapistData);
} else {
    echo json_encode([]);
}

$conn->close();
?>
