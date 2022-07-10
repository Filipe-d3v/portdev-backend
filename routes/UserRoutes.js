const UserController = require('../controllers/UserController')

const router = require('express').Router()

const verifyToken = require('../helpers/verify-token')

router.post('/register', UserController.create)
router.post('/login', UserController.login)
router.get('/:id', verifyToken, UserController.getUserById)
router.patch('/update/:id', verifyToken, UserController.update)



module.exports = router