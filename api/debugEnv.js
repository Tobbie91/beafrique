// Debug endpoint to check Firebase environment variables
module.exports = (req, res) => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Try to process the key the way our code does
  const processedKey = privateKey ? privateKey.replace(/\\n/g, '\n') : null;

  res.status(200).json({
    hasProjectId: !!projectId,
    projectId: projectId || null,
    hasClientEmail: !!clientEmail,
    clientEmail: clientEmail || null,
    hasPrivateKey: !!privateKey,
    privateKeyLength: privateKey ? privateKey.length : 0,
    processedKeyLength: processedKey ? processedKey.length : 0,
    privateKeyStart: privateKey ? privateKey.substring(0, 60) : null,
    privateKeyEnd: privateKey ? privateKey.substring(privateKey.length - 60) : null,
    processedKeyStart: processedKey ? processedKey.substring(0, 60) : null,
    processedKeyEnd: processedKey ? processedKey.substring(processedKey.length - 60) : null,
    privateKeyContainsBackslashN: privateKey ? privateKey.includes('\\n') : false,
    privateKeyContainsNewline: privateKey ? privateKey.includes('\n') : false,
    processedKeyStartsWithBegin: processedKey ? processedKey.startsWith('-----BEGIN PRIVATE KEY-----') : false,
    processedKeyEndsWithEnd: processedKey ? processedKey.endsWith('-----END PRIVATE KEY-----') : false,
  });
};
