import config from './config.js'; // 根据实际路径调整

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = `${config.apiBaseUrl}/staff.php`;  // 替换成你的后端API 
    const tableBody = document.getElementById('patient-table-body');

    // Function to fetch patient data from the backend
    async function fetchPatientData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            console.log(data); // 输出返回的数据以进行调试

            tableBody.innerHTML = ''; // Clear existing data
            
            // Iterate over each patient record and insert rows into the table
            data.forEach(patient => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${patient.Name}</td>
                    <td>${patient.Height}</td>
                    <td>${patient.Weight}</td>
                    <td>${patient.Age}</td>
                    <td>${patient.Sex}</td>
                `;
                tableBody.appendChild(row);
            });

            // Make the details window visible after loading data
            document.getElementById('details-window').hidden = false;
        } catch (error) {
            console.error('Error fetching patient data:', error);
        }
    }

    // Call the function to fetch data when the page loads
    fetchPatientData();
});