/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// URL
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';
const userData = localStorage.getItem('userInfo');

function displayStoryUser(cardInfo) {
  const card = `
<div class="thumb">
  <div class="date">
    <h6>${cardInfo.Date}</h6>
  </div>
  <a href=""><img src="assets/images/single-meeting.jpg" alt=""></a>
</div>
<div class="down-content">
  <a href="meeting-details.html"><h4>O${cardInfo.title}</h4></a>
  <p>${cardInfo.description}</p>
  <p class="description" id='stories'>
  ${cardInfo.story}
  </p>

Select Voice: <select id='voiceList'></select> <br><br>

<input id='storyInput' value= '${cardInfo.story}'  type='hidden' disabled/> <br><br>    
<button id='btnSpeak'>Speak!</button>
</div>
 
<script>
var storyInput = document.querySelector('#storyInput');
var voiceList = document.querySelector('#voiceList');
var btnSpeak = document.querySelector('#btnSpeak');
var synth = window.speechSynthesis;
var voices = [];

PopulateVoices();
if(speechSynthesis !== undefined){
    speechSynthesis.onvoiceschanged = PopulateVoices;
}

btnSpeak.addEventListener('click', ()=> {
    var toSpeak = new SpeechSynthesisUtterance(storyInput.value);
    var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
    voices.forEach((voice)=>{
        if(voice.name === selectedVoiceName){
            toSpeak.voice = voice;
        }
    });
    synth.speak(toSpeak);
});

function PopulateVoices(){
    voices = synth.getVoices();
    var selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
    voiceList.innerHTML = '';
    voices.forEach((voice)=>{
        var listItem = document.createElement('option');
        listItem.textContent = voice.name;
        listItem.setAttribute('data-lang', voice.lang);
        listItem.setAttribute('data-name', voice.name);
        voiceList.appendChild(listItem);
    });

    voiceList.selectedIndex = selectedIndex;
}
</script>

`;
  return card;
}
function displayStoryGP(cardInfo) {
  const card = `

  <div class="thumb">
  <div class="date">
    <h6>${cardInfo.Date}</h6>
  </div>
  <a href=""><img src="assets/images/single-meeting.jpg" alt=""></a>
</div>
<div class="down-content">
  <a href="meeting-details.html"><h4>O${cardInfo.title}</h4></a>
  <p>${cardInfo.description}</p>
  <p class="description" id='stories'>
  ${cardInfo.story}
  </p>
Select Voice: <select id='voiceList'></select> <br><br>
<button id='btnSpeak'>Speak!</button><input id='storyInput' value= '${cardInfo.story}'  type='hidden' disabled/> <br><br>    
</div>
 
<script>
var storyInput = document.querySelector('#storyInput');
var voiceList = document.querySelector('#voiceList');
var btnSpeak = document.querySelector('#btnSpeak');
var synth = window.speechSynthesis;
var voices = [];

PopulateVoices();
if(speechSynthesis !== undefined){
    speechSynthesis.onvoiceschanged = PopulateVoices;
}

btnSpeak.addEventListener('click', ()=> {
    var toSpeak = new SpeechSynthesisUtterance(storyInput.value);
    var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
    voices.forEach((voice)=>{
        if(voice.name === selectedVoiceName){
            toSpeak.voice = voice;
        }
    });
    synth.speak(toSpeak);
});

function PopulateVoices(){
    voices = synth.getVoices();
    var selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
    voiceList.innerHTML = '';
    voices.forEach((voice)=>{
        var listItem = document.createElement('option');
        listItem.textContent = voice.name;
        listItem.setAttribute('data-lang', voice.lang);
        listItem.setAttribute('data-name', voice.name);
        voiceList.appendChild(listItem);
    });

    voiceList.selectedIndex = selectedIndex;
}
</script>


`;
  return card;
}
function displayCommentUser(cardInfo) {
  const card = `

<div class="down-content">
  <div class="row">
  <h3>Username: ${cardInfo.username}</h3>
    <div class="col-lg-12">
      <div class="share">
        <h5>${cardInfo.comment}</h5>
      </div>
    </div>
  </div>
</div>
 
`;
  return card;
}

function createLoadStoryCard(cardInfo) {
  const card = `
    <div class="col-lg-4 templatemo-item-col all">
    <div class="meeting-item">
      <div class="thumb">
        <a href="/storyDetails?storyID=${cardInfo.storyID}"><img src="assets/images/meeting-01.jpg" alt=""></a>
      </div>
      <div class="down-content">
        <div class="date">
          <h6>${cardInfo.Date}</h6>
        </div>
        <a href="/storyDetails?storyID=${cardInfo.storyID}"><h4>Tittle: ${cardInfo.title}</h4></a>
        <p>Description: ${cardInfo.description}</p>
      </div>
    </div>
  </div>

              `;

  return card;
}

// load the story
function loadStory() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/story`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const story = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          storyID: story.storyId,
          title: story.title,
          description: story.description,
          story: story.story,
          Date: story.date,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(cardInfo);

        const newCard = createLoadStoryCard(cardInfo);

        $('#story').append(newCard);
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

function loadStoryComments() {
  // extract user details from local storage
  const queryParams = new URLSearchParams(window.location.search);
  const storyID = queryParams.get('storyID');
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/storyComments/${storyID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const comments = data[i];

          // compile the data that the card needs for its creation
          const commentDetails = {
            commentID: comments.commentID,
            comment: comments.comment,
            username: comments.username,

          };
          console.log(' --------------Card Info Data Pack--------------');
          console.log(commentDetails);

          if (userData != null) {
            const newCard = displayCommentUser(commentDetails);
            $('#storyComment').append(newCard);
          } else {
            const newCard = displayCommentUser(commentDetails);
            $('#storyComment').append(newCard);
          }
        }
      } else {
        $('#storyComment').append('<h3 style="color: white;">No comment</h3>');
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
function postAns() {
  const comment = $('#storiesComment').val();
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  console.log(comment);
  console.log(userid);
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const storyID = queryParams.get('storyID');

  console.log(`${storyID}, ${comment}, ${userid}`);

  const data = {
    comment,
  };
  console.log(data);

  // call the web
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/story/${storyID}/${userid}`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');

      if (data != null && data.success) {
        $('#message').html('Thank you for the review');

        for (let i = 0; i < data.length; i++) {
          const comment = data[i];
          const commentDetails = {
            userId: comment.userID,
            storyID: comment.storyID,
            comment: comment.comment,

          };
          // localStorage.setItem('Game', game.gameData);
          console.log('-------- Card Info data pack --------');
          console.log(reviewInfo);
          new Noty({
            timeout: '5000',
            type: 'info/information',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Thank you for the review',
          }).show();

          const newCard = displayCommentUser(commentDetails);
          $('#storyComment').append(newCard);
        }
      }
    },
    error(xhr, textStatus, errorThrown) {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'error',
      }).show();
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function postStory() {
  // get token
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  // data extraction
  const title = $('#title').val();
  const description = $('#description').val();
  const story = $('#story').val();
  const userId = localStorage.getItem('userid');
  console.log(tmpToken);
  const data = {
    title,
    description,
    userId,
    story,
  };
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/addStory`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data);

      new Noty({
        timeout: '5000',
        type: 'info/information',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Thank you for the story',
      }).show();

      window.location.assign(`${frontEndUrl}/story`);
    },
    // errorhandling
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      if (xhr.status === 401) {
        window.localStorage.clear();
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please log into your own account!',
        }).show();
        window.location.href = `${frontEndUrl}`;
      }
      if (xhr.status === 403) {
        window.localStorage.clear();
        window.location.href = `${frontEndUrl}/error`;
      }
    },
  });
  window.location.reload();
  return false;
}
function loadStoryByID() {
  // extract user details from local storage
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
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
          Date: story.date,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(storyDetails);

        if (userData != null) {
          const newCard = displayStoryUser(storyDetails);
          $('#storydetails').append(newCard);
        } else {
          const newCard = displayStoryGP(storyDetails);
          $('#storydetails').append(newCard);
        }
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
  loadStory();
  loadStoryByID();
  loadStoryComments();

  // add a question when add button is triggered
  $('#add').click(() => {
    postStory();
  });

  // logout button
  $('#logoutBtn').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/homepage`);
  });
});

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addcommentbtn').removeAttr('hidden disabled');
  $('#inputCommnt').removeAttr('hidden disabled');
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#inputCommnt').attr({ hidden: 'true', disabled: 'true' });
  $('#addcommentbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
