const express = require("express");

const User = require("../model/user.model");

const sendMail = require("../utils/send-mail");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);

    const admins = await User.find({ role: "admin" });

    sendMail(
      "sachidanand.kpradhan@gmail.com",
      req.body.email,
      `Welcome to ABC system ${req.body.first_name}  ${req.body.last_name}`,
      `Hi  ${req.body.first_name}, Please confirm your email address`,
      `<h1>Hi  ${req.body.first_name}, Please confirm your email address</h1>`
    );

    const to_array = [];
    for (let i = 0; i < admins.length; i++) {
      to_array.push(admins[i].email);
    }
    console.log(to_array);

    const to_string = to_array.join(",");

    sendMail(
      "sachidanand.kpradhan@gmail.com",
      to_string,
      `${req.body.first_name} ${req.body.last_name} has registered with us`,
      `Please welcome ${req.body.first_name} ${req.body.last_name}`,
      `<h1>Please welcome ${req.body.first_name} ${req.body.last_name}</h1>`
    );

    return res.status(201).json({ user });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const size = +req.query.size || 2;

    // page = 1 skip (0) limit (2) // (1 -1) * 2 = 0
    // page = 2 skip(2) limit (2) // (2 -1 )* 2 = 2
    // skip items = (page - 1) * size

    const skip = (page - 1) * size;

    const user = await User.find().skip(skip).limit(size).lean().exec();

    const totalPages = Math.ceil((await User.find().countDocuments()) / size);

    return res.json({ user, totalPages });
  } catch (err) {
    return res.status(500).json({ status: "failed", message: err.message });
  }
});

module.exports = router;

// AJAX => Asynchronous JS and XML
// AJAX Loading
