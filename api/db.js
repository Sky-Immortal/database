const fs = require('fs');
const path = require('path');

// Path to the db.json file
const dbFilePath = path.resolve('db.json');

module.exports = (req, res) => {
    if (req.method === 'GET') {
        // Read the db.json file and return its contents
        fs.readFile(dbFilePath, 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Error reading database' });
            }
            res.status(200).json(JSON.parse(data));
        });
    } else if (req.method === 'POST') {
        // Add new data to db.json
        let newData = '';
        req.on('data', chunk => {
            newData += chunk;
        });

        req.on('end', () => {
            const updatedData = JSON.parse(newData);

            fs.readFile(dbFilePath, 'utf-8', (err, data) => {
                if (err) {
                    return res.status(500).json({ error: 'Error reading database' });
                }
                const db = JSON.parse(data);
                db.push(updatedData); // Assuming db.json contains an array of data

                fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), err => {
                    if (err) {
                        return res.status(500).json({ error: 'Error writing to database' });
                    }
                    res.status(200).json({ message: 'Data added successfully' });
                });
            });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
