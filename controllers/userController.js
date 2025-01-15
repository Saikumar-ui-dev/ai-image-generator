import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import Transaction from "../models/transactionModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashPass,
    };

    const newUser = new User(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

    res.status(200).json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "No user found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

      res.status(200).json({ success: true, token, user: { name: user.name } });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZOR_PAY_KEY_ID,
//   key_secret: process.env.RAZOR_PAY_KEY_SECRET,
// });

// const paymentRazorPay = async (req, res) => {
//   try {
//     const { userId, planId } = req.body;
//     const userData = await User.findById({ userId });

//     if (!userId || !planId) {
//       return res.json({ success: false, message: "Missing Details" });
//     }

//     let credits, plan, amount, data;

//     switch (planId) {
//       case "Basic":
//         (plan = "Basic"), (credits = 100), (amount = 10);
//         break;

//       case "Advanced":
//         (plan = "Advanced"), (credits = 500), (amount = 50);
//         break;

//       case "Business":
//         (plan = "Business"), (credits = 5000), (amount = 250);
//         break;

//       default:
//         return res.json({ success: false, message: "Plan not found" });
//     }

//     date = Date.now();

//     const transactionData = {
//       userId,
//       plan,
//       amount,
//       credits,
//       date,
//     };

//     const newTransaction = await Transaction.create(transactionData);

//     const Option = {
//       amount: amount * 100,
//       currency: process.env.CURRENCY,
//       receipt: newTransaction._id,
//     };

//     await razorpayInstance.orders.create(Option, (error, orders) => {
//       if (error) {
//         console.log(error);
//         return res.json({ success: false, message: error });
//       }

//       res.json({ success: true, orders });
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const verifyRazorpay =async(req,res)=> {
//   try {
//     const {razorpay_order_id} = req.body

//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//     if (orderInfo.status === 'paid') {
//       const transactionData = await Transaction.findById(orderInfo.receipt)

//       if (transactionData.payment) {
//         return res.json({success : false, message : 'Payment failed'})
//       }

//       const userData = await User.findById(transactionData.userId)

//       const creditBalance = userData.creditBalance + transactionData.creditBalance
//       await User.findByIdAndUpdate(userData._id,creditBalance)
//     }
//   } catch (error) {
//      console.log(error);
//      res.json({ success: false, message: error.message });
//   }
// }

export { registerUser, loginUser, userCredits };
