<?php
require_once "../../../inc/dbconn.inc.php";

// Get TherapistID from the request
$therapistID = $_GET['TherapistID'];

// Query to get patients assigned to the given TherapistID
$sql = "SELECT p.PatientID, p.Age, p.Sex, p.CaseType, COALESCE(SUM(m.Duration), 0) AS Duration
        FROM Patient p
        LEFT JOIN PatientMeeting pm ON p.PatientID = pm.PatientID
        LEFT JOIN Meeting m ON pm.MeetingID = m.MeetingID
        WHERE p.TherapistID = ?
        GROUP BY p.PatientID";
        
$statement = mysqli_stmt_init($conn);

if (mysqli_stmt_prepare($statement, $sql)) {
    // Bind the therapistID to the statement
    mysqli_stmt_bind_param($statement, "i", $therapistID);

    // Execute the query
    mysqli_stmt_execute($statement);
    $result = mysqli_stmt_get_result($statement);

    $patientData = [];

    // Fetch the patient data
    while ($row = mysqli_fetch_assoc($result)) {
        $patientData[] = $row;
    }

    // Return the patient data as JSON
    echo json_encode($patientData);
} else {
    echo json_encode([]);
}

$conn->close();
