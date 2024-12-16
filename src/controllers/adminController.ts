import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import AiStabilityService from "../services/ai-stability-serivce";
import FreepikService from "../services/freepik-service";

enum AccessLevel {
  TEXT_TO_IMAGE = "text-to-image",
  REMOVE_BACKGROUND = "remove-background",
  UPSCALE = "upscale",
  TEXT_TO_IMAGE_AI_STABILITY = "text-to-image-ai-stability",
}
export const grantPermission = async (req: any, res: any) => {
  const { uid, access } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "User ID is required." });
  }

  if (!Object.values(AccessLevel).includes(access)) {
    return res.status(400).json({ error: "Invalid access level." });
  }

  try {
    const snapshot = await admin
      .app()
      .firestore()
      .collection("roles")
      .where("uid", "==", uid)
      .get();

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ error: "No document found with the given UID." });
    }

    snapshot.docs.map(async (doc) => {
      const currentAccesses = doc.data().accesses || [];

      if (currentAccesses.includes(access)) {
        return res.status(409).json({ error: "Access level already granted." });
      }

      const updatedAccesses = [access, ...currentAccesses];

      await admin
        .app()
        .firestore()
        .collection("roles")
        .doc(doc.id)
        .update({ accesses: updatedAccesses });
      return res.status(200).send("Permissions updated successfully.");
    });
  } catch (error) {
    console.error("Error granting permission:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const removePermission = async (req: any, res: any) => {
  const { uid, access } = req.body;
  if (!uid) {
    res.status(400).json({ error: "user with given id does not exist" });
    return;
  }
  if (!Object.values(AccessLevel).includes(access)) {
    return res.status(400).json({ error: "Invalid access level." });
  }
  const snapshot = await admin
    .app()
    .firestore()
    .collection("roles")
    .where("uid", "==", uid)
    .get();

  if (snapshot.empty) {
    res.status(400).json({ error: "No document found with the given uid." });
    return;
  }

  snapshot.forEach(async (doc) => {
    await admin
      .app()
      .firestore()
      .collection("roles")
      .doc(doc.id)
      .update({
        accesses: FieldValue.arrayRemove(req.body.access),
      });
    res.status(200).send();
  });
};

export const benchmark = async (req: any, res: any) => {
  const freepik = new FreepikService();
  const aiStability = new AiStabilityService();

  const freepikStart = performance.now();
  let freepikEnd: DOMHighResTimeStamp;
  const promise1 = freepik
    .textToImage({ prompt: req.body.prompt })
    .then((_) => {
      freepikEnd = performance.now();
    })
    .catch();

  const aiStabilityStart = performance.now();
  let aiStabilityEnd: DOMHighResTimeStamp;
  const promise2 = aiStability
    .textToImage({ prompt: req.body.prompt, outputFormat: "webp" })
    .then((_) => {
      aiStabilityEnd = performance.now();
    });

  await Promise.all([promise1, promise2]);

  const freepikElapsed = Math.round(freepikEnd! - freepikStart);
  const aiStabilityElapsed = Math.round(aiStabilityEnd! - aiStabilityStart);

  res.status(200).json({
    freepikElapsed: freepikElapsed,
    aiStabilityElapsed: aiStabilityElapsed,
    difference: Math.abs(freepikElapsed - aiStabilityElapsed),
  });
};
