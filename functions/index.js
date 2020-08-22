const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { user } = require('firebase-functions/lib/providers/auth');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  // Check request is made by admin
  if (context.auth.token.admin != true) {
    return {
      error: 'You are not an admin'
    }
  }
  // Get user and add custom claim (admin)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Success! Admin action executed!`
    }
  }).catch(err => {
    return err;
  })
});

exports.addHighLevelManagerRole = functions.https.onCall((data, context) => {
  // Check request is made by admin
  if (context.auth.token.admin != true) {
    return {
      error: 'You are not an admin'
    }
  }
  // Get user and add custom claim (high level manager)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      highlevelmanager: true
    });
  }).then(() => {
    return {
      message: `Success! Admin action executed!`
    }
  }).catch(err => {
    return err;
  })
});

exports.addLowLevelManagerRole = functions.https.onCall((data, context) => {
  // Check request is made by admin
  if (context.auth.token.admin != true) {
    return {
      error: 'You are not an admin'
    }
  }
  // Get user and add custom claim (low level manager)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      lowlevelmanager: true
    });
  }).then(() => {
    return {
      message: `Success! Admin action executed!`
    }
  }).catch(err => {
    return err;
  })
});

exports.addClubHelperRole = functions.https.onCall((data, context) => {
  // Check request is made by admin
  if (context.auth.token.admin != true) {
    return {
      error: 'You are not an admin'
    }
  }
  // Get user and add custom claim (club helper)
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      clubhelper: true
    });
  }).then(() => {
    return {
      message: `Success! Admin action executed!`
    }
  }).catch(err => {
    return err;
  })
});

exports.addNewUser = functions.https.onCall((data, context) => {
  // Check request is made by admin
  if (context.auth.token.admin != true) {
    return {
      error: 'You are not an admin'
    }
  }
  return admin.auth().createUser({
    email: data.email,
    password: data.password
  }, function(err, user) {
    if (!err) {
      return user.uid;
    }
  });

});