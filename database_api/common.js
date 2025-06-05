export class AjaxRequest {
  // Method to make an AJAX request
  sendRequest(destination, data) {
    console.log("AjaxRequest.sendRequest()");

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", destination, true); // Destination PHP file will reiceve the request
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // set content type

      xhr.onload = function () {
        if (xhr.status === 200) {
          // If the request was successful

          console.log(xhr.responseText);

          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(new Error("Request failed with status" + xhr.status));
        }
      };

      xhr.onerror = function () {
        reject(new Error("Request failed")); //handel network errors
      };

      //Create URL-encoded string from data object
      const params = new URLSearchParams(data).toString(); // Convert data to URL encoded string
      xhr.send(params); // Send the request
    });
  }
}
