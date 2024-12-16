import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";
import admin from "firebase-admin";
import { Request, Response } from "express";

export const handleRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    const idToken = await credentials.user.getIdToken();

    if (idToken) {
      await admin.app().firestore().collection("roles").add({
        uid: credentials.user.uid,
        role: "user",
        accesses: [],
      });
      res.cookie("access_token", idToken, {
        httpOnly: true,
      });
      res
        .status(200)
        .json({ message: "User signed up successfully", credentials });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message || "An error occurred while registering user";
    res.status(400).json({ error: errorMessage });
  }
};

export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = await signInWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    const idToken = await credentials.user.getIdToken();

    if (idToken) {
      res.cookie("access_token", idToken, {
        httpOnly: true,
      });
      res.status(200).json({ message: "User logged in successfully", idToken });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "User does not exist" });
  }
};

export const handleLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await signOut(auth);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
