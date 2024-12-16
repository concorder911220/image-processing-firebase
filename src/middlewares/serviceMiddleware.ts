import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

const serviceMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(403).send("User ID is required.");
    }

    const path = req.originalUrl as string;
    const service = path.replace("/api/service/", "");

    const snapshot = await admin
      .app()
      .firestore()
      .collection("roles")
      .where("uid", "==", uid)
      .get();

    let hasAccess = false;

    snapshot.forEach((s) => {
      const role = s.data().role;
      const accesses = s.data().accesses;

      if (role === "admin" || accesses.includes(service)) {
        hasAccess = true;
      }
    });

    if (!hasAccess) {
      res.status(403).send("Access denied.");
    } else {
      next();
    }
  } catch (error) {
    console.error("Error checking user service access:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default serviceMiddleware;
