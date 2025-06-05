const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(bodyParser.json());

const users = []; // 用于存储用户信息的内存数据库，实际项目中应使用数据库

// 注册端点
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 8); // 对密码进行加密
    users.push({ username, password: hashedPassword });
    
    res.status(201).json({ success: true, message: 'User registered successfully' });
});

// 修改密码端点
app.post('/api/change-password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token' });
        }
        
        const user = users.find(user => user.username === decoded.username);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }
        
        user.password = bcrypt.hashSync(newPassword, 8); // 更新用户密码
        res.status(200).json({ success: true, message: 'Password changed successfully' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
