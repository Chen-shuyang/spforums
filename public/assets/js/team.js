/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */

// url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

// get item from url
const userData = localStorage.getItem('userInfo');
const tmpToken = JSON.parse(localStorage.getItem('token'));
let userSearchChar = [];
const userSearch = document.getElementById('userSearch');

function loadUserProfilePic() {
  const pic = JSON.parse(localStorage.getItem('userImage'));
  document.getElementById('adminName').innerText = JSON.parse(userData);
  if (pic == null) {
    document.getElementById('profilePic').src = 'assets/images/spforumLogo.png';
  } else {
    document.getElementById('profilePic').src = pic;
  }
}

function sendEmailOnUpdateUser(name, email, role, roleDescription, action, reason) {
  if (action === 'Upgrade') {
    Email.send({
      Host: 'smtp.gmail.com',
      Username: 'spforumsofficial@gmail.com',
      Password: 'qxyosyqkzpijcydj',
      To: `${email}`,
      From: 'spforumsofficial@gmail.com',
      Subject: 'Promotion from SP Forums',
      Body: `<h3>Name: ${name}</h3> 
                <h3>Email: ${email}</h3> 
                <h4>Hello ${name}, we are happy to announce to you that you have been promoted from a normal member to a ${role}!! <br/>
                Your main duties will be ${roleDescription}. Be sure to complete them whenever you can! <br/>
                Do note that any malecious actions or irresponsibility could lead to a downgrade of your role. <br/>
                For any enquiries, contact the Admin through the SP Forums official Email.</h4>
                `,
    });
  } else if (action === 'Downgrade') {
    Email.send({
      Host: 'smtp.gmail.com',
      Username: 'spforumsofficial@gmail.com',
      Password: 'qxyosyqkzpijcydj',
      To: `${email}`,
      From: 'spforumsofficial@gmail.com',
      Subject: 'Promotion from SP Forums',
      Body: `<h3>Name: ${name}</h3> 
                <h3>Email: ${email}</h3>
                <h4>Hello ${name}, we are sad to inform you that you have been downgraded to a normal member of SP Forums due to ${reason}. <br/>
                For any enquiries, contact the Admin through the SP Forums official Email.</h4>
                `,
    });
  }
  new Noty({
    timeout: '5000',
    type: 'success',
    layout: 'topCenter',
    theme: 'sunset',
    text: 'Email Sent',
  }).show();
}

function sendEmailOnDeleteUser(name, email, reason) {
  Email.send({
    Host: 'smtp.gmail.com',
    Username: 'spforumsofficial@gmail.com',
    Password: 'qxyosyqkzpijcydj',
    To: `${email}`,
    From: 'spforumsofficial@gmail.com',
    Subject: 'Promotion from SP Forums',
    Body: `<h3>Name: ${name}</h3> 
                <h3>Email: ${email}</h3> 
                <h4>Hello ${name}, we are sad to announce that you have been delete from our system <br/>
                due to ${reason} <br/>
                Meaning, you are not a member of our website anymore. <br/>
                You will not be able to comment, save, like, post, or carry out any other actions. <br/>
                What you can still do is view other's posts, stories, and events <br/>
                For any enquiries, contact the Admin through the SP Forums official Email.</h4>
                `,
  });
  new Noty({
    timeout: '5000',
    type: 'success',
    layout: 'topCenter',
    theme: 'sunset',
    text: 'Email Sent',
  }).show();
}

function displayAllRoles(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.roleID}</th>
            <td>${cardInfo.role}</td>
            <td>${cardInfo.roleDes}</td>
            <td>${cardInfo.noOfUsers}</td>
            <td><button class="material-icons" onclick="editGrpButton('${cardInfo.roleID}', '${cardInfo.role}', '${cardInfo.roleDes}')">edit</button></td>
        </tr>
    `;

  return card;
}

function displayAllUsers(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.userID}</th>
            <td>${cardInfo.username}</td>
            <td>${cardInfo.email}</td>
            <td>${cardInfo.school}</td>
            <td>${cardInfo.role}</td>
            <td><button class="material-icons" 
                onclick="editUserButton('${cardInfo.userID}', '${cardInfo.roleID}', '${cardInfo.username}', '${cardInfo.email}')">
                edit</button></td>
        </tr>
    `;
  return card;
}

function getAllUsers() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/allusers`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      userSearchChar = data;
      console.log(userSearchChar);

      $('#allUsers').html('');
      $('#msgUser').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const team = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            userID: team.userid,
            username: team.username,
            email: team.email,
            school: team.school,
            roleID: team.roleID,
            role: team.roleName,
          };

          const newCard = displayAllUsers(cardInfo);

          $('#allUsers').append(newCard);
        }
      } else {
        $('#msgUser').append('No User Found');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function getAllUsersByRole(role) {
  console.log(role);
  console.log(typeof (role));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/role/${role}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#allUsers').html('');
      $('#msgUser').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            userID: question.userid,
            username: question.username,
            email: question.email,
            school: question.school,
            roleID: question.roleID,
            role: question.roleName,
          };

          const newCard = displayAllUsers(cardInfo);

          $('#allUsers').append(newCard);
        }
      } else {
        $('#msgUser').append('No User Found');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function editUserButton(userId, roleId, username, email) {
  document.getElementById('modalUsers').style.display = 'flex';
  $('#usernameInput').val(username);
  $('#userEmailInput').val(email);
  $('#userID').val(userId);
  $('#roleInput').attr('data-initial-value', roleId);

  document.getElementById('roleInput').value = roleId;
}

function getAllRoles() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/roles`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#allGrps').html('');
      $('#msgGrp').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            roleID: question.roleID,
            role: question.roleName,
            roleDes: question.roleDescription,
            noOfUsers: question.no_of_users,
          };

          const newCard = displayAllRoles(cardInfo);

          $('#allGrps').append(newCard);
          $('#roleInput').append('');
          $('#roleInput').append(`<option value="${cardInfo.roleID}">${cardInfo.role} - ${cardInfo.roleDes}</option>`);
        }
      } else {
        $('#msgGrp').append('No Group Found');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function editGrpButton(grpID, grpName, grpDescription) {
  document.getElementById('editGrp').style.display = 'flex';
  $('#grpID').val(grpID);
  $('#editGrpNameInput').val(grpName);
  $('#EditGrpDesInput').val(grpDescription);
}

function updateGroups() {
  // data extraction
  const tmpGrpName = $('#editGrpNameInput').val();
  const tmpGrpDes = $('#EditGrpDesInput').val();
  const tmpGrpID = $('#grpID').val();

  // get item from local storage
  const data = {
    grpName: tmpGrpName,
    grpDes: tmpGrpDes,
  };
  console.log(`DATA: ${JSON.stringify(data)}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/newgrp/${tmpGrpID}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'update success',
        }).show();
        document.getElementById('editGrp').style.display = 'none';
        getAllRoles();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'error',
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function deleteGroups() {
  // data extraction
  const tmpGrpID = $('#grpID').val();

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/roles/${tmpGrpID}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'update success',
        }).show();

        document.getElementById('editGrp').style.display = 'none';
        $('#allGrps').html('');
        getAllRoles();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'error',
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function deleteUsers() {
  // data extraction
  const tmpUserID = $('#userID').val();
  const name = $('#usernameInput').val();
  const email = $('#userEmailInput').val();
  const reason = $('#reasonForDelete').val();

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/user/${tmpUserID}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'update success',
        }).show();
        document.getElementById('modalUsers').style.display = 'none';
        $('#allUsers').html('');
        sendEmailOnDeleteUser(name, email, reason);
        getAllUsers();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'error',
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function addNewGrps() {
  const tmpGrpName = $('#grpNameInput').val();
  const tmpGrpDes = $('#grpDesInput').val();

  const data = {
    roleN: tmpGrpName,
    roleD: tmpGrpDes,
  };

  console.log(typeof (JSON.stringify(data)));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/newrole`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'add new grp success',
        }).show();

        document.getElementById('addGrp').style.display = 'none';
        $('#allGrps').html('');
        getAllRoles();
        getAllUsers();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'error',
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function updateUserRole() {
  // data extraction
  const userName = $('#usernameInput').val();
  const userEmail = $('#userEmailInput').val();
  const tmpRole = $('#roleInput').val();
  const tmpUser = $('#userID').val();
  const downgradeReason = $('#downgradeReason').val();
  const roleOption = $('#roleInput option:selected').text();
  const fields = roleOption.split('-');
  const roleName = fields[0];
  const roleDes = fields[1];
  const action = $('#updateUserAction').val();

  // get item from local storage
  const data = {
    user: tmpUser,
    role: tmpRole,
  };
  console.log(`DATA: ${JSON.stringify(data)}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/newroles`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'update success',
        }).show();
        document.getElementById('modalUsers').style.display = 'none';
        getAllUsers();

        if (action === 'Upgrade' || action === 'Downgrade') {
          console.log(action);
          sendEmailOnUpdateUser(userName, userEmail, roleName, roleDes, action, downgradeReason);
        }
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'error',
        }).show();
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

userSearch.addEventListener('keyup', (e) => {
  let cardInfo = {};
  const similarResults = [];
  const searchString = e.target.value.toLowerCase();
  // eslint-disable-next-line arrow-body-style
  const filterUsers = userSearchChar.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchString)
    );
  });

  $('#allUsers').html('');
  $('#similarSearch').html('');
  if (filterUsers.length !== 0) {
    for (let i = 0; i < filterUsers.length; i++) {
      const team = filterUsers[i];

      // compile the data that the card needs for its creation
      const cardInfo = {
        userID: team.userid,
        username: team.username,
        email: team.email,
        school: team.school,
        roleID: team.roleID,
        role: team.roleName,
      };

      const newCard = displayAllUsers(cardInfo);
      $('#allUsers').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].username;
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const team = userSearchChar[i];

      // compile the data that the card needs for its creation
      cardInfo = {
        userID: team.userid,
        username: team.username,
        email: team.email,
        school: team.school,
        roleID: team.roleID,
        role: team.roleName,
      };
      if (distance <= 4) {
        similarResults.push(cardInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = displayAllUsers(similarResults[j]);
      $('#allUsers').append(newCard);
    }
    $('#similarSearch').html(`<b>${searchString}</b> not found, do you mean...`);
  }
});

$(document).ready(() => {
  loadUserProfilePic();
  getAllRoles();
  getAllUsers();

  $('#addGrpFormBtn').click(() => {
    addNewGrps();
  });

  $('#editUser').click(() => {
    updateUserRole();
  });

  $('#editGrpFormBtn').click(() => {
    updateGroups();
  });

  $('#deleteGrpFormBtn').click(() => {
    deleteGroups();
  });

  $('#deleteUser').click(() => {
    deleteUsers();
  });

  // logout button
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});
