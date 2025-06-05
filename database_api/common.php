<?php
    function logToConsole($message) {
        // JSON encode the message to ensure it's valid JSON
        echo "<script>console.log(" . json_encode($message) . ");</script>";
    }
?>