$(document).ready(function () {
  loadNavBar();
  loadModals();

  function loadNavBar() {
    $('#navBarWrapper').load('load/navbar.html', function () {
      // To do
    });
    console.log('Navigation bar loaded');
  }

  function loadModals() {
    $('#modalWrapper').load('load/modal.html', function () {
      // To do
      eventListeners();
    });
    console.log('Modals loaded');
  }

});

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

  db.collection('halloffame').get().then((snapshot) => {
    setupHOFCard(snapshot.docs);
    if (user) {
      setupUI(user);
    } else {
      setupUI();
    }
  });
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

db.collection('halloffame').onSnapshot(snapshot => {
    setupHOFCard(snapshot.docs);
});

const logout = document.querySelectorAll('.logout');
const login = document.querySelectorAll('.login');
const admin = document.querySelectorAll('.admin');

const setupUI = (user) => {
  if (user) {
    firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
      if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
        $('.admin').show();
        $("#loaderOverlay").show();
        setTimeout(function () {
          $("#loaderOverlay").hide();
        }, 1000);
      }
    });
    // Display account information
    // db.collection('users').doc(user.uid).get().then(doc => {
    //   const html = `
    //     <div>Logged in as ${user.email}</div>
    //     <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
    //     <div class="pink-text">${user.highlevel ? 'High Level User' : ''}</div>
    //   `;
    //   accountDetails.innerHTML = html;
    // })

    // Toggle UI elements
    $('.login').show();
    $('.logout').hide();
  } else {
    // Toggle UI elements
    $('.login').hide();
    $('.logout').show();
    $('.admin').hide();
    setTimeout(function () {
      $("#loaderOverlay").hide();
    }, 1000);
  }
}

//=============================================================================================================
// Setup anime card
//=============================================================================================================
const activeTable = document.querySelector('#activeTable');
const cartonTable = document.querySelector('#cartonTable');
const hofTable = document.querySelector('#hofTable');

function cardTable(doc) {
  const users = doc.data();
  var pick1Check;
  var pick2Check;
  var pick3Check;

  if (users.pick1.check == "false") {
    pick1Check = '';
  } else if (users.pick1.check == "true") {
    pick1Check = 'checked="checked"';
  }
  if (users.pick2.check == "false") {
    pick2Check = '';
  } else if (users.pick2.check == "true") {
    pick2Check = 'checked="checked"';
  }
  if (users.pick3.check == "false") {
    pick3Check = '';
  } else if (users.pick3.check == "true") {
    pick3Check = 'checked="checked"';
  }

  var li = `
    <td class="td-main-cell">
        <table class="inner-table anime-card table-sm table-bordered" data-id='${doc.id}'>
            <thead>
                <tr>
                    <td colspan="2" class="card-username">${users.nickname}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="pick1-name">${users.pick1.name}</td>
                    <td class="checkbox-cell"><input type="checkbox" class="filled-in pick1-check" ${pick1Check} style="pointer-events: none;"></td>
                </tr>
                <tr>
                    <td class="pick2-name">${users.pick2.name}</td>
                    <td class="checkbox-cell"><input type="checkbox" class="filled-in pick2-check" ${pick2Check} style="pointer-events: none;"></td>
                </tr>
                <tr>
                    <td class="pick3-name">${users.pick3.name}</td>
                    <td class="checkbox-cell"><input type="checkbox" class="filled-in pick3-check" ${pick3Check} style="pointer-events: none;"></td>
                </tr>
                <tr style="display: none;">
                    <td class="card-activity">${users.activity}</td>
                </tr>
            </tbody>
        </table>
    </td>
    `;

  return li;
}

function hofCardTable(doc) {
  const users = doc.data();

  var li = `
    <td class="td-main-cell">
        <table class="inner-table anime-card table-sm table-bordered" data-id='${doc.id}'>
            <thead>
                <tr>
                    <td colspan="2" class="card-username">${users.nickname}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="pick1-name">${users.pick1.name}</td>
                </tr>
                <tr>
                    <td class="pick2-name">${users.pick2.name}</td>
                </tr>
                <tr>
                    <td class="pick3-name">${users.pick3.name}</td>
                </tr>
                <tr>
                    <td>Date Achieved</td>
                </tr>
                <tr>
                    <td class="card-achieved">${users.achieved_on}</td>
                </tr>
            </tbody>
        </table>
    </td>
    `;

  return li;
}

function setupUserAnimeCard(data) {
  if (data.length) {
    let activeHTML = '';
    let cartonHTML = '';
    let activeCounter = 0;
    let cartonCounter = 0;
    let addActiveTR = 0;
    let addCartonTR = 0;

    data.forEach(doc => {
      const users = doc.data();
      if (users.activity == "Active") {

        if (activeCounter % 5 == 0) {
          activeHTML += `<tr>`
          addActiveTR = 1;
        }

        activeCounter++;
        activeHTML += cardTable(doc);

        if (activeCounter % 5 == 0 && addActiveTR == 1) {
          activeHTML += `</tr>`
          addActiveTR = 0;
        }

      } else if (users.activity == "Milk Carton") {

        if (cartonCounter % 5 == 0) {
          cartonHTML += `<tr>`
          addCartonTR = 1;
        }

        cartonCounter++;
        cartonHTML += cardTable(doc);

        if (cartonCounter % 5 == 0 && addMilkCartonTR == 1) {
          cartonHTML += `</tr>`
          addCartonTR = 0;
        }
      }
    });

    activeTable.innerHTML = activeHTML;
    cartonTable.innerHTML = cartonHTML;
  } else {
    activeTable.innerHTML = `<h5 class='center-align'>There are no card to display</h5>`;
  }
}

function setupHOFCard(data) {
  if (data.length) {
    let hofHTML = '';
    let hofCounter = 0;
    let addHOFTR = 0;

    data.forEach(doc => {
      const users = doc.data();

      if (hofCounter % 5 == 0) {
        hofHTML += `<tr>`
        addHOFTR = 1;
      }

      hofCounter++;
      hofHTML += hofCardTable(doc);

      if (hofCounter % 5 == 0 && addHOFTR == 1) {
        hofHTML += `</tr>`
        addHOFTR = 0;
      }
    });

    hofTable.innerHTML = hofHTML;
  } else {
    hofTable.innerHTML = `<h5 class='center-align'>There are no card to display</h5>`;
  }
}

// Click card to show edit option
function addOnClick() {
  $('.inner-table').attr("data-toggle", "modal");
  $('.inner-table').attr("data-target", "#updateUserModal");

  $('.anime-card').on("click", function () {
    var dataId = $(this).attr('data-id');
    $('#updateUserId').attr('value', dataId);

    var username = $(this).find(".card-username").html();
    $("#updateUserName").val(username);

    var userActivity = $(this).find(".card-activity").html();
    if (userActivity != null) {
      if (userActivity == "Active") {
        $("#activeRadio").click();
      } else if (userActivity == "Milk Carton") {
        $("#cartonRadio").click();
      }
    }

    //Pick 1
    var pick1name = $(this).find(".pick1-name").html();
    var pick1check = $(this).find(".pick1-check").attr("checked");
    //Pick 2
    var pick2name = $(this).find(".pick2-name").html();
    var pick2check = $(this).find(".pick2-check").attr("checked");
    //Pick 3
    var pick3name = $(this).find(".pick3-name").html();
    var pick3check = $(this).find(".pick3-check").attr("checked");

    $("#updatePick1Name").val(pick1name);
    $("#updatePick2Name").val(pick2name);
    $("#updatePick3Name").val(pick3name);

    $("#updatePick1Check").removeAttr("checked");
    $("#updatePick2Check").removeAttr("checked");
    $("#updatePick3Check").removeAttr("checked");
    $("#updatePick1Check").removeAttr("value");
    $("#updatePick2Check").removeAttr("value");
    $("#updatePick3Check").removeAttr("value");

    if (pick1check == "checked") {
      $("#updatePick1Check").attr("checked", "checked");
      $("#updatePick1Check").attr("value", "true");
    }
    if (pick2check == "checked") {
      $("#updatePick2Check").attr("checked", "checked");
      $("#updatePick2Check").attr("value", "true");
    }
    if (pick3check == "checked") {
      $("#updatePick3Check").attr("checked", "checked");
      $("#updatePick3Check").attr("value", "true");
    }
  });
}

$('input[type="checkbox"]').click(function () {
  if ($(this).prop("checked") == true) {
    $(this).val("true");
  } else if ($(this).prop("checked") == false) {
    $(this).val("false");
  }
});

$('#activeRadio').on("click", function () {
  $("#updateActivity").attr("value", "Active");
});

$('#cartonRadio').on("click", function () {
  $("#updateActivity").attr("value", "Milk Carton");
});

// Update user anime card
$("#updateCardBtn").on('click', function (event) {
  event.preventDefault();
  var userId = $('#updateUserId').val();
  console.log("User Id: " + userId);
  db.collection('users').doc(userId).update({
    nickname: $('#updateUserName').val(),
    pick1: {
      name: $('#updatePick1Name').val(),
      check: $('#updatePick1Check').val(),
    },
    pick2: {
      name: $('#updatePick2Name').val(),
      check: $('#updatePick2Check').val(),
    },
    pick3: {
      name: $('#updatePick3Name').val(),
      check: $('#updatePick3Check').val(),
    },
    activity: $('#updateActivity').val(),
  }).then(() => {
    // Close modal and reset form
    $('#updateUserModal').modal('hide');
    document.getElementById('updateUserForm').reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// Add to Hall of Fame
$("#makeHOF").on('click', function (event) {
  event.preventDefault();
  var userId = $('#updateUserId').val();
  console.log("User Id: " + userId);
  var dateTime = getDateTime();
  db.collection('halloffame').doc(userId).set({
    nickname: $('#updateUserName').val(),
    pick1: {
      name: $('#updatePick1Name').val(),
    },
    pick2: {
      name: $('#updatePick2Name').val(),
    },
    pick3: {
      name: $('#updatePick3Name').val(),
    },
    achieved_on: dateTime,
  }).then(() => {
    db.collection('users').doc(userId).update({
      pick1: {
        name: "Empty",
        check: "false",
      },
      pick2: {
        name: "Empty",
        check: "false",
      },
      pick3: {
        name: "Empty",
        check: "false",
      },
    }).catch(err => {
      console.log(err.message);
    });
    // Close modal and reset form
    $('#updateUserModal').modal('hide');
    document.getElementById('updateUserForm').reset();
  }).catch(err => {
    console.log(err.message);
  });
});

function getDateTime() {
  var dateTime = moment().format('DD-MM-YYYY');
  return dateTime;
}
