import admin from "firebase-admin";

export function seedData() {
  admin
    .auth()
    .getUserByEmail("superAdmin@gmail.com")
    .then((r) => console.log("admin exists, seeding not needed"))
    .catch((e) => {
      admin
        .auth()
        .createUser({
          email: "superAdmin@gmail.com",
          password: "admin123",
        })
        .then((u) => {
          admin.app().firestore().collection("roles").add({
            uid: u.uid,
            role: "admin",
            accesses: [], // he is admin so he has access by default
          });
          console.log("data seeded successfuly!");
        });
    });
}
