const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// File management routes
router.post('/files', fileController.createFile);
router.get('/files', fileController.getFiles);
router.get('/files/:id', fileController.getFileById);
router.put('/files/:id', fileController.updateFile);
router.delete('/files/:id', fileController.deleteFile);

module.exports = router;
