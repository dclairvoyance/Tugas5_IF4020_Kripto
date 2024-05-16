import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { decrypt } from "../utils/delazi.js";
import { hexToString } from "../utils/helpers.js";

export const register = async (req, res) => {
  try {
    const { encrypted } = req.body;
    const decrypted = hexToString(
      decrypt(encrypted, process.env.VITE_BLOCK_CIPHER_EXTERNAL_KEY)
    );
    const parsed = JSON.parse(decrypted.replace(/Z*$/, ""));
    const { displayName, username, password, confirmPassword } = parsed;

    // check password = confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // check if user already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // get profile picture
    const encodedUsername = encodeURIComponent(displayName);
    const profilePicture = `https://ui-avatars.com/api/?background=random&color=fff&name=${encodedUsername}`;

    // create new user
    const newUser = new User({
      displayName,
      username,
      password: hashedPassword,
      profilePicture,
    });

    // generate JWT token
    generateToken(newUser._id, res);
    await newUser.save();

    // send response
    res.status(201).json({
      message: "User created",
      user: {
        _id: newUser._id,
        displayName: newUser.displayName,
        username: newUser.displayName,
        profilePicture: newUser.profilePicture,
      },
    });
  } catch (error) {
    console.error(`Error in register controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { encrypted } = req.body;
    const decrypted = hexToString(
      decrypt(encrypted, process.env.VITE_BLOCK_CIPHER_EXTERNAL_KEY)
    );
    const parsed = JSON.parse(decrypted.replace(/Z*$/, ""));
    const { username, password } = parsed;

    // check if user exists and password is correct
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // generate JWT token
    generateToken(user._id, res);

    // send response
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        displayName: user.displayName,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(`Error in login controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(`Error in logout controller: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
