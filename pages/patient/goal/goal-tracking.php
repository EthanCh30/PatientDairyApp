<?php
require_once '../../../database_api/goal_api.php'; // Include the api class


$result = new Result(); // Create a result object

//Handel POST request
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // GET POST DATA
    if(isset($_POST['getGoals'])) {
        $patient_id = $_POST["patientId"] ?? ''; // If there is no id, set it to empty string 

        if(empty($patient_id)) {
            echo $result->setFailure("Required data is missing (patient_id).", 400);
            exit;
        }

        echo getAllGoals($patient_id);
    } 
    // Update goal state to complete (completeGoal)
    // Complete goal -> change state to 2
    else if(isset($_POST['completeGoal'])) {
        $goalId = $_POST['goalId'] ?? '';
        
        if($goalId != '') {
            echo setCompletedGoals($goalId);
        }
    
    }



    // Update goal
   exit;
}
?>