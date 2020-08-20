const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
  if (user) {
    firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
      if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
        adminItems.forEach(item => item.style.display = 'block');
        $("#loaderOverlay").show();
        $(".anime-card").eq(0).click();
        setTimeout(function () {
          $("#modal-create-user-anime-card").css("display", "none");
          $("#loaderOverlay").hide();
        }, 1000);

      }
    });
    // Display account information
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
        <div class="pink-text">${user.highlevel ? 'High Level User' : ''}</div>
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
const activeAnimeCardTable = document.querySelector('#activeAnimeCardTable');
const milkCartonAnimeCardTable = document.querySelector('#milkCartonAnimeCardTable');
function setupUserAnimeCard(data) {
  if (data.length) {
    let activeHTML = '';
    let milkCartonHTML = '';
    let activeCounter = 0;
    let milkCartonCounter = 0;
    let addActiveTR = 0;
    let addMilkCartonTR = 0;

    data.forEach(doc => {
      const users = doc.data();
      if (users.activity == "Active") {
        if (activeCounter / 5 == 0) {
          activeHTML += `<tr>`
          addActiveTR = 1;
          activeCounter++;
        }
        var pick1Check;
        var pick2Check;
        var pick3Check;

        if (users.pick1.check == "false") {
          pick1Check = '';
        } else {
          pick1Check = 'checked="checked"';
        }
        if (users.pick2.check == "false") {
          pick2Check = '';
        } else {
          pick2Check = 'checked="checked"';
        }
        if (users.pick3.check == "false") {
          pick3Check = '';
        } else {
          pick3Check = 'checked="checked"';
        }

        var li = `
        <td class="td-main-cell">
          <table class="anime-card active-user" data-id='${doc.id}'>
            <tr>
              <td colspan="2" class="anime-card-username">${users.nickname}</td>
            </tr>
            <tr>
              <td class="pick1name">${users.pick1.name}</td>
              <td><input type="checkbox" class="filled-in pick1check" ${pick1Check} style="pointer-events: none;"></td>
            </tr>
            <tr>
              <td class="pick2name">${users.pick2.name}</td>
              <td><input type="checkbox" class="filled-in pick2check" ${pick2Check} style="pointer-events: none;"></td>
            </tr>
            <tr>
              <td class="pick3name">${users.pick3.name}</td>
              <td><input type="checkbox" class="filled-in pick3check" ${pick3Check} style="pointer-events: none;"></td>
            </tr>
            <tr style="display: none;">
              <td class="anime-card-activity">${users.activity}</td>
            </tr>
          </table>
        </td>
        `;

        activeHTML += li

        if (activeCounter / 5 == 0 && addActiveTR == 1) {
          activeHTML += `</tr>`
          addActiveTR = 0;
        }

      } else if (users.activity == "Milk Carton") {
        if (milkCartonCounter / 5 == 0) {
          milkCartonHTML += `<tr>`
          addMilkCartonTR = 1;
          milkCartonCounter++;
        }
        var pick1Check;
        var pick2Check;
        var pick3Check;

        if (users.pick1.check == "false") {
          pick1Check = '';
        } else {
          pick1Check = 'checked="checked"';
        }
        if (users.pick2.check == "false") {
          pick2Check = '';
        } else {
          pick2Check = 'checked="checked"';
        }
        if (users.pick3.check == "false") {
          pick3Check = '';
        } else {
          pick3Check = 'checked="checked"';
        }

        var li = `
        <td class="td-main-cell">
          <table class="anime-card milk-carton" data-id='${doc.id}'>
            <tr>
              <td colspan="2" class="anime-card-username">${users.nickname}</td>
            </tr>
            <tr>
              <td class="pick1name">${users.pick1.name}</td>
              <td><input type="checkbox" class="filled-in pick1check" ${pick1Check} style="pointer-events: none;"></td>
            </tr>
            <tr>
              <td class="pick2name">${users.pick2.name}</td>
              <td><input type="checkbox" class="filled-in pick2check" ${pick2Check} style="pointer-events: none;"></td>
            </tr>
            <tr>
              <td class="pick3name">${users.pick3.name}</td>
              <td><input type="checkbox" class="filled-in pick3check" ${pick3Check} style="pointer-events: none;"></td>
            </tr>
            <tr style="display: none;">
              <td class="anime-card-activity">${users.activity}</td>
            </tr>
          </table>
        </td>
        `;

        milkCartonHTML += li

        if (milkCartonCounter / 5 == 0 && addMilkCartonTR == 1) {
          milkCartonHTML += `</tr>`
          addMilkCartonTR = 0;
        }

      }

    });

    activeAnimeCardTable.innerHTML = activeHTML;
    milkCartonAnimeCardTable.innerHTML = milkCartonHTML;
  } else {
    activeAnimeCardTable.innerHTML = `<h5 class='center-align'>Login to view</h5>`;
  }
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function () {
  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);
  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});

// Click card to show edit option
function addOnClick() {
  $('.anime-card').on("click", function () {
    var dataId = $(this).attr('data-id');

    var username = $(this).find(".anime-card-username").html();
    $("#animeCardUsername").val(username);

    var userActivity = $(this).find(".anime-card-activity").html();
    if (userActivity != null) {
      if (userActivity == "Active") {
        $("#radio-active").click();
      } else if (userActivity == "Milk Carton") {
        $("#radio-milk").click();
      }
    }

    //Pick 1
    var pick1name = $(this).find(".pick1name").html();
    var pick1check = $(this).find(".pick1check").attr("checked");
    //Pick 2
    var pick2name = $(this).find(".pick2name").html();
    var pick2check = $(this).find(".pick2check").attr("checked");
    //Pick 3
    var pick3name = $(this).find(".pick3name").html();
    var pick3check = $(this).find(".pick3check").attr("checked");

    $("#pick1-name").val(pick1name);
    $("#pick2-name").val(pick2name);
    $("#pick3-name").val(pick3name);

    if (pick1check != null) {
      $("#pick1-check").click();
    }
    if (pick2check != null) {
      $("#pick2-check").click();
    }
    if (pick3check != null) {
      $("#pick3-check").click();
    }

    $(function () {
      M.updateTextFields();
    });

    $('#anime-card-user-id').attr('value', dataId);
    setTimeout(function () {
      $('#modal-create-user-anime-card').css('display', 'block');
    }, 200);

  });
}

// Update user anime card
const updateAnimeCardForm = document.querySelector('#create-user-anime-card-form');
updateAnimeCardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  var userId = $('#anime-card-user-id').attr('value');
  db.collection('users').doc(userId).update({
    nickname: updateAnimeCardForm['animeCardUsername'].value,
    pick1: {
      name: updateAnimeCardForm['pick1-name'].value,
      check: updateAnimeCardForm['pick1-check'].value,
    },
    pick2: {
      name: updateAnimeCardForm['pick2-name'].value,
      check: updateAnimeCardForm['pick2-check'].value,
    },
    pick3: {
      name: updateAnimeCardForm['pick3-name'].value,
      check: updateAnimeCardForm['pick3-check'].value,
    },
    activity: updateAnimeCardForm['radio-value'].value,
  }).then(() => {
    // Close modal and reset form
    const modal = document.querySelector('#modal-create-user-anime-card');
    M.Modal.getInstance(modal).close();
    $("#modal-create-user-anime-card").css("display", "none");
    updateAnimeCardForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

$('#closeUpdateAnimeCard').on("click", function () {
  updateAnimeCardForm.reset();
  $("#modal-create-user-anime-card").css("display", "none");
});

$('#radio-active').on("click", function () {
  $("#radio-value").attr("value", "Active");
});

$('#radio-milk').on("click", function () {
  $("#radio-value").attr("value", "Milk Carton");
});

$(document).ready(function () {
  checkBox();
  setTimeout(function () {
    loaderHide();
  }, 1000);

  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();

  function checkBox() {
    $('input[type="checkbox"]').click(function () {
      if ($(this).prop("checked") == true) {
        $(this).val("true");
      } else if ($(this).prop("checked") == false) {
        $(this).val("false");
      }
    });
  }

  function loaderShow() {
    $("#loaderOverlay").show();
  }

  function loaderHide() {
    $("#loaderOverlay").hide();
  }

});