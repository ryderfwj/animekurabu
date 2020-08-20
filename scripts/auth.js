
// Add admin cloud function
const adminForm = document.querySelector('.add-admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({
    email: adminEmail
  }).then(result => {
    console.log(result);
  });
});

// Add high level manager cloud function
const highLevelManagerForm = document.querySelector('.add-high-level-manager-actions');
highLevelManagerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const highLevelManagerEmail = document.querySelector('#high-level-manager-email').value;
  const addHighLevelManagerRole = functions.httpsCallable('addHighLevelManagerRole');
  addHighLevelManagerRole({
    email: highLevelManagerEmail
  }).then(result => {
    console.log(result);
  });
});

// Add low level manager cloud function
const lowLevelManagerForm = document.querySelector('.add-low-level-manager-actions');
lowLevelManagerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const lowLevelManagerEmail = document.querySelector('#low-level-manager-email').value;
  const addLowLevelManagerRole = functions.httpsCallable('addLowLevelManagerRole');
  addLowLevelManagerRole({
    email: lowLevelManagerEmail
  }).then(result => {
    console.log(result);
  });
});

// Add club helper cloud function
const clubHelperForm = document.querySelector('.add-club-helper-actions');
clubHelperForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const clubHelperEmail = document.querySelector('#club-helper-email').value;
  const addClubHelperRole = functions.httpsCallable('addClubHelperRole');
  addClubHelperRole({
    email: clubHelperEmail
  }).then(result => {
    console.log(result);
  });
});

// Listen for authentication status changes
auth.onAuthStateChanged(user => {
  db.collection('users').get().then((snapshot) => {
    if (user) {
      firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
        if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
          $.when(setupUserAnimeCard(snapshot.docs)).then(addOnClick());
        }else{
          setupUserAnimeCard(snapshot.docs);
        }
      });
    }else{
      setupUserAnimeCard(snapshot.docs);
    }
    
  });
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      setupUI(user);
    });
    console.log('User has logged in');
  } else {
    console.log('User has logged out');
    setupUI();
  }
});

db.collection('users').onSnapshot(snapshot => {
  firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
    if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
      $.when(setupUserAnimeCard(snapshot.docs)).then(addOnClick());
    }else{
      setupUserAnimeCard(snapshot.docs);
    }
  });
});

// Signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // Sign up user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      nickname: signupForm['signup-nickname'].value,
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
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });

});

// Signout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// Signin
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // Sign in user
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });

});
