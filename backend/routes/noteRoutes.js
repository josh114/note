const router = require('express').Router();
const {
  createNote,
  getAllNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

router
  .route('/')
  .post(createNote)
  .get(getAllNotes)
  .patch(updateNote)
  .delete(deleteNote);
router.route('/:id').get(getNote);

module.exports = router;
