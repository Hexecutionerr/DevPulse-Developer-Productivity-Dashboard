const mongoose = require('mongoose');
const fs = require('fs');

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/devMetrics')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error', err));

// 2. Define generic Schemas
const prSchema = new mongoose.Schema({}, { strict: false });
const devSchema = new mongoose.Schema({}, { strict: false });

const PR = mongoose.model('PullRequest', prSchema);
const Dev = mongoose.model('Developer', devSchema);

// 3. Insert Data
const importData = async () => {
    try {
        const rawData = JSON.parse(fs.readFileSync('./metrics_dataset.json'));
        
        // Import PRs
        const prData = rawData['Fact_Pull_Requests'];
        await PR.deleteMany({});
        await PR.insertMany(prData);
        console.log(`Successfully imported ${prData.length} Pull Requests.`);

        // Import Developers
        const devData = rawData['Dim_Developers'];
        await Dev.deleteMany({});
        await Dev.insertMany(devData);
        console.log(`Successfully imported ${devData.length} Developers.`);
        
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error.message);
        process.exit(1);
    }
};

importData();
