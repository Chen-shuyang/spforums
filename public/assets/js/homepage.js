/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

// const res = require("express/lib/response");

// backend url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

// Google OAuth

function latestStory(cardInfo) {
  const card = `        
  <div class="col-lg-6">
  <div class="meeting-item">
    <div class="thumb">
      <a href="/storyDetails?storyID=${cardInfo.storyId}"><img src="assets/images/meeting-01.jpg" alt="New Lecturer Meeting"></a>
    </div>
    <div class="down-content">
      <a href="/storyDetails?storyID=${cardInfo.storyId}">
        <h4>Title: ${cardInfo.title} </h4>
      </a>
      <p> " ${cardInfo.description} " </p>
    </div>
  </div>
</div>`;
  return card;
}

// eslint-disable-next-line no-unused-vars
function onSignIn(googleUser) {
  // eslint-disable-next-line no-var
  var idToken = googleUser.getAuthResponse().id_token;

  const data = {
    token: idToken,
  };

  $.ajax({
    url: `${backEndUrl}/oauth/login`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        localStorage.setItem('userid', JSON.stringify(data.userid));
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('userInfo', JSON.stringify(data.username));
        localStorage.setItem('userImage', JSON.stringify(data.picture));
        localStorage.setItem('role', JSON.stringify(data.role));
        signOut();
        window.location.replace(`${frontEndUrl}/profile`);
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

// eslint-disable-next-line no-unused-vars
function onSignUp(googleUser) {
  // eslint-disable-next-line no-var
  var idToken = googleUser.getAuthResponse().id_token;
  const profile = googleUser.getBasicProfile();

  const data = {
    token: idToken,
  };

  $.ajax({
    url: `${backEndUrl}/oauth`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null && data.success) {
        if (profile.getId() != null) {
          signUpWithGoogle(data);
        }
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

// load the top 3 questions
function loadTopQuestions() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/qna`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        const home = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          questionid: home.questionid,
          title: home.title,
          description: home.description,
          upvotes: home.upvotes,
          username: home.username,
          credential: home.credential,
        };

        $(`.header${i}`).append(cardInfo.title);
        $(`.poster${i}`).append(cardInfo.username);
        $(`.description${i}`).append(cardInfo.description);
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
// load the top 3 questions
function loadTopStory() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/latestStory`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        const homeStory = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          storyId: homeStory.storyId,
          title: homeStory.title,
          description: homeStory.description,
        };
        const newCard = latestStory(cardInfo);
        $('#latestStory').append(newCard);
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

// load the top 3 events
// eslint-disable-next-line no-unused-vars
function loadTopEvents() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/event`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        const home = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          eventid: home.eventid,
          eventTitle: home.eventTitle,
          eventDescription: home.eventDescription,
          createdBy: home.createdBy,
          maxCapacity: home.maxCapacity,
        };

        $(`.header${i}`).append(cardInfo.eventTitle);
        $(`.poster${i}`).append(cardInfo.createdBy);
        $(`.description${i}`).append(cardInfo.eventDescription);
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

function registerAccount(password) {
  const username = $('#usernameRegisterInput').val();
  const email = $('#emailInput').val();
  const school = $('#schoolList').val();

  const data = {
    username,
    email,
    pwd: password,
    school,
  };

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/register`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      Email.send({
        Host: 'smtp.gmail.com',
        Username: 'spforumsofficial@gmail.com',
        Password: 'qxyosyqkzpijcydj',
        To: `${data.Data.email}`,
        From: 'spforumsofficial@gmail.com',
        Subject: 'Report Results',
        Body: `<h3>Name: ${data.Data.username} </h3> 
                  <h3>Email: ${data.Data.email} </h3> 
              
                  <h3>Secret token: ${data.Data.secret} </h3>
                  <h3>Please download chrome autheticator </h3>
                  `,
      });
      if (data !== null && data.success) {
        document.getElementById('loginBtn').click();
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
      if (xhr.responseJSON.error.includes('ER_DUP_ENTRY: Duplicate entry')) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Sorry, Username has been taken',
        }).show();
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Sorry something went wrong! Please approach admin for help!',
        }).show();
      }
    },
  });
}

function registerAccountWithGoogle() {
  const username = $('#usernameRegisterInput').val();
  const emailInput = $('#emailInput').val();
  const googleid = $('#googleID').val();
  const school = $('#schoolList').val();

  const data = {
    googleID: googleid,
    email: emailInput,
    username,
    school,
  };

  console.log(JSON.stringify(data));

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/oauth/register`,
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      if (data != null && data.success) {
        document.getElementById('loginBtn').click();
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

      console.log(xhr.status);
      console.log(xhr.responseText);
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
      for (let i = 0; i < data.length; i++) {
        const category = data[i];

        // compile the data that the card needs for its creation
        const details = {
          catid: category.categoryid,
          catname: category.cat_name,
          fullname: category.full_name,
        };

        const school = listSchool(details);

        $('#schoolList').append(school);
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

function listSchool(school) {
  const list = `<option value="${school.catname}"> ${school.fullname} (${school.catname})`;
  return list;
}

function signUpWithGoogle(data) {
  $('#registerPwdInput').attr('hidden', 'hidden');
  $('#confirmPwdInput').attr('hidden', 'hidden');
  $('#registerPwdInput').attr('disabled', 'disabled');
  $('#confirmPwdInput').attr('disabled', 'disabled');
  $('#registerPwdLabel').attr('hidden', 'hidden');
  $('#confirmPwdLabel').attr('hidden', 'hidden');
  const registerModal = document.getElementById('registerModal');
  registerModal.style.height = '470px';
  $('#usernameRegisterInput').val(data.username);
  $('#emailInput').val(data.email);
  $('#googleID').val(data.googleid);
}

// sign out
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    console.log('User signed out.');
  });
}

$(document).ready(() => {
  loadTopQuestions();
  loadCategory();
  loadTopStory();
  // Login
  $('#login').click(() => {
    const googleresponse = grecaptcha.getResponse();
    if (googleresponse.length === 0) {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please verify ur not a robot',
      }).show();
    } else {
      // data extraction
      const id = $('#usernameInput').val();
      const pwd = $('#pwdInput').val();
      const sec = $('#secInput').val();

      // data compilation
      const info = {
        username: id,
        password: pwd,
        secrets: sec,
      };

      // call web service endpoint
      $.ajax({
        url: `${backEndUrl}/login`,
        type: 'POST',
        data: JSON.stringify(info),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success(data) {
          if (data != null) {
            localStorage.setItem('userid', JSON.stringify(data.userid));
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('userInfo', JSON.stringify(data.username));
            localStorage.setItem('role', JSON.stringify(data.role));
            window.location.replace(`${frontEndUrl}/profile`);
          } else {
            console.log('Error');
          }
        },
        error(xhr, textStatus, errorThrown) {
          console.log('Error in Operation');
          console.log(`XHR: ${JSON.stringify(xhr)}`);
          console.log(`Textstatus: ${textStatus}`);
          console.log(`Errorthorwn${errorThrown}`);
          new Noty({
            timeout: '5000',
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Please check your Username and Password',
          }).show();
        },
      });
    }
    return false;
  });

  // Register
  $('#register').click(() => {
    let registeredPwd = $('#confirmPwdInput').is(':disabled');
    let confirmationPwd = $('#confirmPwdInput').is(':disabled');
    const username = $('#usernameRegisterInput').val();
    const email = $('#emailInput').val();
    const school = $('#schoolList').val();

    if (registeredPwd && confirmationPwd) {
      // google signup
      registerAccountWithGoogle();
    } else if (username === '' || email === '' || school === ''
      || registeredPwd === '' || confirmationPwd === '') {
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please do not leave anything blank!',
      }).show();
    } else {
      // regular signup
      registeredPwd = $('#registerPwdInput').val();
      confirmationPwd = $('#confirmPwdInput').val();

      if (registeredPwd === confirmationPwd) {
        console.log('pwd same');
        registerAccount(confirmationPwd);
      } else {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please confirm that your password is the same',
        }).show();
      }
    }
    return false;
  });

  // Change to regular signup
  $('#regularSignUpBtn').click(() => {
    $('#registerPwdInput').removeAttr('hidden disabled');
    $('#confirmPwdInput').removeAttr('hidden disabled');
    $('#registerPwdLabel').removeAttr('hidden');
    $('#confirmPwdLabel').removeAttr('hidden');
    const registerModal = document.getElementById('registerModal');
    registerModal.style.height = '600px';
  });

  // logout
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/login`);
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
