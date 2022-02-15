/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// backend url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

const userData = localStorage.getItem('userInfo');
const userid = localStorage.getItem('userid');
const queryParams = new URLSearchParams(window.location.search);
const qnID = queryParams.get('qnsid');
console.log(qnID);
console.log(userid);

// display question results for users
function displayQuestions(info) {
  const card = `
  
      <div class="thumb">
      <div class="price">
        <span>${info.username}</span>
      </div>
      <a href=""><img src="assets/images/single-meeting.jpg" alt=""></a>
    </div>
    <div class="down-content">
      <a href="meeting-details.html"><h4>${info.title}</h4></a>
      <p>${info.description}</p>
      <div style="padding-top: 10px;">
      <div id="message"></div>
      <button type="button" class="btn btn-success" onclick="likeqns(${info.questionid})">${info.upvotes} Like</button>
      <button type="button" class="btn btn-danger" onclick="dislikeqns(${info.questionid})">Dislike</button>
      <button type="button" class="btn btn-primary" onclick="saveQuestion()">Save</button>
      <button type="button" class="btn btn-outline-danger" onclick="document.getElementById('reportPost').style.display = 'flex'"><i class='bx bxs-flag-alt'></i> Report</button>
  </div>
    </div>
     `;
  return card;
}

// display question results for GP
function displayQuestionsGP(info) {
  const card = `
      <div class="thumb">
      <div class="price">
        <span>${info.username}</span>
      </div>
      <a href=""><img src="assets/images/single-meeting.jpg" alt=""></a>
    </div>
    <div class="down-content">
      <a href="meeting-details.html"><h4>${info.title}</h4></a>
      <p>${info.description}</p>
      <div style="padding-top: 10px;">
      <div id="message"></div>
  </div>
    </div>`;
  return card;
}

// display answer results for users
function displayComments(comment) {
  const card = `
    <div class="down-content">
    <img src="assets/images/download.png" class="rounded-circle" alt="profile picture icon" id="profilePicIcon">
    <div style="display: inline-block; padding-left: 10px; padding-top: 5px;">
                <b>Username: ${comment.username}</b><br>
      <a href="meeting-details.html"><h5>${comment.comment}</h5></a>
      <button type="button" class="btn btn-success" onclick="likeans(${comment.commentID})">${comment.upvotes} 
      Like
  </button>
  <button type="button" class="btn btn-danger" onclick="dislikeans(${comment.commentID})">Dislike</button>
      <div style="padding-top: 10px;">
      <div id="message"></div>
  </div>
    </div>
  `;
  return card;
}

// display answer results for GP
function displayCommentsGP(comment) {
  const card = `
      <div class="down-content">
      <img src="assets/images/download.png" class="rounded-circle" alt="profile picture icon" id="profilePicIcon">
      <div style="display: inline-block; padding-left: 10px; padding-top: 5px;">
                  <b>Username: ${comment.username}</b><br>
        <a href="meeting-details.html"><h5>${comment.comment}</h5></a>
        <div style="padding-top: 10px;">
        <div id="message"></div>
    </div>
      </div>`;
  return card;
}
// load a specific question
function loadQuestion() {
  // extract user details from local storage
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const qnID = queryParams.get('qnsid');
  console.log(`qnID: ${qnID}`);
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/qnadetails/${qnID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const question = data[i];

        // compile the data that the card needs for its creation
        const qnaDetails = {
          questionid: qnID,
          title: question.title,
          description: question.description,
          username: question.username,
          credential: question.credential,
          upvotes: question.upvotes,

        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(qnaDetails);

        if (userData != null) {
          const newCard = displayQuestions(qnaDetails);
          $('#qns').append(newCard);
        } else {
          const newCard = displayQuestionsGP(qnaDetails);
          $('#qns').append(newCard);
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

// load the comments of the specific question
function loadComments() {
  // extract user details from local storage
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const qnID = queryParams.get('qnsid');
  console.log(`qnID: ${qnID}`);

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/comments/${qnID}`,
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
            commentID: comments.answerid,
            comment: comments.comment,
            upvotes: comments.upvotes,
            username: comments.username,
            answerid: comments.answerid,
          };

          console.log('--------------Card Info Data Pack--------------');
          console.log(commentDetails);

          if (userData != null) {
            const newCard = displayComments(commentDetails);
            $('#comment').append(newCard);
          } else {
            const newCard = displayCommentsGP(commentDetails);
            $('#comment').append(newCard);
          }
        }
      } else {
        $('#comment').append('<h3>No comment</h3>');
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

// post answers / comments
function postAns() {
  const comment = $('#content').val();
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const qnID = queryParams.get('qnsid');

  console.log(`${qnID}, ${comment}, ${userid}`);

  const data = {
    comment,
  };
  console.log(data);

  // call the web
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qnadetails/${qnID}/${userid}`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');
      console.log(data);
      $('#comment').html('');
      loadComments();
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

// save question
function saveQuestion() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const qnID = queryParams.get('qnsid');

  console.log(`${qnID}, ${userid}`);

  // call the web
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qnadetails/${qnID}/saved/${userid}`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    // data: JSON.stringify(data),
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');

      if (data != null && data.success) {
        $('#message').html('Thank you for the review');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

// report question
function reportPost() {
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const qnID = queryParams.get('qnsid');

  const reportTitle = $('#reportTitle').val();
  const reportDes = $('#reportDes').val();

  const data = {
    questionID: qnID,
    reportUser: userid,
    reportTitle,
    reportDes,
  };

  $('#message').html('');
  // call the web
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qnadetails/report`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(data),
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');

      if (data.rowsAffected === 0) {
        document.getElementById('reportPost').style.display = 'none';
        $('#message').html('<p>You have already made a report on for this post</p>');
      } else {
        document.getElementById('reportPost').style.display = 'none';
        $('#message').html('<p>Thank you for your report</p>');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// like answer / comment
function likeans(clicked_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const data = {
    userid,
    answerid: clicked_id,
  };
  console.log(data);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/likeans`,
    type: 'POST',
    data: JSON.stringify(data),
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
      } else {
        const data = {
          userid,
          answerid: clicked_id,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);
        window.location.reload();
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

// like questions
function likeqns(clicked_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  const data = {
    userid,
    questionid: clicked_id,
  };
  console.log(data);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/likeqns`,
    type: 'POST',
    data: JSON.stringify(data),
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
      } else {
        const data = {
          userid,
          questionid: clicked_id,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);
        window.location.reload();
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

// dislike question
function dislikeqns(dislike_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const userid = localStorage.getItem('userid');
  console.log('Pressed dislike()');
  console.log(dislike_id);
  const data = {
    userid,
    questionid: dislike_id,
  };

  console.log(`DATA: ${JSON.stringify(data)}`);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/dislikeqns`,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data.rowsAffected === 0) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Like first before disliking!',
        }).show();
      } else {
        const data = {
          userid,
          questionid: dislike_id,
        };
        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);

        window.location.reload();
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

// dislike answer
function dislikeans(dislike_id) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const userid = localStorage.getItem('userid');
  console.log('Pressed dislike()');
  console.log(dislike_id);
  const data = {
    userid,
    answerid: dislike_id,
  };

  console.log(`DATA: ${JSON.stringify(data)}`);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/dislikeans`,
    type: 'DELETE',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data.rowsAffected === 0) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Like first before disliking!',
        }).show();
      } else {
        const data = {
          userid,
          answerid: dislike_id,
        };
        console.log('--------------Card Info Data Pack--------------');
        console.log(`Data: ${JSON.stringify(data)}`);
        window.location.reload();
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
  loadQuestion();
  loadComments();

  // add answer when click on add comment
  $('#AddAns').click(() => {
    postAns();
  });

  $('#reporting').click(() => {
    reportPost();
  });

  // log out
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign('/homepage');
  });
});

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#userposts').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#userposts').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
