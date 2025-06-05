<?php
require_once "../inc/dbconn.inc.php"; // Include the database connection

// Get TherapistID and PatientID from the form submission
$therapistID = $_POST['TherapistID'];
$patientID = $_POST['PatientID'];

// Validate the input
if (isset($therapistID) && isset($patientID)) {
    // SQL query to insert assignment
    $sql = "INSERT INTO Assignments (TherapistID, PatientID) VALUES (?, ?)";
    
    $statement = mysqli_stmt_init($conn);
    
    if (mysqli_stmt_prepare($statement, $sql)) {
        mysqli_stmt_bind_param($statement, "ii", $therapistID, $patientID);
        
        // Execute the query
        if (mysqli_stmt_execute($statement)) {
            echo "Patient successfully assigned to therapist!";
        } else {
            echo "Error: " . mysqli_stmt_error($statement);
        }
    } else {
        echo "Error preparing the SQL statement.";
    }
} else {
    echo "Please select both therapist and patient.";
}

$conn->close(); // Close the connection
?>
