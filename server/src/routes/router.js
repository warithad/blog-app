const express = require('express')
const router = express.Router()

const post_controller = require('../controllers/postController');

router.post('/comment/:id', post_controller.comment_add_post)
router.get('/all', post_controller.posts_get)
router.get('/:id', post_controller.post_get)
router.get('/', post_controller.published_posts_get)

module.exports = router;