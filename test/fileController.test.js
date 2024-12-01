const request = require('supertest');
const { app } = require('../app'); // assuming your Express app is exported from 'app.js'
const { File, User } = require('../models'); // assuming User is defined in your models
const { sequelize } = require('../models'); // assuming sequelize is setup in your models directory

describe('File Controller', () => {
  // Before each test, ensure that the database is clean
  beforeEach(async () => {
    // Create user to avoid foreign key issues
    await User.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    await sequelize.sync({ force: true }); // Reset database
  });

  // Test createFile
  describe('POST /files', () => {
    it('should create a new file entry', async () => {
      const fileData = {
        userId: 1,  // Assuming this user already exists
        name: 'testfile.txt',
        size: 1234,
        type: 'text/plain',
        path: '/uploads/testfile.txt',
      };

      const response = await request(app).post('/files').send(fileData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('File created successfully');
      expect(response.body.file).toHaveProperty('id');
      expect(response.body.file.name).toBe(fileData.name);
    });

    it('should return error if file creation fails due to missing fields', async () => {
      const fileData = {}; // Missing required fields

      const response = await request(app).post('/files').send(fileData);

      expect(response.status).toBe(400); // Changed to 400 for Bad Request
      expect(response.body.message).toBe('Error: Missing required fields');
    });
  });

  // Test getFiles
  describe('GET /files', () => {
    it('should fetch all files', async () => {
      await File.create({
        userId: 1,
        name: 'testfile1.txt',
        size: 1234,
        type: 'text/plain',
        path: '/uploads/testfile1.txt',
      });

      const response = await request(app).get('/files');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Files fetched successfully');
      expect(response.body.files.length).toBeGreaterThan(0);
    });
  });

  // Test getFileById
  describe('GET /files/:id', () => {
    it('should fetch a file by id', async () => {
      const file = await File.create({
        userId: 1,
        name: 'testfile1.txt',
        size: 1234,
        type: 'text/plain',
        path: '/uploads/testfile1.txt',
      });

      const response = await request(app).get(`/files/${file.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('File fetched successfully');
      expect(response.body.file.id).toBe(file.id);
    });

    it('should return 404 if file not found', async () => {
      const response = await request(app).get('/files/999'); // Non-existing file ID

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });

  // Test updateFile
  describe('PUT /files/:id', () => {
    it('should update a file by id', async () => {
      const file = await File.create({
        userId: 1,
        name: 'testfile1.txt',
        size: 1234,
        type: 'text/plain',
        path: '/uploads/testfile1.txt',
      });

      const updatedData = {
        name: 'updatedfile.txt',
        size: 5678,
        type: 'text/plain',
        path: '/uploads/updatedfile.txt',
      };

      const response = await request(app).put(`/files/${file.id}`).send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('File updated successfully');
      expect(response.body.file.name).toBe(updatedData.name);
    });

    it('should return 404 if file not found', async () => {
      const response = await request(app).put('/files/999').send({ name: 'updatedfile.txt' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });

  // Test deleteFile
  describe('DELETE /files/:id', () => {
    it('should delete a file by id', async () => {
      const file = await File.create({
        userId: 1,
        name: 'testfile1.txt',
        size: 1234,
        type: 'text/plain',
        path: '/uploads/testfile1.txt',
      });

      const response = await request(app).delete(`/files/${file.id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('File deleted successfully');
    });

    it('should return 404 if file not found', async () => {
      const response = await request(app).delete('/files/999'); // Non-existing file ID

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });
});
