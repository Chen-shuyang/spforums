/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */

// url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';
const url = 'http://localhost:5000';

// get item from url
const userData = localStorage.getItem('userInfo');
const userid = localStorage.getItem('userid');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const role = localStorage.getItem('role');

function loadUserProfilePic() {
  const pic = JSON.parse(localStorage.getItem('userImage'));
  document.getElementById('adminName').innerText = JSON.parse(userData);
  if (pic == null) {
    document.getElementById('profilePic').src = 'assets/images/spforumLogo.png';
  } else {
    document.getElementById('profilePic').src = pic;
  }
}

function displayTopPost(cardInfo) {
  const card = `
            <li>
                <a href="#">
                <span class="posts">${cardInfo.description}</span>
                </a>
                <span class="likes" style="display:block">${cardInfo.upvotes}<i class='bx bxs-heart'></i></span>
            </li>
    `;
  return card;
}

function noOfUsers() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/usercount`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      // display information
      $('#userNo').append(data[0].userNo);
    },

    // error handling
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

function noOfPosts() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/postcount`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      // display information
      $('#postNo').append(data[0].postNo);
    },

    // error handling
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

function noOfStories() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/storycount`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      // display information
      $('#storyNo').append(data[0].storyNo);
    },

    // error handling
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

function noOfEvents() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/eventcount`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      // display information
      $('#eventNo').append(data[0].eventNo);
    },

    // error handling
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

function topPosts() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/posts/topten`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const home = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          questionid: home.questionid,
          title: home.title,
          description: home.description,
          upvotes: home.upvotes,
        };

        const newCard = displayTopPost(cardInfo);

        $('#displayTopPosts').append(newCard);
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

function topStories() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/stories/topten`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const topStory = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          storyid: topStory.storyID,
          title: topStory.title,
          content: topStory.story,
          likes: topStory.storyLike,
          comments: topStory.comments,
        };

        $('#storyTitle').append(`<li style="word-wrap: break-word;"><a href="#">${cardInfo.title}</a></li>`);
        $('#noOfLikes').append(`<li><a href="#">${cardInfo.likes} <i class='bx bxs-heart'></i></a></li>`);
        $('#noOfComments').append(`<li><a href="#">${cardInfo.comments}</a></li>`);
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

$(document).ready(() => {
  loadUserProfilePic();
  noOfUsers();
  noOfPosts();
  noOfStories();
  noOfEvents();
  topPosts();
  topStories();

  // logout button
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});
