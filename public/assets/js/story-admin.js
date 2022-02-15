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

function displayStories(cardInfo) {
  const card = `
    <tr>
      <th scope="row">${cardInfo.storyID}</th>
      <td>${cardInfo.title}</td>
      <td>${cardInfo.description}</td>
      <td>${cardInfo.username}</td>
      <td>${cardInfo.date}</td>
      <td>
      <button class="btn btn-danger" onclick="deleteStory(${cardInfo.storyID})">Delete</button>
      </td>
    </tr>
  `;

  return card;
}

function allStories() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/topstories`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      userSearchChar = data;
      console.log(userSearchChar);

      $('#allStories').html('');
      $('#msg').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const story = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            storyID: story.storyId,
            title: story.title,
            description: story.description,
            content: story.story,
            username: story.username,
            date: story.date,
          };

          const newCard = displayStories(cardInfo);

          $('#allStories').append(newCard);
        }
      } else {
        $('#msg').append('No Stories Found');
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

function selectStoriesByDate(startDate, endDate) {
  const data = {
    start: startDate,
    end: endDate,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/story/date`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#allStories').html('');
      $('#msg').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const story = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            storyID: story.storyId,
            title: story.title,
            description: story.description,
            content: story.story,
            username: story.username,
            date: story.date,
          };

          const newCard = displayStories(cardInfo);

          $('#allStories').append(newCard);
        }
      } else {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'No Story in this period of time',
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

// eslint-disable-next-line no-unused-vars
function deleteStory(storyId) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/story/${storyId}`,
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
          text: 'Story successfully deleted',
        }).show();
        $('#allStories').html('');
        allStories();
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
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please log into your own account!',
        }).show();
        window.location.href = 'https://glacial-bastion-56154.herokuapp.com/login';
      }
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

  $('#allStories').html('');
  $('#similarSearch').html('');
  if (filterUsers.length !== 0) {
    for (let i = 0; i < filterUsers.length; i++) {
      const story = filterUsers[i];

      // compile the data that the card needs for its creation
      const cardInfo = {
        storyID: story.storyId,
        title: story.title,
        description: story.description,
        content: story.story,
        username: story.username,
        date: story.date,
      };

      const newCard = displayStories(cardInfo);
      $('#allStories').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].username;
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const story = userSearchChar[i];

      // compile the data that the card needs for its creation
      cardInfo = {
        storyID: story.storyId,
        title: story.title,
        description: story.description,
        content: story.story,
        username: story.username,
        date: story.date,
      };
      if (distance <= 4) {
        similarResults.push(cardInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = displayStories(similarResults[j]);
      $('#allStories').append(newCard);
    }
    $('#similarSearch').html(`<b>${searchString}</b> not found, do you mean...`);
  }
});

$(document).ready(() => {
  loadUserProfilePic();
  allStories();

  // $('#searchUserBtn').click(() => {
  //   selectStoriesByPosters();
  // });

  $('#dateFilter').click(() => {
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    if (startDate <= endDate) {
      selectStoriesByDate(startDate, endDate);
    } else {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Start date cannot be later than the end date',
      }).show();
    }
  });

  // logout button
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
