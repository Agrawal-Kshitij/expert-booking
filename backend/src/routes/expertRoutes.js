const express = require('express');
const { getExperts, getExpertById } = require('../controllers/expertController');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getExperts));
router.get('/:id', asyncHandler(getExpertById));

module.exports = router;
