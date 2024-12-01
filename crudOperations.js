const { File } = require('./models'); // Adjust the path to your Sequelize models

async function createFile(fileData) {
  try {
    const file = await File.create(fileData);
    console.log('File created:', file);
  } catch (error) {
    console.error('Error creating file:', error);
  }
}

async function getAllFiles() {
  try {
    const files = await File.findAll();
    console.log('Files:', files);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

async function getFileById(fileId) {
  try {
    const file = await File.findByPk(fileId);
    if (file) {
      console.log('File:', file);
    } else {
      console.log('File not found');
    }
  } catch (error) {
    console.error('Error fetching file:', error);
  }
}

async function updateFile(fileId, updatedData) {
  try {
    const [updated] = await File.update(updatedData, {
      where: { id: fileId },
    });
    if (updated) {
      console.log('File updated');
    } else {
      console.log('File not found');
    }
  } catch (error) {
    console.error('Error updating file:', error);
  }
}

async function deleteFile(fileId) {
  try {
    const deleted = await File.destroy({
      where: { id: fileId },
    });
    if (deleted) {
      console.log('File deleted');
    } else {
      console.log('File not found');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

// Example usage
(async () => {

  await createFile({ userId: 1, name: 'example.txt', size: 1234, type: 'text/plain', path: '/path/to/file' });
  await getAllFiles();
  await getFileById(1);
  await updateFile(1, { name: 'updated_example.txt', size: 5678 });
  await deleteFile(1);
})();
