const userList = document.querySelector('#user-list');
const form = document.querySelector('#register-form');

// create element and render list
function renderUserList(doc){
  let li = document.createElement('li');
  let nickname = document.createElement('span');
  let dateJoined = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  nickname.textContent = doc.data().nickname;
  dateJoined.textContent = doc.data().date_joined;
  cross.textContent = 'x';

  li.appendChild(nickname);
  li.appendChild(dateJoined);
  li.appendChild(cross);
  
  userList.appendChild(li);

  // delete data
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('users').doc(id).delete();
  });
}

// getting data
// db.collection('users').where('nickname', '==', 'Hello there').orderBy('nickname').get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     console.log(doc.data());
//     renderUserList(doc);
//   })
// });

// saving data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  var date = new Date()
  var dateTime =  moment(date).format('DD-MM-yyyy hh:mm A');
  db.collection('users').add({
    username: form.username.value,
    password: form.password.value,
    nickname: form.nickname.value,
    date_joined: dateTime
  });
  form.username.value = '';
  form.password.value = '';
  form.nickname.value = '';
});

// real-time listener
db.collection('users').orderBy('nickname').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    console.log(change.doc.data());
    if(change.type == 'added'){
      renderUserList(change.doc);
    } else if (change.type == 'removed'){
      let li = userList.querySelector('[data-id=' + change.doc.id + ']');
      userList.removeChild(li);
    }
  })
});