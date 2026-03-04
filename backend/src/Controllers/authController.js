import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const registerCitizen = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: "CITIZEN"
    });

    res.status(201).json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true }).select("+password");;
    if (!user) {
      return res.status(401).json({ message: "User not found..." });
    }
     


    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    
    const token = generateToken(user);
    return res.json({
      token: token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        officeLevel: user.role === "CITIZEN" ? null : user.officeLevel
      }
    });

  } catch (err) {
    console.log(err);
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};


