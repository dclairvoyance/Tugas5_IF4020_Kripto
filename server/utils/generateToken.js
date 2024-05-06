import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true, // prevent XSS attack
    sameSite: "strict", // prevent CSRF attack
    secure: process.env.NODE_ENV === "production" ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
