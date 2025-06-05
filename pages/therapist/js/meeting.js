import config from '../../../config.js'; // 根据实际路径调整

document.addEventListener('DOMContentLoaded', () => {
    const meetingList = document.getElementById('meeting-list');
    const meetingHistory = document.getElementById('meeting-history');

    const addButton = document.getElementById('addMeetingButton');
    if (addButton) {
        addButton.addEventListener('click', showMeetingModal);
    } else {
        console.error('Add Meeting Button not found!');
    }

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
                const pastMeetings = data.meetings.filter(meeting => new Date(meeting.Date) < currentDate);
                generateMeetingList(upcomingMeetings);
                generateMeetingHistory(pastMeetings);
            } else {
                console.error('Error fetching meetings:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching meetings:', error);
        });

    // Generate meeting list
    function generateMeetingList(meetings) {
        meetingList.innerHTML = '';
        meetings.forEach(meeting => {
            const tr = document.createElement('tr');
            tr.className = 'meeting-item';
            tr.id = `meeting-${meeting.MeetingID}`;
            tr.innerHTML = `
                <td>${meeting.Date}</td>
                <td>${meeting.Time}</td>
                <td>${meeting.Topic}</td>
            `;
            tr.addEventListener('click', () => {
                // Remove 'selected' class from all meeting items
                document.querySelectorAll('.meeting-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Add 'selected' class to the clicked meeting item
                tr.classList.add('selected');

                // 显示会议详情
                showMeetingDetails(meeting);
            });
            meetingList.appendChild(tr);
        });
    }

    // Generate meeting history
    function generateMeetingHistory(meetings) {
        meetingHistory.innerHTML = '';
        meetings.forEach(meeting => {
            const tr = document.createElement('tr');
            tr.className = 'meeting-history-item';
            tr.id = `meeting-history-${meeting.MeetingID}`;
            tr.innerHTML = `
                <td>${meeting.Date}</td>
                <td>${meeting.Time}</td>
                <td>${meeting.Topic}</td>
            `;
            tr.addEventListener('click', () => {
                // Remove 'selected' class from all history items
                document.querySelectorAll('.meeting-history-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Add 'selected' class to the clicked history item
                tr.classList.add('selected');

                // 显示会议详情
                showMeetingDetails(meeting);
            });
            meetingHistory.appendChild(tr);
        });
    }

    function showMeetingModal() {
        // Call the showMeetingModal function from addmeeting.js
        if (typeof window.showMeetingModal === 'function') {
            console.log('Showing meeting modal');
            window.showMeetingModal();
        } else {
            console.error('showMeetingModal function not found!');
        }
    }

    // 显示会议详情的右拉菜单
    function showMeetingDetails(meeting) {
        const detailsDate = document.getElementById('detailsDate');
        const detailsTime = document.getElementById('detailsTime');
        const detailsTopic = document.getElementById('detailsTopic');
        const detailsLocation = document.getElementById('detailsLocation');
        const detailsDescription = document.getElementById('detailsDescription');
        const detailsDuration = document.getElementById('detailsDuration');
    
        if (detailsDate && detailsTime && detailsTopic && detailsLocation && detailsDescription && detailsDuration) {
            detailsDate.textContent = `Date: ${meeting.Date}`;
            detailsTime.textContent = `Time: ${meeting.Time}`;
            detailsTopic.textContent = `Topic: ${meeting.Topic}`;
            detailsLocation.textContent = `Location: ${meeting.Location}`;
            detailsDescription.textContent = `Description: ${meeting.Description}`;
            detailsDuration.textContent = `Duration: ${meeting.Duration} minutes`;
    
            console.log('Showing meeting details:', meeting);
            document.getElementById('meeting-details-slide-menu').style.width = '300px';
            document.addEventListener('click', closeMeetingDetailsSlideMenuOnClickOutside);
        } else {
            console.error('One or more detail elements not found');
        }
    }
    
    function closeMeetingDetailsSlideMenuOnClickOutside(event) {
        const slideMenu = document.getElementById('meeting-details-slide-menu');
        console.log('Click outside detected:', event.target);
        if (!slideMenu.contains(event.target) && !event.target.classList.contains('meeting-item')) {
            console.log('Closing meeting details slide menu');
            closeMeetingDetailsSlideMenu();
        }
    }
    
    function closeMeetingDetailsSlideMenu() {
        console.log('Closing meeting details slide menu');
        document.getElementById('meeting-details-slide-menu').style.width = '0';
        document.removeEventListener('click', closeMeetingDetailsSlideMenuOnClickOutside);
    }

    // Expose functions to the global scope so that group.js can call them
    window.showMeetingModal = showMeetingModal;
    window.showMeetingDetails = showMeetingDetails;
    window.closeMeetingDetailsSlideMenu = closeMeetingDetailsSlideMenu;
});