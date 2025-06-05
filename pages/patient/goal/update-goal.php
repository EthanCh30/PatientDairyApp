<?php

echo "<pre>";
print_r($_POST);
echo "</pre>";

if (isset($_POST["Week"])) {
    require_once "inc/dbconn.inc.php";

    // Use a prepared statement to prevent injection attacks
    $sql = "INSERT INTO Goal(Week, Sleep, Excercise, Eating) VALUES(?,?,?,?);";
    $statement = mysqli_stmt_init($conn);
    mysqli_stmt_prepare($statement, $sql);
    mysqli_stmt_bind_param($statement, 'ssss',$_POST["Week"],$_POST["SHour"],$_POST["EHours"],$_POST["Food"]);

    if (mysqli_stmt_execute($statement)) {
        // Task updated successfully. Return the user to the tasks page.
        header("location: goal.html");
    }
    else {
        echo mysqli_error($conn);
    }
    mysqli_close($conn);
}