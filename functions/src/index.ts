import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.listUsers = functions.https.onCall(async (context: any) => {
  const users: any[] = [];
  const listUsersResult = await admin.auth().listUsers();
  listUsersResult.users.forEach((userRecord: any) => {
    users.push(userRecord.email); // or any other user data you want to display
  });
  return users;
});
