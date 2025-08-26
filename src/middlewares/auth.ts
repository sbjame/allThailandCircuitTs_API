//todo create auth logic
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "A token is require to authtentication" });

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY || "default_secret");
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = ( req as any ).user;
  if(user.role !== "admin"){
    return res.status(403).json({ message: "Forbidden: insufficient role"});
  }
  next();
}

export const requireAdminOrManager = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = ( req as any ).user;
  if(user.role !== "manager" && user.role !== "admin"){
    return res.status(403).json({ message: "Forbidden: insufficient role"})
  }
  next();
}