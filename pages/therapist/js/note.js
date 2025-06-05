import config from '../../../config.js';

document.addEventListener('DOMContentLoaded', () => {
    const groupList = document.getElementById('group-list');
    const memberList = document.getElementById('member-list');
    let draggedMember = null;

    // Add new group placeholder
    const newGroupPlaceholder = document.createElement('li');
    newGroupPlaceholder.className = 'group-item new-group';
    newGroupPlaceholder.textContent = '+';
    newGroupPlaceholder.addEventListener('dragover', (event) => {
        event.preventDefault();
        newGroupPlaceholder.classList.add('drag-over');
    });
    newGroupPlaceholder.addEventListener('dragleave', (event) => {
        newGroupPlaceholder.classList.remove('drag-over');
    });
    newGroupPlaceholder.addEventListener('drop', (event) => {
        event.preventDefault();
        newGroupPlaceholder.classList.remove('drag-over');
        if (draggedMember) {
            const newGroupName = prompt('Please type new group name:');
            if (newGroupName) {
                updateMemberGroup(draggedMember.memberId, newGroupName);
            }
        }
    });
    groupList.insertBefore(newGroupPlaceholder, groupList.firstChild);

    // Fetch groups and members from the server
    fetch(`${config.apiBaseUrl}/get_groups.php`)
        .then(response => response.json())
        .then(data => {
            // Generate group list items
            data.forEach(group => {
                const li = document.createElement('li');
                li.className = 'group-item';
                li.id = `group-${group.groupName}`;
                li.textContent = group.groupName;
                li.addEventListener('click', () => {
                    // Remove 'selected' class from all group items
                    document.querySelectorAll('.group-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    // Add 'selected' class to the clicked group item
                    li.classList.add('selected');
                    generateMemberList(group.members);
                });
                li.addEventListener('dragover', (event) => {
                    event.preventDefault();
                    li.classList.add('drag-over');
                });
                li.addEventListener('dragleave', (event) => {
                    li.classList.remove('drag-over');
                });
                li.addEventListener('drop', (event) => {
                    event.preventDefault();
                    li.classList.remove('drag-over');
                    if (draggedMember) {
                        updateMemberGroup(draggedMember.memberId, group.groupName);
                    }
                });
                groupList.appendChild(li);
            });

            // Generate member list for the first group
            if (data.length > 0) {
                generateMemberList(data[0].members);
            }
        })
        .catch(error => {
            console.error('Error fetching groups from server:', error);
        });

    // Generate member list items
    function generateMemberList(members) {
        memberList.innerHTML = '';
        Object.values(members).forEach(member => {
            const tr = document.createElement('tr');
            tr.className = 'member-item';
            tr.id = `member-${member.memberId}`;
            tr.draggable = true;
            tr.innerHTML = `
            <td class="member-id">${member.memberId}</td>
            <td class="member-name" data-severe="${member.isSevere}" style="background-color: ${member.isSevere == 1 ? 'yellow' : 'white'};">${member.memberName}</td>
        `;        
            tr.addEventListener('dragstart', (event) => {
                draggedMember = member;
            });
            tr.querySelector('.member-id').addEventListener('click', () => {
                const currentSevereState = parseInt(tr.querySelector('.member-name').getAttribute('data-severe'), 10);  // 假设在生成列表时您在元素上设置了 data-severe 属性
                toggleMemberStatement(member.memberId, currentSevereState);
            });
            
            tr.querySelector('.member-name').addEventListener('click', () => {
                // Remove 'selected' class from all member names
                document.querySelectorAll('.member-name').forEach(item => {
                    item.classList.remove('selected');
                });
                // Add 'selected' class to the clicked member name
                tr.querySelector('.member-name').classList.add('selected');
                fetchNotesForMember(member.memberId);
            });
            memberList.appendChild(tr);
        });
    }
    
    // Fetch notes for a member
    function fetchNotesForMember(memberId) {
        fetch(`${config.apiBaseUrl}/get_notes.php?patientId=${memberId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const event = new CustomEvent('notesFetched', { detail: data.diaryEntries });
                    document.dispatchEvent(event);
                    const journalIframe = document.querySelector('.journal-iframe');
                    journalIframe.contentWindow.postMessage({ type: 'notesFetched', notes: data.diaryEntries }, '*');
                } else {
                    console.error(`Error fetching notes for member ID: ${memberId}`, data.message);
                }
            })
            .catch(error => {
                console.error(`Error fetching notes for member ID: ${memberId}`, error);
            });
    }

    // Update member's group
    function updateMemberGroup(memberId, newGroupName) {
        fetch(`${config.apiBaseUrl}/update_member_group.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId, newGroupName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetch(`${config.apiBaseUrl}/get_groups.php`)
                    .then(response => response.json())
                    .then(data => {
                        const group = data.find(group => group.groupName === newGroupName);
                        if (group) {
                            generateMemberList(group.members);
                        } else {
                            console.error('No group found with the specified member after update.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching updated groups:', error);
                    });
            } else {
                console.error('Error updating member group:', data.message);
            }
        })
        .catch(error => {
            console.error('Error updating member group:', error);
        });
    }

    // Toggle member's statement
    function toggleMemberStatement(memberId, currentStatement) {
        let newStatement = currentStatement === 1 ? 0 : 1;
    
        fetch(`${config.apiBaseUrl}/update_member_statement.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ memberId, isSevere: newStatement })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Fetch updated data and regenerate member list
                fetch(`${config.apiBaseUrl}/get_groups.php`)
                    .then(response => response.json())
                    .then(data => {
                        // Find the group containing the updated member
                        const group = data.find(group => Array.isArray(group.members) && group.members.some(member => member.memberId === memberId));
                        if (group) {
                            generateMemberList(group.members);
                        } else {
                            console.error('No group found with the specified member.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching groups:', error);
                    });
            } else {
                console.error('Failed to toggle statement:', data.message);
            }
        })
        .catch(error => {
            console.error('Error toggling statement:', error);
        });
    }
});