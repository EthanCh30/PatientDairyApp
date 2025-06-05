import config from '../../../config.js'; // 根据实际路径调整

function showMeetingModal() {
    document.getElementById('meetingModal').style.display = 'block';
}

function closeMeetingModal() {
    document.getElementById('meetingModal').style.display = 'none';
}

function submitMeeting() {
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value;
    const group = document.getElementById('meetingGroup').value;
    const topic = document.getElementById('meetingTopic').value;
    const location = document.getElementById('meetingLocation').value;
    const description = document.getElementById('meetingDescription').value;
    const duration = document.getElementById('meetingDuration').value;

    // 从会话中获取 therapistId，如果没有则默认为 null
    const therapistId = sessionStorage.getItem('therapistId') || 1;

    console.log('Form Values:', { date, time, group, topic, location, description, duration, therapistId });

    if (date && time && group && topic && location && description && duration && therapistId !== null) {
        // 获取选定组的所有患者的 PatientID
        fetch(`${config.apiBaseUrl}/get_groups.php`)
            .then(response => response.json())
            .then(groups => {
                const selectedGroup = groups.find(g => g.groupName === group);
                if (selectedGroup && selectedGroup.members.length > 0) {
                    const patientIds = selectedGroup.members.map(member => member.memberId);

                    const meetingData = {
                        date,
                        time,
                        group,
                        topic,
                        location,
                        description,
                        duration,
                        therapistId,
                        patientIds
                    };

                    fetch(`${config.apiBaseUrl}/add_meeting.php`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(meetingData)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Meeting submitted successfully:', data);
                            closeMeetingModal();
                        } else {
                            console.error('Error submitting meeting:', data.message);
                            alert('Error submitting meeting: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error submitting meeting:', error);
                        alert('Error submitting meeting: ' + error.message);
                    });
                } else {
                    alert('No patients found in the selected group');
                }
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                alert('Error fetching groups: ' + error.message);
            });
    } else {
        alert('Please fill in all fields');
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('meetingModal');
    if (event.target == modal) {
        closeMeetingModal();
    }
}

// Dynamically generate groupName dropdown options
function populateGroupOptions(groups) {
    const groupSelect = document.getElementById('meetingGroup');
    groupSelect.innerHTML = ''; // Clear existing options
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.groupName;
        option.textContent = group.groupName;
        groupSelect.appendChild(option);
    });
}

// Expose functions to the global scope so that group.js can call them
window.showMeetingModal = showMeetingModal;
window.closeMeetingModal = closeMeetingModal;
window.submitMeeting = submitMeeting;
window.populateGroupOptions = populateGroupOptions;