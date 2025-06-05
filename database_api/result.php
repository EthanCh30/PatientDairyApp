<?php

class Result {
    public $isSuccess;
    public $message;
    public $result_code;
    public $result_data;

    public function __construct($isSuccess = false, $message = "", $result_code = 0, $result_data = null) {
        $this->isSuccess = $isSuccess;
        $this->message = $message;
        $this->result_code = $result_code;
        $this->result_data = $result_data;
    }

    // Convert to JSON
    public function toJson() {
        return json_encode([
            'isSuccess' => $this->isSuccess,
            'message' => $this->message,
            'result_code' => $this->result_code,
            'result_data' => $this->result_data
        ]);
    }

    // The method to return success result
    public function setSuccess($message = "", $result_code = 0, $result_data = null) {
        $this->isSuccess = true;
        $this->message = $message;
        $this->result_code = $result_code;
        $this->result_data = $result_data;
    }

    // The method to return failure result
    public function setFailure($message = "", $result_code = 0, $result_data = null) {
        $this->isSuccess = false;
        $this->message = $message;
        $this->result_code = $result_code;
        $this->result_data = $result_data;
    }
}
?>