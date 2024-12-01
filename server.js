const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const { File, User } = require('./models');
require('./passport-config');
const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');
const Queue = require('bull'); // Import Bull

// Initialize express app
const app = express();
const port = 3000;

// Configure i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

// Use i18next middleware
app.use(middleware.handle(i18next));

// Body parser middleware
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Bull Queue
const fileUploadQueue = new Queue('fileUploadQueue', {
  redis: { host: '127.0.0.1', port: 6379 },
});

// Process Queue Jobs
fileUploadQueue.process(async (job) => {
  const { fileData } = job.data;

  // Simulate file processing (e.g., saving to storage, resizing images, etc.)
  console.log(`Processing file: ${fileData.name}`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
  console.log(`File processed: ${fileData.name}`);
});

// File management route for queuing file uploads
app.post('/files', async (req, res) => {
  try {
    const fileData = req.body;

    // Add a job to the queue
    const job = await fileUploadQueue.add({ fileData });

    res.status(202).json({ message: req.t('fileQueued'), jobId: job.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all queued jobs
app.get('/files/queue', async (req, res) => {
  try {
    const jobs = await fileUploadQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root route to display the welcome message
app.get('/', (req, res) => {
  res.send(req.t('welcomeMessage'));
});

// Other routes (registration, login, etc.) remain unchanged...

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
