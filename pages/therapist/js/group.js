import config from '../../../config.js'; // 根据实际路径调整

document.addEventListener('DOMContentLoaded', () => {
    const groupList = document.getElementById('group-list');
    const meetingList = document.getElementById('meeting-list');
    const meetingHistory = document.getElementById('meeting-history');
    const memberList = document.getElementById('member-list');
    let currentGroupName = null; // Currently selected group name

    const addButton = document.getElementById('addMeetingButton');
    if (addButton) {
        addButton.addEventListener('click', showMeetingModal);
    } else {
        console.error('Add Meeting Button not found!');
    }

    // Load the modal HTML
    fetch('addmeeting.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('modalContainer').innerHTML = data;
            // Call populateGroupOptions function to generate dropdown options
            if (typeof window.populateGroupOptions === 'function') {
                fetch(`${config.apiBaseUrl}/get_groups.php`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data && data.length > 0) {
                            window.populateGroupOptions(data);
                        } else {
                            console.error('No groups data found!');
                        }
                    })
                    .catch(error => console.error('Error fetching groups for dropdown:', error));
            } else {
                console.error('populateGroupOptions function not found!');
            }
        })
        .catch(error => console.error('Error loading modal:', error));

    // Attempt to fetch group and member data from the server
    fetch(`${config.apiBaseUrl}/get_groups.php`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // If data is successfully fetched, generate the group list
            if (data && data.length > 0) {
                generateGroupList(data);
            } else {
                console.error('No groups data found!');
            }
        })
        .catch(error => {
            console.error('Error fetching groups:', error);
        });

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

    // Generate group list
    function generateGroupList(groups, selectedGroupName = null) {
        groupList.innerHTML = '';

        groups.forEach(group => {
            const li = document.createElement('li');
            li.className = 'group-item';
            li.id = `group-${group.groupName}`;
            li.innerHTML = `
                <label for="checkbox-${group.groupName}">${group.groupName}</label>
            `;
            li.addEventListener('click', () => {
                // Remove 'selected' class from all group items
                document.querySelectorAll('.group-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Add 'selected' class to the clicked group item
                li.classList.add('selected');
                currentGroupName = group.groupName; // Update currently selected group name
                generateMemberList(group.members);
            });
            groupList.appendChild(li);

            // If the current group name matches the selected group name, generate the member list for that group
            if (selectedGroupName && group.groupName === selectedGroupName) {
                li.classList.add('selected');
                generateMemberList(group.members);
            }
        });

        // If no group name is selected, generate the member list for the first group
        if (!selectedGroupName && groups.length > 0) {
            currentGroupName = groups[0].groupName; // Update currently selected group name
            generateMemberList(groups[0].members);
        }
    }

    // Generate member list
    function generateMemberList(members) {
        memberList.innerHTML = '';
        members.forEach(member => {
            const tr = document.createElement('tr');
            tr.className = 'member-item';
            tr.id = `member-${member.memberId}`;
            tr.innerHTML = `
                <td>${member.memberId}</td>
                <td class="member-name" data-id="${member.memberId}">${member.memberName}</td>
                <td>${member.caseType || 'N/A'}</td> <!-- Display CaseType -->
            `;
            memberList.appendChild(tr);
        });

        // Add click event listener to member names
        document.querySelectorAll('.member-name').forEach(item => {
            item.addEventListener('click', (event) => {
                const memberId = event.target.getAttribute('data-id');
                fetchMemberDetails(memberId);
            });
        });
    }

    // Fetch member details
    function fetchMemberDetails(memberId) {
        fetch(`${config.apiBaseUrl}/get_patient_details.php?patientId=${memberId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    displayMemberDetails(data.member);
                } else {
                    console.error('Error fetching member details:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching member details:', error);
            });
    }

    // Display member details
    function displayMemberDetails(member) {
        const memberDetails = document.getElementById('member-details');
        memberDetails.innerHTML = `
            <h2>${member.Name}</h2>
            <p><strong>Age:</strong> ${member.Age}</p>
            <p><strong>Sex:</strong> ${member.Sex}</p>
            <p><strong>Height:</strong> ${member.Height}</p>
            <p><strong>Weight:</strong> ${member.Weight}</p>
            <p><strong>Email:</strong> ${member.Email}</p>
            <p><strong>Contact No:</strong> ${member.ContactNo}</p>
            <p><strong>Address:</strong> ${member.Address}</p>
            <p><strong>Language:</strong> ${member.Language}</p>
            <p><strong>Case Type:</strong> ${member.CaseType}</p>
            <p><strong>Is Severe:</strong> ${member.isSevere}</p>
            <p><strong>Group Name:</strong> ${member.GroupName}</p>
            <p><strong>Therapist ID:</strong> ${member.TherapistID}</p>
        `;
        openSlideMenu();
    }

    // Open the slide menu
    function openSlideMenu() {
        document.getElementById('right-slide-menu').style.width = '300px';
        document.addEventListener('click', closeSlideMenuOnClickOutside);
    }

    // Close the slide menu
    function closeSlideMenu() {
        document.getElementById('right-slide-menu').style.width = '0';
        document.removeEventListener('click', closeSlideMenuOnClickOutside);
    }

    // Close the slide menu when clicking outside of it
    function closeSlideMenuOnClickOutside(event) {
        const slideMenu = document.getElementById('right-slide-menu');
        if (!slideMenu.contains(event.target) && !event.target.classList.contains('member-name')) {
            closeSlideMenu();
        }
    }

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
            window.showMeetingModal();
        } else {
            console.error('showMeetingModal function not found!');
        }
    }

       // 显示会议详情的右拉菜单
    function showMeetingDetails(meeting) {
        const meetingDetails = document.getElementById('meeting-details');
        meetingDetails.innerHTML = `
            <h2>${meeting.Topic}</h2>
            <p><strong>Date:</strong> ${meeting.Date}</p>
            <p><strong>Time:</strong> ${meeting.Time}</p>
            <p><strong>Location:</strong> ${meeting.Location}</p>
            <p><strong>Description:</strong> ${meeting.Description}</p>
            <p><strong>Duration:</strong> ${meeting.Duration} minutes</p>
        `;
        openMeetingDetailsSlideMenu();
    }
    
    // Open the meeting details slide menu
    function openMeetingDetailsSlideMenu() {
        document.getElementById('meeting-details-slide-menu').style.width = '300px';
        setTimeout(() => {
            document.addEventListener('click', closeMeetingDetailsSlideMenuOnClickOutside);
        }, 0); 
    }
    
    // Close the meeting details slide menu
    function closeMeetingDetailsSlideMenu() {
        document.getElementById('meeting-details-slide-menu').style.width = '0';
        document.removeEventListener('click', closeMeetingDetailsSlideMenuOnClickOutside);
    }
    
    // Close the meeting details slide menu when clicking outside of it
    function closeMeetingDetailsSlideMenuOnClickOutside(event) {
        const slideMenu = document.getElementById('meeting-details-slide-menu');
        if (!slideMenu.contains(event.target) && !event.target.classList.contains('meeting-item') && !event.target.classList.contains('meeting-history-item')) {
            closeMeetingDetailsSlideMenu();
        }
    }

});