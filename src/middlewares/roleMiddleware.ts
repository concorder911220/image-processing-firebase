import { Response, NextFunction } from "express";
import admin from "firebase-admin";

const roleMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(403).send("User ID is required.");
    }

    const snapshot = await admin
      .app()
      .firestore()
      .collection("roles")
      .where("uid", "==", uid)
      .get();

    if (snapshot.empty) {
      res.status(403).send("Role not found. Access denied.");
    }

    let isAdmin = false;

    snapshot.forEach((doc) => {
      const role = doc.data().role;
      if (role === "admin") {
        isAdmin = true;
      }
    });

    if (isAdmin) {
      next();
    } else {
      res.status(403).send("Your permission is not enough");
    }
  } catch (error) {
    console.error("Error checking user role:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default roleMiddleware;
