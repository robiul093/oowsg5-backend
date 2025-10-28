// import admin from "firebase-admin";

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
// };

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// export const sendNotification = async (token: string, title: string, body: string) => {
//   try {
//     await admin.messaging().send({
//       notification: { title, body },
//       token,
//     });
//   } catch (err) {
//     console.error("Error sending FCM notification:", err);
//   }
// };

import admin from "firebase-admin";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

/**
 * Send FCM notification with optional data payload (e.g. voice_url)
 * @param token - The user's FCM device token
 * @param title - Notification title
 * @param body - Notification body text
 * @param data - Optional custom data payload (e.g. { voice_url: string })
 */
// export const sendNotification = async (
//   token: string,
//   title: string,
//   body: string,
//   data: Record<string, string> = {}
// ) => {
//   try {
//     const message = {
//       token,
//       notification: { title, body },
//       data, // ✅ Include additional payload (e.g. voice_url)
//     };

//     await admin.messaging().send(message);
//     console.log("✅ Notification sent successfully");
//   } catch (err) {
//     console.error("❌ Error sending FCM notification:", err);
//   }
// };


export const sendNotification = async (
  token: string,
  title: string,
  body: string,
  data: Record<string, string> = {}
) => {
  try {
    const message = {
      token,
      notification: { title, body },
      data: {
        ...data,
        sound: 'notification_sound',
      },
      android: {
        notification: {
          sound: 'notification_sound',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'notification_sound.mp3',
          },
        },
      },
    };

    await admin.messaging().send(message);
    console.log("✅ Notification sent successfully");
  } catch (err) {
    console.error("❌ Error sending FCM notification:", err);
  }
};
