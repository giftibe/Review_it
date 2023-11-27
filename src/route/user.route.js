const { Router } = require("express");
const {
  validate_Account_Creation_Inputs,
  validate_Company_Login_Inputs,
} = require("../validation/joi.validations");
const auth = require("../middleware/auth.middleware");

const userRouter = Router();

const {
  signUp,
  loginUser,
  findAUser,
  fetchAllUsers,
  updateAUser,
  removeUser,
  loggedOut,
} = (userController = require("../controller/user.controller"));

userRouter.post("/user/register", validate_Account_Creation_Inputs, signUp);
userRouter.post("/user/login", validate_Company_Login_Inputs, loginUser);
userRouter.post("/user/logout", auth, loggedOut);
userRouter.get("/user", fetchAllUsers);
userRouter.get("/user/:id", findAUser);
userRouter.patch("/user/:id", auth, updateAUser);
userRouter.delete("/user/:id", auth, removeUser);

module.exports = userRouter;
