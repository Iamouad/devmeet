const express = require('express')
const router = express.Router();

// @route Get api/Posts
// @access Public
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;