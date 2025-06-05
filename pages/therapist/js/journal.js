import config from '../../../config.js';

document.addEventListener('DOMContentLoaded', () => {
    let notes = [];

    const saveNoteButton = document.getElementById('save-note');
    const noteContent = document.getElementById('note-content');
    const historyDropdown = document.getElementById('history-dropdown');
    const searchInput = document.getElementById('search-input');
    const patientInfo = document.getElementById('patient-info');
    const mainContent = document.querySelector('.main-content');

    function renderHistoryDropdown(filteredNotes = notes) {
        historyDropdown.innerHTML = '';
        filteredNotes.forEach(note => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p><strong>Date:</strong> ${note.Date}</p>
                <p><strong>Content:</strong> ${note.PatientNote.substring(0, 20)}...</p>
            `;
            historyItem.addEventListener('click', () => {
                document.getElementById('patient-note').textContent = note.PatientNote;
                document.getElementById('diary-id').textContent = note.DiaryID;
                document.getElementById('patient-id').textContent = note.PatientID;
                document.getElementById('date').textContent = note.Date;
                document.getElementById('sleep').textContent = note.Sleep;
                document.getElementById('exercise').textContent = note.Exercise;
                document.getElementById('food').textContent = note.Food;
                document.getElementById('mood').textContent = note.Mood;
                document.getElementById('affirmation').textContent = note.Affirmation;
                document.getElementById('modified-date').textContent = note.ModifiedDate;
                noteContent.value = note.TherapistNote;
            });
            historyDropdown.appendChild(historyItem);
        });
    }

    function filterNotes(keyword) {
        const filteredNotes = notes.filter(note => 
            note.PatientNote.includes(keyword) || 
            note.Date.includes(keyword) ||
            note.TherapistNote.includes(keyword)
        );
        renderHistoryDropdown(filteredNotes);
    }

    function updateJournalNotes(newNotes) {
        notes = newNotes;
        renderHistoryDropdown();
    }

    searchInput.addEventListener('input', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        filterNotes(e.target.value);
        historyDropdown.classList.add('show'); // 确保下拉列表保持可见
    });

    saveNoteButton.addEventListener('click', () => {
        const selectedDiaryId = document.getElementById('diary-id').textContent;
        const modifiedDate = new Date().toISOString().split('T')[0];
        const therapistNote = noteContent.value;

        fetch(`${config.apiBaseUrl}/update_notes.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                diaryId: selectedDiaryId,
                therapistNote: therapistNote,
                modifiedDate: modifiedDate
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 更改按钮颜色和文本表示保存成功
                saveNoteButton.classList.add('save-success');
                saveNoteButton.textContent = 'Succeed';
                // 2秒后恢复原来的颜色和文本
                setTimeout(() => {
                    saveNoteButton.classList.remove('save-success');
                    saveNoteButton.textContent = 'Save';
                }, 2000);

                // Update the local notes array and re-render the dropdown
                const updatedNote = notes.find(note => note.DiaryID == selectedDiaryId);
                if (updatedNote) {
                    updatedNote.TherapistNote = therapistNote;
                    updatedNote.ModifiedDate = modifiedDate;
                    renderHistoryDropdown();
                }
            } else {
                alert('Failed to update note');
            }
        })
        .catch(error => {
            console.error('Error updating note:', error);
        });
    });

    renderHistoryDropdown();

    // 监听自定义事件
    document.addEventListener('notesFetched', (event) => {
        updateJournalNotes(event.detail);
    });

    // 监听来自 note.js 的消息
    window.addEventListener('message', (event) => {
        if (event.data.type === 'notesFetched') {
            updateJournalNotes(event.data.notes);
        }
    });

    // 防止点击搜索框时关闭下拉列表
    const dropdownButton = document.querySelector('.dropdown button');
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('history-container').classList.toggle('show');
    });

    // 防止点击下拉列表内部时关闭下拉列表
    document.getElementById('history-container').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
        if (!document.getElementById('history-container').contains(e.target) && !dropdownButton.contains(e.target)) {
            document.getElementById('history-container').classList.remove('show');
        }
    });
});