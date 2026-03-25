const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 1. XAMPP MySQL Connection Configuration
// In DevOps, this would eventually move to Environment Variables
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',         // Default XAMPP has no password
    database: 'devops_db' // Ensure this matches phpMyAdmin exactly
});

// 2. Connect to the Database
db.connect((err) => {
    if (err) {
        console.error("❌ DB Connection Failed! Make sure XAMPP MySQL is running.");
        console.error("Error Detail:", err.message);
    } else {
        console.log("✅ Connected to XAMPP MySQL - Database is ready.");
    }
});

// 3. Route: Serve the Frontend (The Improvement Wall)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 4. Route: Add New Idea (The Functional Logic)
app.post('/add-idea', (req, res) => {
    const idea = req.body.idea;

    // Validation: Part of a "Culture of Quality"
    if (!idea || idea.trim() === "") {
        console.log("⚠️ Validation Failed: Empty Idea submitted.");
        return res.status(400).send("<h1>Error</h1><p>Idea cannot be empty!</p><a href='/'>Go Back</a>");
    }

    const query = 'INSERT INTO improvements (idea_text) VALUES (?)';
    
    // Execute Database Query
    db.query(query, [idea], (err, result) => {
        if (err) {
            console.error("❌ Database Insert Error:", err.message);
            // Sending 500 triggers a "FAIL" in your DevOps Pipeline
            return res.status(500).send("<h1>Database Error</h1><p>Check if the table 'improvements' exists.</p>");
        }
        
        console.log(`🚀 Continuous Improvement: New Idea stored with ID ${result.insertId}`);
        res.status(500).send(`
            <div style="font-family:sans-serif; text-align:center; padding:50px;">
                <h1>✅ Success!</h1>
                <p>Your idea: "<strong>${idea}</strong>" has been stored in the DB.</p>
                <p>This triggers the next phase of the DevOps cycle.</p>
                <a href="/" style="color:#3498db; text-decoration:none;">Add another improvement</a>
            </div>
        `);
    });
});

// 5. Route: Health Check (The DevOps "Quality Gate" API)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'Healthy', 
        timestamp: new Date().toISOString(),
        environment: 'Development'
    });
});

// 6. Start the Server
const PORT = 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server started at http://localhost:${PORT}`);
        console.log(`🛠️  DevOps Pipeline Status: Monitoring Active\n`);
    });
}
// Route to see all submitted improvements
app.get('/view-improvements', (req, res) => {
    const query = 'SELECT * FROM improvements ORDER BY created_at DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("<h1>Database Error</h1><p>Could not load the board.</p>");
        }
        
        // This HTML is now centered using Flexbox and a container
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    background: #eef2f3; 
                    display: flex; 
                    justify-content: center; 
                    align-items: flex-start; 
                    min-height: 100vh; 
                    padding: 50px; 
                    margin: 0;
                }
                .container { 
                    background: white; 
                    padding: 40px; 
                    border-radius: 12px; 
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
                    width: 80%; 
                    max-width: 800px;
                    text-align: center;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 30px 0; 
                    background: #fff;
                }
                th { 
                    background: #3498db; 
                    color: white; 
                    padding: 15px; 
                }
                td { 
                    padding: 12px; 
                    border-bottom: 1px solid #ddd; 
                    text-align: left; 
                }
                tr:hover { background-color: #f9f9f9; }
                .back-btn { 
                    display: inline-block; 
                    margin-top: 20px; 
                    padding: 10px 20px; 
                    background: #34495e; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px; 
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 Continuous Improvement Board</h1>
                <p>Tracked DevOps Feedback & Pipeline Tasks</p>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%; text-align: center;">ID</th>
                            <th style="width: 60%;">Improvement Idea</th>
                            <th style="width: 30%;">Date Submitted</th>
                        </tr>
                    </thead>
                    <tbody>`;
        
        results.forEach(row => {
            html += `
                <tr>
                    <td style="text-align: center;">${row.id}</td>
                    <td>${row.idea_text}</td>
                    <td style="font-size: 13px; color: #7f8c8d;">${new Date(row.created_at).toLocaleString()}</td>
                </tr>`;
        });
        
        html += `
                    </tbody>
                </table>
                <a href="/" class="back-btn">⬅️ Back to Submission Wall</a>
            </div>
        </body>
        </html>`;
        
        res.send(html);
    });
});

module.exports = app;