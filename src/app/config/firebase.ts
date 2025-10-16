import admin from "firebase-admin";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (token: string, title: string, body: string) => {
  try {
    await admin.messaging().send({
      notification: { title, body },
      token,
    });
  } catch (err) {
    console.error("Error sending FCM notification:", err);
  }
};
