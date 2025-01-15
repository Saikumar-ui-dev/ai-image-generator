import express from 'express'
import {registerUser, loginUser, userCredits, getUsers} from '../controllers/userController.js'
import userAuth from '../middlewares/auth.js'

const router = express.Router()

router.post('/register',registerUser)
router.post("/login", loginUser);
router.get("/", getUsers);
router.get("/credits",userAuth, userCredits);
// router.post("/pay", userAuth, paymentRazorPay);


export default router
