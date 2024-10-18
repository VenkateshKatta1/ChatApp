import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";

const isLogin = async (req, res, next) => {
  try {
    console.log("All Cookies:", req.cookies); // Check if cookies are being parsed

    const token = req.cookies.jwt;
    console.log("Token:", token);
    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "User Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    if (!decoded) {
      return res.status(401).send({ success: false, message: "Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in isLogin middleware", error.message);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default isLogin;
