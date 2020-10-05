var animeData;
var userData;
var userWatchData;

db.collection('users').onSnapshot(snapshot => {
  userData = snapshot.docs;
  db.collection('anime').orderBy("date_added", "desc").onSnapshot(ss => {
    animeData = ss.docs;
    db.collection('userwatch').onSnapshot(uw => {
      userWatchData = uw.docs;
      $.when(setupTicketTable(animeData, userData))
        .then(addCheck())
        .then(addUserIntoSelect(userData))
        .then(() => {
          auth.onAuthStateChanged(user => {
            if (user) {
              setupUI(user);
              firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
                  $('#addAnimeModalBtn').css('display', 'inline');
                  $('#updateAnimeBtn').css('display', 'inline');
                  $('#ticketTable').css('pointer-events', 'auto');
                  setTimeout(function () {
                    $("#loaderOverlay").hide();
                  }, 2000);
                } else {
                  $('#addAnimeModalBtn').css('display', 'none');
                  $('#updateAnimeBtn').css('display', 'none');
                  $('#ticketTable').css('pointer-events', 'none');
                  setTimeout(function () {
                    $("#loaderOverlay").hide();
                  }, 2000);
                }
              });
            } else {
              setupUI();
              $('#addAnimeModalBtn').css('display', 'none');
              $('#updateAnimeBtn').css('display', 'none');
              $('#ticketTable').css('pointer-events', 'none');
              setTimeout(function () {
                $("#loaderOverlay").hide();
              }, 2000);
            }
          });
        });
    });
  });
});

auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user);
    firebase.auth().currentUser.getIdTokenResult().then((idTokenResult) => {
      if (!!idTokenResult.claims.admin || !!idTokenResult.claims.highlevelmanager) {
        $('#addAnimeModalBtn').css('display', 'inline');
        $('#updateAnimeBtn').css('display', 'inline');
        $('#ticketTable').css('pointer-events', 'auto');
        setTimeout(function () {
          $("#loaderOverlay").hide();
        }, 2000);
      } else {
        $('#addAnimeModalBtn').css('display', 'none');
        $('#updateAnimeBtn').css('display', 'none');
        $('#ticketTable').css('pointer-events', 'none');
        setTimeout(function () {
          $("#loaderOverlay").hide();
        }, 2000);
      }
    });
  } else {
    setupUI();
    $('#addAnimeModalBtn').css('display', 'none');
    $('#updateAnimeBtn').css('display', 'none');
    $('#ticketTable').css('pointer-events', 'none');
    setTimeout(function () {
      $("#loaderOverlay").hide();
    }, 2000);
  }
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
  }
}

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

function hideActions() {
  $('#addAnimeModalBtn').hide();
  $('#updateAnimeBtn').hide();
  $('#ticketTable td').css('pointer-events', 'none');
}

const selectPickedBy = document.querySelector('#selectPickedBy');
function addUserIntoSelect(selectUser) {
  $('#addAnimeModalBtn').on('click', function () {
    $('#selectPickedBy').html('');
    var html = `<select id="userPickBy" class="custom-select"><option selected disabled>Open this select menu</option>`;
    if (selectUser != null) {
      console.log("Not null");
      selectUser.forEach(doc => {
        const users = doc.data();
        console.log(doc.id + " " + users.nickname);
        html += `<option value="${doc.id}">${users.nickname}</option>`;
      });
    } else {
      console.log("Null");
    }

    html += `</select>`;
    selectPickedBy.innerHTML = html;
  });

}

// Add new anime
$("#addAnimeBtn").on('click', function (event) {
  event.preventDefault();
  db.collection('anime').doc().set({
    name: $('#addAnimeName').val(),
    picked_by_name: $("#userPickBy option:selected").text(),
    picked_by_id: $('#userPickBy').val(),
    start_date: $('#startDate').val(),
    end_date: $('#endDate').val(),
    episodes: $('#episodes').val(),
    episode_length: $('#episodeLength').val(),
    session_used: $('#sessionUsed').val(),
    date_added: dateTime(),
  }).then(() => {
    // Close modal and reset form
    $('#addAnimeModal').modal('hide');
    document.getElementById('addAnimeForm').reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// Update check list
$("#updateAnimeBtn").on('click', function (event) {
  event.preventDefault();
  var userList = $('.user-list');
  var userListLength = userList.length;

  for (var i = 0; i < userListLength; i++) {
    // Table row 
    var docId = $(".user-list").eq(i).attr("data-id");
    // Check if checkbox is checked
    var inputCheck = $(".user-list").eq(i).find("td");
    var arrStr = [];
    if (inputCheck.length > 0) {
      for (var j = 0; j < inputCheck.length - 1; j++) {
        var rowClass = $(".user-list").eq(i).attr("id");
        var tdInput = $("#" + rowClass + " td input").eq(j);
        var isChecked = tdInput.prop("checked");
        var isMatchPick = tdInput.attr('match-pick');
        console.log(isMatchPick);

        if (isMatchPick == 'true') {
          var animeId = "Picked-" + $("#" + rowClass + " td input").eq(j).attr("class");
          arrStr.push(animeId);
          console.log("Picked " + animeId);
        } else {
          if (isChecked == true) {
            var animeId = $("#" + rowClass + " td input").eq(j).attr("class");
            arrStr.push(animeId);
            console.log("Input class: " + animeId);
          } else {
            arrStr.push("Not watched");
            console.log("Not watched");
          }
        }
      }
      arrStr.reverse();
      db.collection('userwatch').doc(docId).set({
        anime_list: arrStr
      }).catch(err => {
        console.log(err.message);
      });
    }
  }
});

// Setup ticket table
const ticketTable = document.querySelector('#ticketTable');
function setupTicketTable(aData, uData) {
  var currentRow = 0;
  var html = "";
  var addTD = "";

  if (currentRow == 0) {
    html += "<tr><td></td>";
    aData.forEach(doc => {
      const anime = doc.data();
      html += `<td>${anime.name}</td>`;
      addTD += `<td><input type="checkbox" data-id=${anime.picked_by_id} class="${doc.id}"></td>`;
    });
    html += "</tr>"
    currentRow++;
  }

  uData.forEach(doc => {
    const users = doc.data();
    html += `<tr id="${doc.id}" class="user-list" data-id="${doc.id}"><td class="table-username">${users.nickname}</td>` + addTD + `</tr>`;
  });

  ticketTable.innerHTML = html;
}

function addCheck() {
  userWatchData.forEach(doc => {
    const watch = doc.data();

    try {
      watch.anime_list.forEach(w => {
        var splitW = w;
        if (w.includes("Picked")) {
          splitW = w.split('-')[1];
        }
        if (splitW != "Not watched") {
          $("#" + doc.id + " ." + splitW).prop("checked", true);
          var checkPicked = $("#" + doc.id + " ." + splitW).attr('data-id');
          if (doc.id == checkPicked) {
            $("#" + doc.id + " ." + splitW).val("picked");
            $("#" + doc.id + " ." + splitW).attr('match-pick', 'true');
            $("#" + doc.id + " ." + splitW).parent().addClass('match-pick');
          }
        }
      }).catch(err => {
        console.log(err.message);
      });
    } catch (error) {

    }

  });
}

function toTimeZone(time, zone) {
  var format = 'YYYY/MM/DD HH:mm:ss ZZ';
  return moment(time, format).tz(zone).format(format);
}

function dateTime() {
  var CurrentDate = moment().toISOString();
  var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  var result = toTimeZone(CurrentDate, timezone);
  var result = toTimeZone(result, 'America/Los_Angeles');
  return result;
}