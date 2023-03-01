const Note = require('../models/Notes');
const asyncHandler = require('express-async-handler');

const createNote = asyncHandler(async (req, res) => {
  const { title, text, user, completed } = req.body;
  //validate input data
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const completedStatus = completed ? completed : false;
  const noteObj = { title, text, user, completed: completedStatus };
  const newNote = await Note.create(noteObj);
  if (newNote) {
    res
      .status(201)
      .json({ message: `New Note with title ${newNote?.title} created` });
  } else {
    res.status(400).json({ message: 'invalid note data received' });
  }
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean().exec();
  if (notes) {
    res.status(200).json(notes);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});
const getNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id).lean().exec();
  res.status(200).json(note);
});
const updateNote = asyncHandler(async (req, res) => {
  const { id, title, text, user, completed } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Note ID required' });
  }
  const noteUpdateObj = { title, text, user, completed };
  const note = await Note.findByIdAndUpdate(id, noteUpdateObj, {
    new: true,
  }).exec();
  res.status(200).json(note);
});
const deleteNote = asyncHandler(async (eq, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: 'ID required to complete delete operation' });
  }
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }
  const result = await note.deleteOne();
  res
    .status(200)
    .json({ message: `Note with title ${result.title} is deleted` });
});

module.exports = { createNote, getAllNotes, getNote, updateNote, deleteNote };
