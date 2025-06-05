document.addEventListener('DOMContentLoaded', function() {
    const therapistDetails = document.getElementById("therapist-details");
    const detailsWindow = document.getElementById("details-window");
    const closeBtn = document.getElementById("closeBtn");
    const sortSelect = document.querySelector('.sort');
    const detailsBody = document.querySelector('.details-body');
    const detailsHead = document.querySelector('.patient-table thead');

    let therapists = [];
    let patientData = {};

    // Fetch therapist data along with patient counts from the server
    fetch('./php/fetch_therapist.php')  // Adjust the path as needed
        .then(response => response.json())
        .then(data => {
            therapists = data; // Assign fetched data to therapists
            populateTherapists(); // Call function to populate therapists
        })
        .catch(error => console.error('Error fetching therapist data:', error));

    function populateTherapists() {
        therapists.forEach(therapist => {
            const li = document.createElement('li');
            li.className = 'name';

            li.innerHTML = `
            <div class="therapist-details">
                    <div class="details">
                        <h3>${therapist.Name}</h3>
                        <p>Total patients: <span>${therapist.patient_count}</span></p>
                    </div>
            </div>`;
            
            li.addEventListener("click", () => {
                document.querySelectorAll('.name').forEach(item => {
                    item.classList.remove('selected');
                });
                detailsWindow.hidden = false;
                li.classList.add('selected');
                fetchAndDisplayPatientDetails(therapist.TherapistID);
            });

            therapistDetails.appendChild(li);
        });
    }

    function fetchAndDisplayPatientDetails(therapistID) {
        fetch(`./php/fetch_patients_by_therapist.php?TherapistID=${therapistID}`)  // Adjust path as needed
            .then(response => response.json())
            .then(data => {
                patientData = data; // Save fetched patient data
                updateDetailsWindow(data); // Display the patient data
            })
            .catch(error => console.error('Error fetching patient data:', error));
    }

    function updateDetailsWindow(patientData) {
        const detailsBody = document.querySelector('.details-body');
        const detailsHead = document.querySelector('.patient-table thead');
    
        // Clear any existing data
        detailsBody.innerHTML = ''; 
        detailsHead.innerHTML = '';
    
        // Create the table header
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Age</th>
            <th>Sex</th>
            <th>Case Type</th>
            <th>Total Duration (mins)</th>
        `;
        detailsHead.appendChild(headerRow);
    
        // Check if there is patient data
        if (patientData && patientData.length > 0) {
            // Loop through the patient data and add rows to the table body
            patientData.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.Age}</td>
                    <td>${patient.Sex}</td>
                    <td>${patient.CaseType}</td>
                    <td>${patient.Duration !== null ? patient.Duration : 0}</td>
                `;
                detailsBody.appendChild(row); // Append the row to the table
            });
        } else {
            // If no patients are found, show a message
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="10">No patients found for this therapist.</td>`;
            detailsBody.appendChild(row);
        }
    }

    // Sorting functionality
    sortSelect.addEventListener('change', () => {
        const sortBy = sortSelect.value;
        sortPatientData(sortBy);
    });

    function sortPatientData(sortBy) {
        if (patientData && patientData.length > 0) {
            // Sort based on the selected option
            patientData.sort((a, b) => {
                if (sortBy == 'none'){
                    updateDetailsWindow(patientData);
                }
                else if (sortBy === 'age') {
                    return a.Age - b.Age;
                } else if (sortBy === 'sex') {
                    return a.Sex.localeCompare(b.Sex);
                } else if (sortBy === 'caseType') {
                    return a.CaseType.localeCompare(b.CaseType);
                } else if (sortBy === 'duration') {
                    return b.Duration - a.Duration ;
                }
                return 0;
            });
            // Re-render the table with sorted data
            updateDetailsWindow(patientData);
        }
    }
    
    

    closeBtn.addEventListener("click", () => {
        detailsWindow.hidden = true;
        document.querySelectorAll('.name').forEach(item => {
            item.classList.remove('selected');
        });
    });
});
