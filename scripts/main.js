const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // Display account information
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
      `;
      accountDetails.innerHTML = html;
    })

    // Toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    //  Hide account information
    accountDetails.innerHTML = '';
    // Toggle UI elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
    adminItems.forEach(item => item.style.display = 'none');
  }
}

// Create new user anime card
const createUserAnimeCardForm = document.querySelector('#create-user-anime-card-form');
createUserAnimeCardForm.addEventListener('submit', (e) => {
  e.preventDefault();

  db.collection('users').add({
    pick1: {
      name: createUserAnimeCardForm['pick1-name'].value,
      check: createUserAnimeCardForm['pick1-check'].value,
    },
    pick2: {
      name: createUserAnimeCardForm['pick2-name'].value,
      check: createUserAnimeCardForm['pick2-check'].value,
    },
    pick3: {
      name: createUserAnimeCardForm['pick3-name'].value,
      check3: createUserAnimeCardForm['pick3-check'].value,
    },
  }).then(() => {
    // Close modal and reset form
    const modal = document.querySelector('#modal-create-user-anime-card');
    M.Modal.getInstance(modal).close();
    createUserAnimeCardForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// Setup user anime card
const userAnimeCardTable = document.querySelector('.user-anime-card-table');
const setupUserAnimeCard = (data) => {
  console.log("Runing Anime Card");
  if (data.length) {
    console.log("Data length > 0");
    let html = '';
    let counter = 0;
    let addTR = 0;

    data.forEach(doc => {
      console.log("Counter: " + counter);
      if(counter / 5 == 0){
        html += `<tr>`
        addTR = 1;
        counter++;
      }
      const users = doc.data();
      var pick1Check;
      var pick2Check;
      var pick3Check;

      if(users.pick1.check == "false"){
        pick1Check = '';
      }else{
        pick1Check = 'checked="checked"';
      }
      if(users.pick2.check == "false"){
        pick2Check = '';
      }else{
        pick2Check = 'checked="checked"';
      }
      if(users.pick3.check == "false"){
        pick3Check = '';
      }else{
        pick3Check = 'checked="checked"';
      }

      var li = `
      <td>
        <table data-id='${users.id}'>
          <tr>
            <td colspan="2">Kenobi</td>
          </tr>
          <tr>
            <td>${users.pick1.name}</td>
            <td><input type="checkbox" class="filled-in" ${pick1Check} disabled="disabled"></td>
          </tr>
          <tr>
            <td>${users.pick2.name}</td>
            <td><input type="checkbox" class="filled-in" ${pick2Check} disabled="disabled"></td>
          </tr>
          <tr>
            <td>${users.pick3.name}</td>
            <td><input type="checkbox" class="filled-in" ${pick3Check} disabled="disabled"></td>
          </tr>
        </table>
      </td>
      `;
      html += li
      if(counter / 5 == 0 && addTR == 1){
        html += `</tr>`
        addTR = 0;
      }
    });

    userAnimeCardTable.innerHTML = html;
  } else {
    console.log("Data length = 0");
    userAnimeCardTable.innerHTML = `<h5 class='center-align'>Login to view</h5>`;
  }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});

$(document).ready(function () {
  checkBox();

  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();

  function checkBox(){
    $('input[type="checkbox"]').click(function () {
      if ($(this).prop("checked") == true) {
        $(this).val("true");
        console.log($(this).val());
      }else if ($(this).prop("checked") == false) {
        $(this).val("false");
        console.log($(this).val());
      }
    });
  }

});