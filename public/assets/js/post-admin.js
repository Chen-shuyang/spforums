/* eslint-disable linebreak-style */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
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

function allPosts() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/topqns`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      userSearchChar = data;
      console.log(userSearchChar);

      $('#msg').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            questionid: question.questionid,
            title: question.title,
            description: question.description,
            upvotes: question.upvotes,
            username: question.username,
            date: question.date,
          };

          const newCard = displayPost(cardInfo);

          $('#allPosts').append(newCard);
        }
      } else {
        $('#msg').append('No Posts Found');
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

function selectPostByDate(startDate, endDate) {
  const data = {
    start: startDate,
    end: endDate,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qna/date`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#allPosts').html('');
      $('#msg').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            questionid: question.questionid,
            title: question.title,
            description: question.description,
            upvotes: question.upvotes,
            username: question.username,
            date: question.date,
          };

          const newCard = displayTopPost(cardInfo);

          $('#allPosts').append(newCard);
        }
      } else {
        $('#msg').append('No Post in this period of time');
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
function deletePost(qnId) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qna/${qnId}`,
    type: 'DELETE',
    // data: data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data.rowsAffected === 0) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'You have Liked This post Already',
        }).show();
      } else if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Question successfully deleted',
        }).show();
        $('#allPosts').html('');
        allPosts();
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
    // error handling
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      if (xhr.status === 403 || xhr.status === 401) {
        // delete localStarage
        window.localStorage.clear();
        alert('Please log into your own account!');
        window.location.href = 'https://glacial-bastion-56154.herokuapp.com/login';
      }
    },
  });
}

function displayPost(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.questionid}</th>
            <td>${cardInfo.title}</td>
            <td>${cardInfo.description}</td>
            <td>${cardInfo.username}</td>
            <td>${cardInfo.date}</td>
            <td>
            <button class="btn btn-danger" onclick="deletePost(${cardInfo.questionid})">Delete</button>
            </td>
        </tr>
    `;

  return card;
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

  $('#similarSearch').html('');
  $('#allPosts').html('');
  if (filterUsers.length !== 0) {
    for (let i = 0; i < filterUsers.length; i++) {
      const question = filterUsers[i];

      // compile the data that the card needs for its creation
      cardInfo = {
        questionid: question.questionid,
        title: question.title,
        description: question.description,
        upvotes: question.upvotes,
        username: question.username,
        date: question.date,
      };

      const newCard = displayPost(cardInfo);
      $('#allPosts').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].username;
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const question = userSearchChar[i];

      // compile the data that the card needs for its creation
      cardInfo = {
        questionid: question.questionid,
        title: question.title,
        description: question.description,
        upvotes: question.upvotes,
        username: question.username,
        date: question.date,
      };
      if (distance <= 4) {
        similarResults.push(cardInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = displayPost(similarResults[j]);
      $('#allPosts').append(newCard);
    }
    $('#similarSearch').html(`<b>${searchString}</b> not found, do you mean...`);
  }
});

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

$(document).ready(() => {
  loadUserProfilePic();
  allPosts();

  $('#dateFilter').click(() => {
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    if (startDate <= endDate) {
      selectPostByDate(startDate, endDate);
    } else {
      alert('Start date cannot be later than the end date');
    }
  });

  // logout button
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});
