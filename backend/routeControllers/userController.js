import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwtToken from "../utilities/jwtToken.js";

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, gender, password, profilepic } =
      req.body;
    const user = await User.findOne({ username, email });
    if (user)
      return res
        .status(500)
        .send({ success: false, message: "User already exist" });

    const hashPassword = bcryptjs.hashSync(password, 10);
    const profileBoy =
      profilepic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const profileGirl =
      profilepic ||
      `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashPassword,
      gender,
      profilepic: gender === "male" ? profileBoy : profileGirl,
    });

    if (newUser) {
      await newUser.save();
      jwtToken(newUser._id, res);

      return res.status(201).send({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilepic: newUser.profilepic,
        email: newUser.email,
      });
    } else {
      res.status(500).send({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(500).send({ success: false, message: "Invalid email" });
    const comparePass = bcryptjs.compareSync(password, user.password || "");
    if (!comparePass) {
      return res
        .status(500)
        .send({ success: false, message: "Invalid password" });
    }

    const token = jwtToken(user._id, res);

    return res.status(200).send({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilepic: user.profilepic,
      email: user.email,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};

export const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true, // Ensure the cookie is not accessible via client-side JS
      sameSite: "strict", // Prevent CSRF attacks
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      expires: new Date(0), // Expire the cookie immediately
      path: "/", // Apply to the entire domain
    });
    res.status(200).send({ success: true, message: "Logout Successful" });
  } catch (error) {
    res.status(500).send({ success: false, message: error });
    console.log(error);
  }
};
