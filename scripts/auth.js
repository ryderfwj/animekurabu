// Add admin cloud function
// const adminForm = document.querySelector('.add-admin-actions');
// adminForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const adminEmail = document.querySelector('#admin-email').value;
//   const addAdminRole = functions.httpsCallable('addAdminRole');
//   addAdminRole({
//     email: adminEmail
//   }).then(result => {
//     console.log(result);
//   });
// });

// Add high level manager cloud function
// const highLevelManagerForm = document.querySelector('.add-high-level-manager-actions');
// highLevelManagerForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const highLevelManagerEmail = document.querySelector('#high-level-manager-email').value;
//   const addHighLevelManagerRole = functions.httpsCallable('addHighLevelManagerRole');
//   addHighLevelManagerRole({
//     email: highLevelManagerEmail
//   }).then(result => {
//     console.log(result);
//   });
// });

// Add low level manager cloud function
// const lowLevelManagerForm = document.querySelector('.add-low-level-manager-actions');
// lowLevelManagerForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const lowLevelManagerEmail = document.querySelector('#low-level-manager-email').value;
//   const addLowLevelManagerRole = functions.httpsCallable('addLowLevelManagerRole');
//   addLowLevelManagerRole({
//     email: lowLevelManagerEmail
//   }).then(result => {
//     console.log(result);
//   });
// });

// Add club helper cloud function
// const clubHelperForm = document.querySelector('.add-club-helper-actions');
// clubHelperForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const clubHelperEmail = document.querySelector('#club-helper-email').value;
//   const addClubHelperRole = functions.httpsCallable('addClubHelperRole');
//   addClubHelperRole({
//     email: clubHelperEmail
//   }).then(result => {
//     console.log(result);
//   });
// });

function eventListeners() {
  // Login
  $('#loginBtn').on('click', function (e) {
    console.log("Login clicked");
    e.preventDefault();
    var email = $('#loginEmail').val();
    console.log(email);
    var password = $('#loginPassword').val();
    console.log(password);
    auth.signInWithEmailAndPassword(email, password).then(cred => {
      document.getElementById('loginForm').reset();
      $('#loginModal .error').html("");
      $('#loginModal').modal('hide');
      console.log("Login successful");
    }).catch(err => {
      $('#loginModal .error').html(err.message);
      console.log("Failed to login: " + err.message);
    });
  });

  // Signup
  $('#newUserModal #createBtn').on('click', function (e) {
    e.preventDefault();
    var email = $('#newUserEmail').val();
    var password = $('#newUserPassword').val();

    const addNewUser = functions.httpsCallable('addNewUser');
    addNewUser({ email, password }).then(({ data: user }) => {
      console.log("User ID: " + user.uid);
      return db.collection('users').doc(user.uid).set({
        nickname: $('#newUserNickname').val(),
        pick1: {
          name: "Empty",
          check: "false"
        },
        pick2: {
          name: "Empty",
          check: "false"
        },
        pick3: {
          name: "Empty",
          check: "false"
        },
        activity: "Active"
      });
    }).then(() => {
      document.getElementById('newUserForm').reset();
      $('#newUserModal .error').html("");
      $('#newUserModal').modal('hide');
      console.log("Create user successful");
    }).catch(err => {
      $('#newUserModal .error').html(err.message);
      console.log("Failed to create new user: " + err.message);
    });
  });

  // Signout
  $('#logoutBtn').on('click', function (e) {
    console.log("Logout clicked");
    e.preventDefault();
    auth.signOut();
  });
}

// Listen for authentication status changes
auth.onAuthStateChanged(user => {
  db.collection('users').get().then((snapshot) => {
    if (user) {
      firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
        // Check for appropriate user
        if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
          $.when(setupUserAnimeCard(snapshot.docs)).then(addOnClick());
        } else {
          setupUserAnimeCard(snapshot.docs);
        }
      });
      setupUI(user);
    } else {
      setupUserAnimeCard(snapshot.docs);
      setupUI();
    }

  });
  // if (user) {
  //   user.getIdTokenResult().then(idTokenResult => {
  //     setupUI(user);
  //   });
  //   console.log('User has logged in');
  // } else {
  //   console.log('User has logged out');
  //   setupUI();
  // }
});

// On database (users) change, reload
db.collection('users').onSnapshot(snapshot => {
  auth.onAuthStateChanged(user => {
    if (user) {
      firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
        if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
          $.when(setupUserAnimeCard(snapshot.docs)).then(addOnClick());
        } else {
          setupUserAnimeCard(snapshot.docs);
        }
      });
      setupUI(user);
    } else {
      setupUserAnimeCard(snapshot.docs);
      setupUI();
    }
  });
});






