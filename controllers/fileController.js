const { File } = require('../models');
const i18n = require('i18next');

// Create a new file entry in the database
exports.createFile = async (req, res) => {
  const { userId, name, size, type, path } = req.body;

  try {
    const file = await File.create({ userId, name, size, type, path });
    res.status(201).json({
      message: req.t('fileCreated'),
      file,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorCreatingFile'), error });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).json({
      message: req.t('filesFetched'),
      files,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorFetchingFiles'), error });
  }
};

exports.getFileById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: req.t('fileNotFound') });
    }
    res.status(200).json({
      message: req.t('fileFetched'),
      file,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorFetchingFileById'), error });
  }
};

exports.updateFile = async (req, res) => {
  const id = Number(req.params.id);
  const { name, size, type, path } = req.body;

  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: req.t('fileNotFound') });
    }

    file.name = name;
    file.size = size;
    file.type = type;
    file.path = path;
    await file.save();

    res.status(200).json({
      message: req.t('fileUpdated'),
      file,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorUpdatingFile'), error });
  }
};

exports.deleteFile = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const file = await File.findByPk(id);
    if (!file) {
      return res.status(404).json({ message: req.t('fileNotFound') });
    }

    await file.destroy();
    res.status(200).json({ message: req.t('fileDeleted') });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: req.t('errorDeletingFile'), error });
  }
};
