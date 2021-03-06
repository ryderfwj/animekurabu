$(document).ready(function () {
  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();
});

const userAnimeCardTable = document.querySelector('#user-anime-card-table');
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

// Setup user anime card
const setupUserAnimeCard = (data) => {
  if (data.length) {
    let html = '';
    let counter = 0;
    data.forEach(doc => {
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
        pick1Check = 'checked';
      }
      if(users.pick2.check == "false"){
        pick2Check = '';
      }else{
        pick2Check = 'checked';
      }
      if(users.pick3.check == "false"){
        pick3Check = '';
      }else{
        pick3Check = 'checked';
      }

      var li = `
      <td>
        <table>
          <tr>
            <td colspan="2">Kenobi</td>
          </tr>
          <tr>
            <td>${users.pick1.name}</td>
            <td><input type="checkbox" ${pick1Check} disabled></td>
          </tr>
          <tr>
            <td>${users.pick2.name}</td>
            <td><input type="checkbox" ${pick1Check} disabled></td>
          </tr>
          <tr>
            <td>${users.pick3.name}</td>
            <td><input type="checkbox" ${pick1Check} disabled></td>
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