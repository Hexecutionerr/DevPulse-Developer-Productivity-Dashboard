const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/devMetrics')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Metric Schema
const metricSchema = new mongoose.Schema({
    leadTime: Number,
    cycleTime: Number,
    bugRate: Number,
    deploymentFrequency: Number,
    prThroughput: Number,
    updatedAt: { type: Date, default: Date.now }
});

const Metric = mongoose.model('Metric', metricSchema);

// Seed Initial Data
const seedData = async () => {
    const count = await Metric.countDocuments();
    if (count === 0) {
        await Metric.create({
            leadTime: 4.2,
            cycleTime: 2.8,
            bugRate: 1.5,
            deploymentFrequency: 12,
            prThroughput: 18
        });
        console.log('Sample metrics data seeded.');
    }
};
seedData();

/**
 * Analyzes developer metrics and returns insights and suggestions.
 * @param {Object} data - The metrics data object
 * @returns {Object} - Contains insight and suggestion strings
 */
const analyzeMetrics = (data) => {
    let insight = "Your development process is healthy.";
    let suggestion = "Continue maintaining the current workflow.";

    if (data.leadTime > 7) {
        insight = "Slow development detected due to high lead time.";
        suggestion = "Review the CI/CD pipeline and bottleneck stages.";
    } else if (data.bugRate > 2) {
        insight = "Quality issues detected due to high bug rate.";
        suggestion = "Increase automated test coverage and perform more thorough code reviews.";
    } else if (data.deploymentFrequency < 5) {
        insight = "Release cycle is slow due to low deployment frequency.";
        suggestion = "Break down tasks into smaller, more manageable pull requests.";
    } else if (data.prThroughput < 10) {
        insight = "Team productivity is lower than target.";
        suggestion = "Investigate team collaboration tools and reduce meeting overhead.";
    }

    return { insight, suggestion };
};

// Data Models
const prSchema = new mongoose.Schema({}, { strict: false });
const PR = mongoose.models.PullRequest || mongoose.model('PullRequest', prSchema);

const devSchema = new mongoose.Schema({}, { strict: false });
const Dev = mongoose.models.Developer || mongoose.model('Developer', devSchema);

// Route: GET /api/metrics
app.get('/api/metrics', async (req, res) => {
    try {
        const metrics = await Metric.findOne().sort({ updatedAt: -1 });
        
        if (!metrics) {
            return res.status(404).json({ message: "No metrics found" });
        }

        const analysis = analyzeMetrics(metrics);
        res.status(200).json({
            metrics: {
                leadTime: `${metrics.leadTime} days`,
                cycleTime: `${metrics.cycleTime} days`,
                bugRate: `${metrics.bugRate}%`,
                deploymentFrequency: `${metrics.deploymentFrequency} deployments/week`,
                prThroughput: `${metrics.prThroughput} PRs/month`
            },
            insight: analysis.insight,
            suggestion: analysis.suggestion
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching metrics from database", error: error.message });
    }
});

// Route: GET /api/raw-prs (Sample for demo)
app.get('/api/raw-prs', async (req, res) => {
    try {
        const prs = await PR.find().limit(10); 
        res.status(200).json(prs);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

// Route: GET /api/developers
app.get('/api/developers', async (req, res) => {
    try {
        const devs = await Dev.find();
        res.status(200).json(devs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching developers", error: error.message });
    }
});

// Route: GET /api/all-prs
app.get('/api/all-prs', async (req, res) => {
    try {
        const prs = await PR.find().sort({ opened_at: -1 });
        res.status(200).json(prs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching all PRs", error: error.message });
    }
});

// Route: GET /api/history (Monthly Trends)
app.get('/api/history', (req, res) => {
    const history = [
        { month: 'Jan', leadTime: 6.2, cycleTime: 4.5, deployments: 8 },
        { month: 'Feb', leadTime: 5.8, cycleTime: 3.8, deployments: 10 },
        { month: 'Mar', leadTime: 4.5, cycleTime: 3.2, deployments: 14 },
        { month: 'Apr', leadTime: 4.2, cycleTime: 2.8, deployments: 12 },
    ];
    res.status(200).json(history);
});

// Basic health check route
app.get('/', (req, res) => {
    res.send('Developer Productivity Dashboard Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
