/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

// URL
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';
function loadUserProfilePic() {
  const pic = JSON.parse(localStorage.getItem('userImage'));
  if (pic == null) {
    document.getElementById('profilePic').src = 'assets/images/spforumLogo.png';
  } else {
    document.getElementById('profilePic').src = pic;
  }
}

// load question card
function createCard(cardInfo) {
  const card = `
    <div class="row border questions" style="margin-inline: 10%; margin-bottom: 10px">
      <div class="col-md-5 mr-auto">
        <h1>${cardInfo.title}</h1>
          <p style="width: 200%">${cardInfo.description}</p>
      </div>
      <button type="button" class="btn btn-primary" 
          onclick="document.getElementById('modalPosts').style.display = 'flex';
          loadQnDetails(${cardInfo.qnID});">
        <h3>Make Edits</h3>
      </button>
    </div>
  `;

  return card;
}

function createBlockedCard(cardInfo) {
  const card = `
    <div class="row border questions" 
      style="margin-inline: 10%; 
              margin-bottom: 10px;
              background-color: #A9A9A9;
              z-index: 2;">
      <div class="col-md-5 mr-auto">
        <h1>${cardInfo.title}</h1>
          <p style="width: 200%">${cardInfo.description}</p>
      </div>
      <button type="button" class="btn btn-primary" disabled>
        <h3>Blocked</h3>
      </button>
    </div>
  `;

  return card;
}

// load question card
function createStoryCard(cardInfo) {
  const card = `
    <div class="row border questions" style="margin-inline: 10%; margin-bottom: 10px">
      <div class="col-md-5 mr-auto">
        <h1>${cardInfo.title}</h1>
          <p style="width: 200%">${cardInfo.description}</p>
      </div>
      <button type="button" class="btn btn-primary" 
          onclick="window.location.replace('https://spforum.herokuapp.com/updateStory?storyID=${cardInfo.storyID}')">
            <h3>Make Edits</h3>
      </button>
    </div>
  `;

  return card;
}

// load liked question card
function createLikedQnCard(cardInfo) {
  const card = `
    <div class="row border questions" style="margin-inline: 10%; margin-bottom: 10px">
      <div class="col-md-5 mr-auto">
        <h1>${cardInfo.title}</h1>
        <p style="width: 200%">${cardInfo.description}</p>
      </div>
      <button type="button" class="btn btn-primary" onclick="dislikeqns(${cardInfo.questionid})">
        <h3>Unlike Post</h3>
      </button>
    </div>
  `;

  return card;
}

// load liked question card
function createLikedAnsCard(cardInfo) {
  const card = `
    <div class="row border questions" style="margin-inline: 10%; margin-bottom: 10px">
      <div class="col-md-5 mr-auto">
        <h3>Question: ${cardInfo.title}</h3>
        <p style="width: 200%">Comment: ${cardInfo.answer}</p>
        <p>User: ${cardInfo.username}</p>
      </div>
      <button type="button" class="btn btn-primary" onclick="dislikeans(${cardInfo.answerid})">
        <h3>Unlike Comment</h3>
      </button>
    </div>
  `;

  return card;
}

// load saved question card
function createSavedQnCard(cardInfo) {
  const card = `
    <div class="row border questions" style="margin-inline: 10%; margin-bottom: 10px">
      <div class="col-md-5 mr-auto">
        <h1>${cardInfo.title}</h1>
        <p style="width: 200%">${cardInfo.description}</p>
      </div>
      <button type="button" class="btn btn-primary" onclick="unsaveQn(${cardInfo.saveId})">
        <h3>Unsave Post</h3>
      </button>
    </div>
  `;

  return card;
}

function displaySchool(qnDetails) {
  const card = `
            <label>School</label><p id="schoolDetails" value="${qnDetails.catid}">${qnDetails.fullname} (${qnDetails.catname})</p>
        `;
  return card;
}

function listSchool(school) {
  const list = `<option value="${school.catid}"> ${school.fullname} (${school.catname})`;
  return list;
}

function loadUserProfile() {
  // extract user details from local storage
  const userData = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  let userInfo;

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/user/${userData}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const user = data[i];

        // compile the data that the card needs for its creation
        userInfo = {
          username: user.username,
          school: user.school,
          email: user.email,
          credential: user.credential,
          description: user.description,
          Joined_date: user.created_at,
        };
      }

      // display information
      $('#username').append(userInfo.username);
      $('#shortCredential').append(userInfo.credential);
      $('#description').append(userInfo.description);
      $('#school').append(userInfo.school);
      $('#joinDate').append(userInfo.Joined_date);

      // display information
      $('#usernameInput').val(userInfo.username);
      $('#credentialInput').val(userInfo.credential);
      $('#descriptionInput').val(userInfo.description);
      $('#schoolInput').val(userInfo.school);
      $('#emailInput').val(userInfo.email);
    },
    // error handling
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
}

// load all saved question
function loadAllSavedQn() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/usersavedqn/${userid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#save').html('');
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const saved = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            questionid: saved.questionid,
            saveId: saved.saveId,
            title: saved.title,
            description: saved.description,
            upvotes: saved.upvotes,
            username: saved.username,
            credential: saved.credential,
          };

          const newCard = createSavedQnCard(cardInfo);
          $('#save').append(newCard);
        }
      } else {
        $('#save').html("<h3 class='text-center'>You don't have any saved questions</h3>");
      }
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
}

// eslint-disable-next-line no-unused-vars
function loadQnDetails(qnID) {
  let details;

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
        const qnDetails = data[i];

        // compile the data that the card needs for its creation
        details = {
          title: qnDetails.title,
          description: qnDetails.description,
          catid: qnDetails.categoryid,
          catname: qnDetails.cat_name,
          fullname: qnDetails.full_name,
          questionID: qnID,
        };
      }

      $('#schoolCat').html('');
      const newCard = displaySchool(details);
      $('#QnDesInput').val(details.description);
      $('#questionInput').val(details.title);
      $('#schoolCat').append(newCard);
      $('#questionID').val(details.questionID);
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

// Load All Qns
function loadAllLikedQn() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userlikeqn/${userid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#favorite').html('');
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const myInterest = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            title: myInterest.title,
            description: myInterest.description,
            upvotes: myInterest.upvotes,
            username: myInterest.username,
            credential: myInterest.credential,
            questionid: myInterest.questionid,
          };

          // create new card
          const newCard = createLikedQnCard(cardInfo);

          // display
          $('#favorite').append(newCard);
        }
      } else {
        $('#favorite').html("<h3 class='text-center'>No questions Liked</h3>");
      }
    },
    // Authorisation Check
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
}

// Display all like Ans
function loadAllLikedAns() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userlikeans/${userid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#favorite').html('');
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const myInterest = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            title: myInterest.title,
            answer: myInterest.comment,
            likes: myInterest.likes,
            username: myInterest.username,
            credential: myInterest.credential,
            answerid: myInterest.answerid,
          };
          // create card
          const newCard = createLikedAnsCard(cardInfo);
          // display card
          $('#favorite').append(newCard);
        }
      } else {
        $('#favorite').html("<h3 class='text-center'>No Answers Liked</h3>");
      }
    },
    // authorisation check
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
}

function loadCategory() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/school`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const category = data[i];

        // compile the data that the card needs for its creation
        const details = {
          catid: category.categoryid,
          catname: category.cat_name,
          fullname: category.full_name,
        };
        const school = listSchool(details);

        $('#categoryInput').append(school);
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

function updateProfile() {
  // data extraction
  const tmpUName = $('#usernameInput').val();
  const tmpCredential = $('#credentialInput').val();
  const tmpDes = $('#descriptionInput').val();
  const tmpSch = $('#schoolInput').val();
  const tmpEmail = $('#emailInput').val();
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // get item from local storage
  const data = {
    username: tmpUName,
    credential: tmpCredential,
    description: tmpDes,
    school: tmpSch,
    email: tmpEmail,
  };
  console.log(`DATA: ${data}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/users/${userid}`,
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
          text: 'Record updated successfully!',
        }).show();
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

// unsaved question
// eslint-disable-next-line no-unused-vars
function unsaveQn(saveID) {
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  console.log(tmpToken);
  const tmpUserId = localStorage.getItem('userid');

  console.log(`saveID: ${saveID}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/unsave/${tmpUserId}/${saveID}`,
    type: 'DELETE',
    // data: data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Question unsaved',
        }).show();
        loadAllSavedQn();
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
}

// Dislike Function
// eslint-disable-next-line no-unused-vars
function dislikeqns(dislikeId) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const userid = localStorage.getItem('userid');
  const data = {
    userid,
    questionid: dislikeId,
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
      console.log('--------------Card Info Data Pack--------------');
      console.log(`Data: ${JSON.stringify(data)}`);
      loadAllLikedQn();
    },

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
}

// Dislike Answer
// eslint-disable-next-line no-unused-vars
function dislikeans(dislikeId) {
  // call the web service endpoint
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const userid = localStorage.getItem('userid');
  console.log('Pressed dislike()');
  console.log(dislike_id);
  const data = {
    userid,
    answerid: dislikeId,
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
      console.log('--------------Card Info Data Pack--------------');
      console.log(`Data: ${JSON.stringify(data)}`);
      loadAllLikedAns();
    },

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
}

// update question
function updateQnDetails(tmpCat) {
  // data extraction
  const tmpTitle = $('#questionInput').val();
  const tmpDes = $('#QnDesInput').val();
  const qnID = $('#questionID').val();

  console.log(`Catid: ${tmpCat}`);
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const userid = localStorage.getItem('userid');
  console.log(`userid: ${userid}`);

  const data = {
    title: tmpTitle,
    des: tmpDes,
    catid: tmpCat,
    userid,
  };
  console.log(`DATA: ${data}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/qna/${qnID}`,
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
          text: 'Record update successfully',
        }).show();
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
}

// load all user Qns
function loadAllUserQn() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userquestions/${userid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            qnID: question.questionid,
            title: question.title,
            description: question.description,
            upvotes: question.upvotes,
            status: question.status,
          };

          if (cardInfo.status === 'Blocked') {
            const newCard = createBlockedCard(cardInfo);
            $('#questions').append(newCard);
          } else {
            const newCard = createCard(cardInfo);
            $('#questions').append(newCard);
          }
        }
      } else {
        $('#questions').html("<h3 class='text-center'>No questions Posted</h3>");
      }
    },

    // error handling
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
}

// load all user stories
function loadAllUserStories() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userstory/${userid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const story = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            storyID: story.storyId,
            title: story.title,
            description: story.description,
          };

          const newCard = createStoryCard(cardInfo);
          $('#stories').append(newCard);
        }
      } else {
        $('#stories').html("<h3 class='text-center'>No Stories Posted</h3>");
      }
    },

    // error handling
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
}

// delete user question
function deleteUserQn() {
  const tmpToken = JSON.parse(localStorage.getItem('token'));
  const tmpUserid = localStorage.getItem('userid');
  const qnId = $('#questionID').val();
  console.log(`questionid: ${qnId}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/questions/${tmpUserid}/${qnId}`,
    type: 'DELETE',
    // data: data,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        new Noty({
          timeout: '5000',
          type: 'info/information',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Question successfully deleted',
        }).show();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
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
}

// sorting by upvote
// eslint-disable-next-line no-unused-vars
function sortByUpvote() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  jQuery('#questions').empty();
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userquestions/${userid}/sortbyupvote`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const question = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          qnID: question.questionid,
          title: question.title,
          description: question.description,
          upvotes: question.upvotes,
          status: question.status,
        };

        if (cardInfo.status === 'Blocked') {
          const newCard = createBlockedCard(cardInfo);
          $('#questions').append(newCard);
        } else {
          const newCard = createCard(cardInfo);
          $('#questions').append(newCard);
        }
      }
    },

    // error handling
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
}

// sort by recent
// eslint-disable-next-line no-unused-vars
function sortByRecent() {
  const userid = localStorage.getItem('userid');
  const tmpToken = JSON.parse(localStorage.getItem('token'));

  jQuery('#questions').empty();
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/userquestions/${userid}/sortbyrecent`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const question = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          qnID: question.questionid,
          title: question.title,
          description: question.description,
          upvotes: question.upvotes,
          status: question.status,
        };

        if (cardInfo.status === 'Blocked') {
          const newCard = createBlockedCard(cardInfo);
          $('#questions').append(newCard);
        } else {
          const newCard = createCard(cardInfo);
          $('#questions').append(newCard);
        }
      }
    },
    // error handling
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
}

$(document).ready(() => {
  loadUserProfilePic();
  loadUserProfile();
  loadAllUserStories();
  loadAllUserQn();
  loadAllSavedQn();
  loadAllLikedQn();
  loadCategory();

  // update button
  $('#updateQuestion').click(() => {
    let categoryid = $('#categoryInput').val();
    console.log(`categoryid1: ${categoryid}`);

    if (categoryid === 0) {
      categoryid = $('#schoolDetails').attr('value');
      console.log(`categoryid2: ${categoryid}`);
      updateQnDetails(categoryid);
    } else {
      console.log('update with new cat');
      updateQnDetails(categoryid);
    }
  });

  // update button
  $('#updateProfile').click(() => {
    updateProfile();
  });

  // delete button
  $('#deleteQuestion').click(() => {
    deleteUserQn();
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

const userRole = localStorage.getItem('role');

if (userRole !== '"Admin"') {
  $('#toAdminPanels').attr({ hidden: 'true', disabled: 'true' });
} else {
  $('#toAdminPanels').removeAttr('hidden disabled');
}
