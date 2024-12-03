# Multilingual File Manager Application

This is a robust **Multilingual File Manager Application** built using **Node.js**, **Express**, **MySQL**, and **i18next** for internationalization. It offers user registration, login, and file management functionalities with support for multiple languages, providing a seamless and localized user experience.

## Features

- **User Authentication**: Registration and login functionality with password hashing.
- **File Management**: Create, read, update, and delete files with metadata (e.g., name, size, type).
- **Multilingual Support**: Full application localization with **i18next** to support various languages.
- **Data Handling**: Extraction of input data from request bodies, query parameters, and headers.

## Project Structure

```bash
Multilingual-File-Manager-Application/
├── config/
├── controllers/
│   ├── fileController.js
│   └── userController.js
├── locales/
│   ├── ar/
│   │   └── translation.json
│   ├── en/
│   │   └── translation.json
│   ├── es/
│   │   └── translation.json
│   └── fr/
│       └── translation.json
├── migrations/
│   ├── 20240716232651-create-user.js
│   └── 20240716232652-create-file.js
├── models/
│   ├── index.js
│   ├── user.js
│   └── file.js
├── node_modules/
├── test/
│   ├── authController.test.js
│   └── fileController.test.js
├── .gitignore
├── app.js
├── crudOperations.js
├── fileQueue.js
├── jest.config.js
├── package-lock.json
├── package.json
├── passport-config.js
├── README.md
├── routes.js
├── server.js
└── worker.js


## Prerequisites

- Node.js (v14 or later)
- MySQL

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/ajokkuechajokdeng/Multilingual-File-Manager-Application.git
   cd Multilingual-File-Manager-Application
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure MySQL database:

   - Create a MySQL database.
   - Update the database configuration in the `models/index.js` file.

4. Set up the database schema using Sequelize migrations:

   - Install the Sequelize CLI globally if not already installed:
     ```bash
     npm install -g sequelize-cli
     ```

   - Run migrations:
     ```bash
    npx sequelize-cli db:migrate
     ```

5. Initialize i18next localization files:
   - Add your localization files in the `locales` directory.

## Running the Application

1. Start the server:

   ```bash
   node app.js
   ```

2. The server will run on [http://localhost:3000](http://localhost:3000).

## API Endpoints

### User Endpoints

- **Register a User:**

  ```http
  POST /api/users/register
  ```

  Request Body:

  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

- **Login a User:**

  ```http
  POST /api/users/login
  ```

  Request Body:

  ```json
  {
    "email": "testuser@example.com",
    "password": "password123"
  }
  ```

### File Endpoints

- **Create a File:**

  ```http
  POST /api/files
  ```

  Request Body:

  ```json
  {
    "userId": 1,
    "name": "testfile.txt",
    "size": 1024,
    "type": "txt",
    "path": "/files/testfile.txt"
  }
  ```

- **Get All Files:**

  ```http
  GET /api/files
  ```

- **Get a File by ID:**

  ```http
  GET /api/files/:id
  ```

- **Update a File:**

  ```http
  PUT /api/files/:id
  ```

  Request Body:

  ```json
  {
    "name": "updatedfile.txt",
    "size": 2048,
    "type": "txt",
    "path": "/files/updatedfile.txt"
  }
  ```

- **Delete a File:**

  ```http
  DELETE /api/files/:id
  ```

## Running Tests

1. Run the tests:

   ```bash
   npm test
   ```

   or

   ```bash
   npm test -- --detectOpenHandles
   ```


## Contribution
We welcome contributions to the Multilingual File Manager Application. Please fork the repository, create a new branch for your changes, and submit a pull request. Ensure all tests pass and the code follows the project’s coding standards.Let's build something awesome together! 🎉

**Why did the file refuse to move?**
It couldn’t handle the drag! 😄











