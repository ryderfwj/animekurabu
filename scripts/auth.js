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
      db.collection('userwatch').doc(user.uid).set({});
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

  $('#promoteUserBtn').on('click', function (e) {
    e.preventDefault();
    var promoteEmail = $('#promoteEmail').val();
    var selectedOption = $('#promoteSelect').val();
    console.log(selectedOption);
    if (selectedOption == "admin") {
      // Add admin cloud function
      const addAdminRole = functions.httpsCallable('addAdminRole');
      addAdminRole({
        email: promoteEmail
      }).then(result => {
        document.getElementById('promoteForm').reset();
        $('#promoteModal').modal('hide');
        console.log(result);
      }).catch(err => {
        console.log("Failed to promote user: " + err.message);
      });
    } else if (selectedOption == "highlevelmanager") {
      // Add high level manager cloud function
      const addHighLevelManagerRole = functions.httpsCallable('addHighLevelManagerRole');
      addHighLevelManagerRole({
        email: promoteEmail
      }).then(result => {
        document.getElementById('promoteForm').reset();
        $('#promoteModal').modal('hide');
        console.log(result);
      }).catch(err => {
        console.log("Failed to promote user: " + err.message);
      });
    } else if (selectedOption == "lowlevelmanager") {
      // Add low level manager cloud function
      const addLowLevelManagerRole = functions.httpsCallable('addLowLevelManagerRole');
      addLowLevelManagerRole({
        email: promoteEmail
      }).then(result => {
        document.getElementById('promoteForm').reset();
        $('#promoteModal').modal('hide');
        console.log(result);
      }).catch(err => {
        console.log("Failed to promote user: " + err.message);
      });
    } else if (selectedOption == "clubhelper") {
      // Add club helper cloud function
      e.preventDefault();
      const addClubHelperRole = functions.httpsCallable('addClubHelperRole');
      addClubHelperRole({
        email: promoteEmail
      }).then(result => {
        document.getElementById('promoteForm').reset();
        $('#promoteModal').modal('hide');
        console.log(result);
      }).catch(err => {
        console.log("Failed to promote user: " + err.message);
      });
    } else {
      alert('Invalid option chosen, please try again');
    }
  });

}