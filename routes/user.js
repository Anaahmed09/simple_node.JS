const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validationData = joi.object({
  firsName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().required(),
});

router.post("/register", (request, response) => {
  const { firsName, lastName, email, password } = request.body;
  const validation = validationData.validate(request.body);
  if (validation.error)
    return response
      .status(400)
      .send(`All data are required !!! ${validation.error}`);
  let encryptedPassword = bcrypt.hash(password, 10).then((res) => {
    userModel
      .create({
        firsName,
        lastName,
        email,
        password: res,
      })
      .then((user) => {
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          { expiresIn: "1h" }
        );
        user.token = token;
        return response.status(201).json(user);
      })
      .catch((error) => {
        return response.status(401).send("error");
      });
  });
});

const validationDataLogin = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const validate = validationDataLogin.validate(request.body);
    if (validate.error)
      return response
        .status(400)
        .send(`All data are required !!! ${validate.error}`);
    const user = await userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
      );
      user.token = token;
      response.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
