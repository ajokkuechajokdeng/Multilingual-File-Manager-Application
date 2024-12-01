const Queue = require('bull');

// Create a Bull queue for file processing
const fileQueue = new Queue('fileQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379,  // Default Redis port
  },
});

module.exports = fileQueue;
