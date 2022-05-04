import {auth, firestore, initializeApp} from 'firebase-admin';
import * as functions from 'firebase-functions';
import {ClickUpTicketData, Permissions} from './types';

const firebaseApp = initializeApp();
const db = firestore(firebaseApp);

interface GivePermissionsParams {
  uid: string;
  email: string;
  newPermissions: Permissions;
}

/**
 * Callable function to give a user new permissions in the form
 * of custom claims and firestore properties
 */
exports.addPermissions = functions.https.onCall(async (data: GivePermissionsParams, context) => {
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'User must be an Admin to update permissions');
  }
  return grantPermission(data.uid, data.newPermissions).then(() => {
    functions.logger.log(`Successfully updated permissions for ${data.email}`);
    return {
      result: `Successfully updated permissions for ${data.email}`,
    };
  });
});

/**
 * Adds a given custom claim to the user
 * @param {string} uid user ID for the user who is being given permissions
 * @param {Record<string, boolean>} newPermissions The new claim being set.
 * @param {any} auth
 * @param {FirebaseFirestore.Firestore} db Firestore database instance
 */
async function grantPermission(uid: string, newPermissions: Permissions): Promise<void> {
  const user = await auth().getUser(uid);
  functions.logger.log(`User Current Claims:${JSON.stringify(user.customClaims)}`);
  const newClaims = {...user.customClaims, ...newPermissions};
  functions.logger.log(`User New Claims:${JSON.stringify(newClaims)}`);
  await db.doc(`users/${uid}`).update(newClaims);
  return await auth().setCustomUserClaims(uid, newClaims);
}

exports.deleteBlogCommentData = functions.firestore
  .document('blogs/{postId}/comments/{commentId}')
  .onDelete(async (snap, context) => {
    const postId = context.params.postId;
    const commentId = context.params.commentId;
    const batch = db.batch();

    // delete blog comment replies
    const commentRepliesRef = db.collection(`blogs/${postId}/comments/${commentId}/replies`);
    (await commentRepliesRef.get()).docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    return batch.commit();
  });

exports.addTicketToClickUp = functions.https.onCall((data: ClickUpTicketData, context) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

  const request: XMLHttpRequest = new XMLHttpRequest();

  request.open('POST', 'https://api.clickup.com/api/v2/list/126192634/task');

  request.setRequestHeader('Authorization', process.env.CLICKUP_API_TOKEN as string);
  request.setRequestHeader('Content-Type', 'application/json');

  request.send(JSON.stringify(data));
  const res = {status: 0, body: '', ok: false};

  return new Promise((resolve, reject) => {
    request.onreadystatechange = function () {
      if (request.readyState === request.DONE) {
        const status = request.status;
        const body = request.responseText;
        if (status === 0 || (status >= 200 && status < 400)) {
          // The request has been completed successfully
          res.status = status;
          res.body = body;
          res.ok = true;
          resolve(res);
        } else {
          // Oh no! There has been an error with the request!
          res.status = status;
          res.body = body;
          resolve(res);
        }
      }
    };
  });
});
