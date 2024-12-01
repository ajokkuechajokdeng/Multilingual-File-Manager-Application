const request = require('supertest');
const { app } = require('../app');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models');

describe('Authentication Controller', () => {
  beforeEach(async () => await sequelize.sync({ force: true }));

  // Test Register functionality
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const userData = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };
      const response = await request(app).post('/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.user).toMatchObject({ username: userData.username, email: userData.email });
    });

    it('should return error if required fields are missing', async () => {
      const response = await request(app).post('/register').send({ username: 'testuser' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return error if user already exists', async () => {
      const existingUser = { username: 'existinguser', email: 'existing@example.com', password: 'password' };
      await User.create(existingUser);
      const response = await request(app).post('/register').send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return error if server issues occur', async () => {
      jest.spyOn(User, 'create').mockRejectedValueOnce(new Error('Database error'));
      const response = await request(app).post('/register').send({ username: 'testuser', email: 'testuser@example.com', password: 'testpassword' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error registering user');
    });
  });

  // Test Login functionality
  describe('POST /login', () => {
    it('should log in a user with valid credentials', async () => {
      const userData = { username: 'testuser', email: 'testuser@example.com', password: 'testpassword' };
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({ username: userData.username, email: userData.email, password: hashedPassword });

      const response = await request(app).post('/login').send({ email: userData.email, password: userData.password });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toMatchObject({ username: userData.username, email: userData.email });
    });

    it('should return error if fields are missing', async () => {
      const response = await request(app).post('/login').send({ email: 'testuser@example.com' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return error if user does not exist', async () => {
      const response = await request(app).post('/login').send({ email: 'nonexistentuser@example.com', password: 'somepassword' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not found');
    });

    it('should return error for incorrect password', async () => {
      const userData = { username: 'testuser', email: 'testuser@example.com', password: 'correctpassword' };
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({ username: userData.username, email: userData.email, password: hashedPassword });

      const response = await request(app).post('/login').send({ email: userData.email, password: 'wrongpassword' });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid password');
    });

    it('should return error if server issues occur', async () => {
      jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Database error'));
      const response = await request(app).post('/login').send({ email: 'testuser@example.com', password: 'testpassword' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error logging in');
    });
  });
});
