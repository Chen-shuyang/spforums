/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// URL
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';
const token = localStorage.getItem('token');
const tmpToken = token.replaceAll('"', '');

// eslint-disable-next-line no-unused-vars
function loadStoryDetails() {
  // extract user details from local storage
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const storyID = queryParams.get('storyID');

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/story/${storyID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const story = data[i];

        // compile the data that the card needs for its creation
        const storyDetails = {
          storyID: story.storyId,
          title: story.title,
          description: story.description,
          story: story.story,
          Date: story.created_at,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(storyDetails);

        $('#storyTitle').val(storyDetails.title);
        $('#StoryDesInput').val(storyDetails.description);
        $('#storyInput').val(storyDetails.story);
        $('#storyId').val(storyDetails.storyID);
      }
    },
    // errorhandling
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

function updateStory() {
  // data extraction
  const tmpStoryTitle = $('#storyTitle').val();
  const tmpStoryDes = $('#StoryDesInput').val();
  const tmpStoryContent = $('#storyInput').val();
  const tmpStoryId = $('#storyId').val();
  const tmpUserId = localStorage.getItem('userid');

  // get item from local storage
  const data = {
    title: tmpStoryTitle,
    description: tmpStoryDes,
    story: tmpStoryContent,
    userId: tmpUserId,
  };

  $('#msg').html('');

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/story/${tmpStoryId}`,
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
          text: 'Successfully Updated Story',
        }).show();
      } else {
        console.log('Error');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function deleteStory() {
  const tmpStoryId = $('#storyId').val();
  const tmpUserId = localStorage.getItem('userid');

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userstory/${tmpStoryId}/${tmpUserId}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        window.location.replace(`${frontEndUrl}/profile`);
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Succesfully deleted',
        }).show();
      } else {
        console.log('Error');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

$(document).ready(() => {
  loadStoryDetails();

  $('#update').click(() => {
    updateStory();
  });

  $('#delete').click(() => {
    deleteStory();
  });

  // logout button
  $('#logoutBtn').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});
const userData = localStorage.getItem('userInfo');

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
