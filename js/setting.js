// Function to upload avatar
function uploadAvatar() {
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");

  if (avatarInput.files && avatarInput.files[0]) {
    const file = avatarInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      avatarPreview.src = e.target.result;
    };

    reader.onerror = function (error) {
      console.error("Error reading the file: ", error);
      alert("There was an issue with reading the file. Please try again.");
    };

    reader.readAsDataURL(file); // Ensure this is used to display images correctly
  } else {
    alert("Please select an image to upload.");
  }
}

// Function to update username
function updateUsername() {
  const newUsername = document.getElementById("usernameInput").value;

  if (newUsername) {
    // Send updated username to the server
    alert(`Username updated to: ${newUsername}`);
  } else {
    alert("Please enter a new username.");
  }
}

// Function to reset password
function resetPassword() {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill in all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
    return;
  }

  // Send new password to the server
  alert("Password reset successful.");
}

// Language content dictionary
const translations = {
  en: {
    settingsTitle: "User Settings",
    languageTitle: "Change Language",
    avatarTitle: "Change Avatar",
    selectAvatarLabel: "Select new avatar:",
    uploadBtn: "Upload",
    usernameTitle: "Change Username",
    newUsernameLabel: "New Username:",
    updateUsernameBtn: "Update Username",
    passwordTitle: "Reset Password",
    currentPasswordLabel: "Current Password:",
    newPasswordLabel: "New Password:",
    confirmPasswordLabel: "Confirm New Password:",
    resetPasswordBtn: "Reset Password",
  },
  zh: {
    settingsTitle: "用户设置",
    languageTitle: "更改语言",
    avatarTitle: "更换头像",
    selectAvatarLabel: "选择新头像：",
    uploadBtn: "上传",
    usernameTitle: "更改用户名",
    newUsernameLabel: "新用户名：",
    updateUsernameBtn: "更新用户名",
    passwordTitle: "重置密码",
    currentPasswordLabel: "当前密码：",
    newPasswordLabel: "新密码：",
    confirmPasswordLabel: "确认新密码：",
    resetPasswordBtn: "重置密码",
  },
};

function switchLanguage() {
  const selectedLanguage = document.getElementById("languageSelector").value;
  console.log(`Selected language: ${selectedLanguage}`);

  // Update all the fields that need to change
  document.getElementById("settingsTitle").textContent =
    translations[selectedLanguage].settingsTitle;
  document.getElementById("languageTitle").textContent =
    translations[selectedLanguage].languageTitle;
  document.getElementById("avatarTitle").textContent =
    translations[selectedLanguage].avatarTitle;
  document.getElementById("selectAvatarLabel").textContent =
    translations[selectedLanguage].selectAvatarLabel;
  document.getElementById("uploadBtn").textContent =
    translations[selectedLanguage].uploadBtn;
  document.getElementById("usernameTitle").textContent =
    translations[selectedLanguage].usernameTitle;
  document.getElementById("newUsernameLabel").textContent =
    translations[selectedLanguage].newUsernameLabel;
  document.getElementById("updateUsernameBtn").textContent =
    translations[selectedLanguage].updateUsernameBtn;
  document.getElementById("passwordTitle").textContent =
    translations[selectedLanguage].passwordTitle;
  document.getElementById("currentPasswordLabel").textContent =
    translations[selectedLanguage].currentPasswordLabel;
  document.getElementById("newPasswordLabel").textContent =
    translations[selectedLanguage].newPasswordLabel;
  document.getElementById("confirmPasswordLabel").textContent =
    translations[selectedLanguage].confirmPasswordLabel;
  document.getElementById("resetPasswordBtn").textContent =
    translations[selectedLanguage].resetPasswordBtn;
}

function saveSettingsAndGoBack() {
  console.log("Settings saved.");

  alert("Settings saved successfully!");

  history.back();
}
