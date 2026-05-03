/**
 * Firebase Cloud Function: setAdminClaim
 * 
 * Instructions:
 * 1. Requires Firebase Blaze Plan.
 * 2. Deploy this function to your Firebase project.
 * 3. Use this function to grant admin privileges to specific users.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Check if requester is already an admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can grant admin rights.');
  }

  const { email, isAdmin } = data;
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: isAdmin });
    
    return { message: `Successfully updated admin claim for ${email} to ${isAdmin}` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * INITIAL BOOTSTRAP:
 * To set the first admin, you can run this via Firebase Admin SDK locally once:
 * 
 * admin.auth().setCustomUserClaims('USER_UID', { admin: true });
 */
