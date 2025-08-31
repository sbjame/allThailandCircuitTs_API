import { Request, Response, NextFunction } from "express";
import { User } from "../models/Users";
import { error } from "console";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//!Read all Users
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

//!Read User By Id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.user_id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//!Create User
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_Name, first_Name, last_Name, email, password } = req.body;

    if (!(user_Name && first_Name && last_Name && email && password))
      return res.status(400).json({ error: "All input is required" });

    const oldUer = await User.findOne({ $or: [{ email }, { user_Name }] });

    if (oldUer)
      return res
        .status(409)
        .json({ message: "User or Email already exist. Please login" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      user_registed: true,
      user_Name,
      first_Name,
      last_Name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY || "default_secret",
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

//!Update User Password
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.user_id;
    const { old_password, new_password } = req.body;
    const existingUser = await User.findById(userId);

    if (!existingUser) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(old_password, existingUser?.password);
    if (!isMatch)
      return res.status(403).json({ error: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(new_password, 12);
    existingUser.password = hashedNewPassword;

    await existingUser.save();
    return res.status(201).json({ message: "Password has changed" });
  } catch (err) {
    next(err);
  }
};

//!Update User Name
export const updateName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.user_id;
    const { new_first_name, new_last_name, password } = req.body;
    const existingUser = await User.findById(userId);

    if (!existingUser) return res.status(400).json({ error: "User not foutd" });
    const isMatch = await bcrypt.compare(password, existingUser?.password);
    if (!isMatch)
      return res.status(403).json({ error: "Password doesn't match" });

    existingUser.first_Name = new_first_name;
    existingUser.last_Name = new_last_name;

    await existingUser.save();
    return res.status(201).json({ message: "First and Last name has changed" });
  } catch (err) {
    next(err);
  }
};

//!Delete User
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.isDeleted)
      return res.status(404).json({ error: "User not found" });

    user.isDeleted = true;
    user.deletedAt = new Date();

    await user.save();
    res.json({ message: "User Deleted", user });
  } catch (err) {
    next(err);
  }
};

//!Login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user_Name, email, password } = req.body;

    if ((!email && !user_Name) || !password)
      return res
        .status(400)
        .json({ error: "Either email or username and password are required" });

    const user = await User.findOne({ $or: [{ email }, { user_Name }] });

    if (user?.isDeleted)
      return res
        .status(403)
        .json({ error: "This account has been deactivated." });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email, role: user.role },
        process.env.TOKEN_KEY || "default_secret",
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({ success: true, user, token });
    }

    res.status(400).json({ error: "Username or password is incorrect." });
  } catch (err) {
    next(err);
  }
};

//!Change Role
export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updateData = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser)
      return res.status(404).json({ errorr: "User not found" });
    const invalidField = Object.keys(updateData).find(
      (key) => !Object.keys(User.schema.obj).includes(key)
    );
    if (invalidField)
      return res
    .status(400)
    .json({ error: "Invalid field" });
    
    existingUser.role = role;
    existingUser.save()
    res.status(200).json({ message: "Role has changed"})
  } catch (err) {
    next(err);
  }
};
