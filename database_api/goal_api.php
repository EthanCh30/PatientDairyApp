<?php
    require_once("dbconn.inc.php");
    require_once("result.php");
    require_once("common.php");
// Function to add a goal
// Function to add a new goal
function addGoal($patient_id, $week, $sleepHours, $exerciseHours, $eatFoods) {
    $result = new Result(); // Create a Result object

    // Validate required fields for adding a goal
    if (empty($patient_id) || empty($week)) {
        $result->setFailure("Required data is missing (patient_id, week).", 400);
        return $result->toJson();
    }

    // Ensure start_date has correct format
    //$start_date = date('Y-m-d H:i:s', strtotime($week)); // Format the start_date properly

    // Prepare and execute the SQL query
    $query = "INSERT INTO Goal (PatientID, Week, Sleep, Exercise, Eating, state) VALUES (?, ?, ?, ?, ?, 1)";
    $stmt = executeStatement($query, ["issss", $patient_id, $week, $sleepHours, $exerciseHours, $eatFoods]);

    $goal_id = '';

    if ($stmt && $stmt->affected_rows > 0) {
        // Set success response
        $result->setSuccess("Goal added successfully.", 200, [
            'goal_id' => $goal_id,
            'patient_id' => $patient_id,
            'week' => $week,
            'sleep' => $sleepHours,
            'exercise' => $exerciseHours,
            'eating' => $eatFoods,
        ]);
    } else {
        // Handle query failure
        $result->setFailure("Failed to add goal: " . ($stmt ? $stmt->error : 'Query preparation failed'), 500);
    }

    return $result->toJson();
}

// Function to get goals based on patient_id
function getAllGoals($patientId) {
    $result = new Result(); 

    $query = "SELECT * FROM Goal WHERE PatientID = ? ORDER BY Week ASC";
    $params = ["i", $patientId];

    $stmt = executeStatement($query, $params);

    if ($stmt) {
        $result_data = $stmt->get_result(); //Get the result set
        
        // Check if there are any results
        if ($result_data->num_rows > 0 ) {
            
            $goals = [];
            while ($goal = $result_data->fetch_assoc()) {
                $goals[] = $goal; // Add each goal to the array
            }
            
            $result->setSuccess("Goals fetched successfully.", 200, $goals);

        } else {

            // No goals found for the patientId
            $result->setFailure("No goals found.", 404);
            
        }

    } else {

        // Handle statement preparation failure
        $result->setFailure("Failed to get goals: " . ($stmt ? $stmt->error : 'Query preparation failed'), 500);
    }
    
    return $result->toJson();
}

function updateGoal($goalID, $patient_id, $week, $sleepHours, $exerciseHours, $eatFoods) {
    $result = new Result(); // Create a Result object

    // Validate required fields for adding a goal
    if (empty($goalID) || empty($week)|| empty($patient_id)) {
        $result->setFailure("Required data is missing (patient_id, week).", 400);
        return $result->toJson();
    }

    //logToConsole("goalID ".$goalID."patientID ". $patient_id);

    // Ensure start_date has correct format
    //$start_date = date('Y-m-d H:i:s', strtotime($week)); // Format the start_date properly

    // Prepare and execute the SQL query
    $query = "UPDATE Goal SET PatientID = ?, Week = ?, Sleep = ?, Exercise = ?, Eating = ? WHERE GoalID = ?";

    $stmt = executeStatement($query, ["issssi", $patient_id, $week, $sleepHours, $exerciseHours, $eatFoods, $goalID]);

    $goal_id = '';

    if ($stmt && $stmt->affected_rows > 0) {
        // Set success response
        $result->setSuccess("Goal updated successfully.", 200, [
            'goal_id' => $goal_id,
            'patient_id' => $patient_id,
            'week' => $week,
            'sleep' => $sleepHours,
            'exercise' => $exerciseHours,
            'eating' => $eatFoods,
        ]);
    } else {
        // Handle query failure
        $result->setFailure("Failed to update goal: " . ($stmt ? $stmt->error : 'Query preparation failed'), 500);
    }

    return $result->toJson();
}

function updateGoalState($goal_id, $state) {
    $result = new Result(); // Create a Result object

    // Validate required fields for updating a goal
    if (empty($goal_id)) {
        $result->setFailure("Required data is missing (goal_id, state).", 401);
        return $result->toJson();
    }

    // Prepare and execute the SQL query for updating
    $query = "UPDATE Goal SET state = ? WHERE GoalID = ?";
    $stmt = executeStatement($query, ["ii", $state, $goal_id]);

    if ($stmt && $stmt->affected_rows > 0) {
        // Set success response
        $result->setSuccess("Goal state updated successfully.", 200, [
            'goal_id' => $goal_id,
            'state' => $state,
        ]);
    } else {
        // Handle query failure
                            
        $result->setFailure("Failed to update goal state: " . ($stmt ? $stmt->error : 'Query preparation failed') . $state, 501);
    }

    return $result->toJson();
}

function setCompletedGoals($patientId) {
    return updateGoalState($patientId, 2);
}