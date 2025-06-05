<?php 
    require_once "../../../database_api/goal_api.php";

    $result = new Result(); // Create a result object

    // Get the data from the request
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        
        // GET POST DATA

        $patient_id = $_POST["patientID"] ?? ''; // If there is no id, set it to empty string 

        // Add goal
        if (isset($_POST["add"])) {
            
            $week = $_POST["week"];

            $sleepHours = $_POST["sleepHours"] ?? '';
            $exerciseHours = $_POST["exerciseHours"] ?? '';
            $eatFoods = $_POST["eatFoods"] ?? '';
            $result = addGoal($patient_id, $week, $sleepHours, $exerciseHours, $eatFoods);

            echo $result;
        } else if(isset($_POST['getGoals'])) {
    
            if(empty($patient_id)) {
                echo $result->setFailure("Required data is missing (patientID).", 400);
                exit;
            }
    
            echo getAllGoals($patient_id);
        } else if(isset($_POST['update'])) {

            $goalID = $_POST["goalID"]; //!?!
            $week = $_POST["week"];

            $sleepHours = $_POST["sleepHours"] ?? '';
            $exerciseHours = $_POST["exerciseHours"] ?? '';
            $eatFoods = $_POST["eatFoods"] ?? '';
            $result = updateGoal($goalID, $patient_id, $week, $sleepHours, $exerciseHours, $eatFoods);

            echo $result;
        }

        // Update goal
       exit;
    }
    ?>
