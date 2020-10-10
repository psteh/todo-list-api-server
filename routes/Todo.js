const router = require('express').Router()

const Todo = require('../controllers/Todo')

router.get('/', Todo.get)
router.post('/', Todo.create)
router.put('/', Todo.update)
router.delete('/', Todo.remove)

module.exports = router