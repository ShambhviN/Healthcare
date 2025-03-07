// API endpoint for handling requests
var API_ENDPOINT = "https://1kinkv4ghg.execute-api.us-east-1.amazonaws.com/prod";

// Function to handle the saving of patient data
document.getElementById("insertPatient").onclick = function () {
    // Collect the data from input fields
    var inputData = {
        "patientId": document.getElementById("patientId").value,
        "name": document.getElementById("name").value,
        "department": document.getElementById("department").value,
        "age": document.getElementById("age").value,
        "doctorName": document.getElementById("doctorName").value,
        "date": document.getElementById("date").value,
        "time": document.getElementById("time").value
    };

    // Get the medical history PDF file (if provided)
    var medicalHistoryFile = document.getElementById("medicalHistoryFile").files[0]; // Assuming the file input field ID is 'medicalHistoryFile'

    // If a medical history file is provided, convert it to base64
    if (medicalHistoryFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
            // Base64 encoded data of the PDF
            var medicalHistoryPDF = e.target.result.split(',')[1];  // Remove the "data:application/pdf;base64," part

            // Add the base64 PDF data to the inputData object
            inputData.medicalHistoryPDF = medicalHistoryPDF;

            // Log the data to verify the payload
            console.log("Payload being sent to API:", inputData);

            // Send the data to the API
            sendToAPI(inputData);
        };
        reader.readAsDataURL(medicalHistoryFile);
    } else {
        // If no file is provided, proceed without the medical history
        console.log("Payload being sent to API:", inputData);
        sendToAPI(inputData);
    }
};

// Function to send data to the API
function sendToAPI(data) {
    $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            console.log("Response from API:", response);
            document.getElementById("patientSaved").innerHTML = "Patient Data Saved!";

            // Display the dummy response message
            document.getElementById("responseMessage").style.display = 'block';

            // Clear the input fields after successful submission
            document.getElementById("patientId").value = '';
            document.getElementById("name").value = '';
            document.getElementById("department").value = '';
            document.getElementById("age").value = '';
            document.getElementById("doctorName").value = '';
            document.getElementById("date").value = '';
            document.getElementById("time").value = '';
            
            // Refresh the appointments list after saving the data
            document.getElementById("getPatient").click();
        },
        error: function (xhr, status, error) {
            console.error("Error saving data:", xhr.responseText || error);
            alert(`Error saving data: ${xhr.responseText || error}`);
        }
    });
}

// Function to handle fetching and displaying all patient appointments
document.getElementById("getPatient").onclick = function () {
    // Make a GET request to retrieve patient data
    $.ajax({
        url: API_ENDPOINT,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            // Clear previous data in the table
            var tableBody = document.querySelector("#patientData tbody");
            tableBody.innerHTML = '';

            // Loop through the response data and display it in the table
            response.forEach(function (data) {
                var row = document.createElement("tr");

                row.innerHTML = `
                    <td>${data.appointmentId}</td>
                    <td>${data.patientId}</td>
                    <td>${data.name}</td>
                    <td>${data.age}</td>
                    <td>${data.department}</td>
                    <td>${data.doctorName}</td>
                    <td>${data.date}</td>
                    <td>${data.time}</td>
                `;

                // Append the new row to the table body
                tableBody.appendChild(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Error retrieving patient data:", xhr.responseText || error);
            alert(`Error retrieving data: ${xhr.responseText || error}`);
        }
    });
};

// Optionally add this code to handle the display of the dummy message on form submit
function showDummyResponse() {
    // Display the dummy response message
    document.getElementById("responseMessage").style.display = 'block';
}
