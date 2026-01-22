// Debug endpoint to check Firebase environment variables
module.exports = (req, res) => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  res.status(200).json({
    hasProjectId: !!projectId,
    projectId: projectId || null,
    hasClientEmail: !!clientEmail,
    clientEmail: clientEmail || null,
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0,
    privateKeyStart: privateKey ? privateKey.substring(0, 50) : null,
    privateKeyEnd: privateKey ? privateKey.substring(privateKey.length - 50) : null,
    privateKeyContainsBackslashN: privateKey ? privateKey.includes('\\n') : false,
    privateKeyContainsNewline: privateKey ? privateKey.includes('\n') : false,
  });
};
