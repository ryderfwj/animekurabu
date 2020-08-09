// Listen for authentication status changes
auth.onAuthStateChanged(user => {
  if(user){
    console.log('User has logged in');
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
      setupUI(user);
    }, err => {
      console.log(err.message);
    });
  } else {
    console.log('User has logged out');
    setupUI();
    setupGuides([]);
  }
});

// Create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value,
  }).then(() => {
    // Close modal and reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
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
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
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
  });

});