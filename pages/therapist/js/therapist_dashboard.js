import config from '../../../config.js'; // 根据实际路径调整
document.addEventListener('DOMContentLoaded', () => {
    const upcomingMeetingList = document.getElementById('upcoming-meeting-list');

    // Attempt to fetch meeting data from the server
    fetch(`${config.apiBaseUrl}/get_meeting.php`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // If data is successfully fetched, generate the meeting lists
            if (data.success) {
                const currentDate = new Date();
                const upcomingMeetings = data.meetings.filter(meeting => new Date(meeting.Date) >= currentDate);
                generateUpcomingMeetingList(upcomingMeetings);
            } else {
                console.error('No meetings data found!');
            }
        })
        .catch(error => {
            console.error('Error fetching meetings:', error);
        });

    // Generate upcoming meeting list
    function generateUpcomingMeetingList(meetings) {
        upcomingMeetingList.innerHTML = '';
        meetings.forEach(meeting => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${meeting.Date}</td>
                <td>${meeting.Time}</td>
                <td>${meeting.Topic}</td>
            `;
            upcomingMeetingList.appendChild(row);
        });
    }
});