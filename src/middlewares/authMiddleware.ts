import { adminVerifyToken } from "../config/firebase";
import { Response, NextFunction } from "express";

const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const decoded = await adminVerifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};

export default authMiddleware;
