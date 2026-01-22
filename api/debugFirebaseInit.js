// Test Firebase Admin initialization with detailed error reporting
const admin = require("firebase-admin");

module.exports = async (req, res) => {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Check what we have
    const checks = {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey ? privateKey.length : 0,
    };

    if (!projectId || !clientEmail || !privateKey) {
      return res.status(200).json({
        ok: false,
        error: "Missing Firebase credentials",
        checks,
      });
    }

    // Try to initialize
    try {
      // Clear any existing apps first
      if (admin.apps.length > 0) {
        await Promise.all(admin.apps.map(app => app?.delete()));
      }

      const processedKey = privateKey.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: processedKey,
        })
      });

      const db = admin.firestore();

      // Try a simple operation
      const testDoc = await db.doc("products/hanna-jacket").get();

      return res.status(200).json({
        ok: true,
        initialized: true,
        docExists: testDoc.exists,
        checks,
      });

    } catch (initError) {
      return res.status(200).json({
        ok: false,
        error: "Firebase initialization failed",
        errorMessage: initError.message,
        errorCode: initError.code,
        errorStack: initError.stack,
        checks,
      });
    }

  } catch (outerError) {
    return res.status(200).json({
      ok: false,
      error: "Unexpected error",
      errorMessage: outerError.message,
      errorStack: outerError.stack,
    });
  }
};
