const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Base route for the UI
app.get('/', (req, res) => {
    res.send('<h1>🚀 Continuous Improvement Board: Active</h1>');
});

// Route to check system health (for the DevOps pipeline)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Healthy', version: '1.0.0' });
});

// Only start the server if not being tested
if (require.main === module) {
    app.listen(3000, () => console.log('Server running on port 3000'));
}

module.exports = app;