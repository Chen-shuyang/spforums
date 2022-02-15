/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

let postSearchChar = [];
const postSearch = document.getElementById('qnaSearch');

// display question within the school
function displayQuestions(schoolQns) {
  const card = `
    <div class="col-lg-4 templatemo-item-col all">
        <div class="meeting-item">
            <div class="thumb">
            <div class="price">
         <button type="button" class="btn btn-success" onclick="likeqns(${schoolQns.questionid})">${schoolQns.questionUpvotes} 
          Like
            </button>
           <button type="button" class="btn btn-danger" onclick="dislikeqns(${schoolQns.questionid})">Dislike</button>
    
            </div>
        <p id="questionID" hidden>${schoolQns.questionid}</p>
        <a href="qnaDetails?qnsid=${schoolQns.questionid}"><img src="assets/images/meeting-01.jpg" alt=""></a>
         </div>
      <div class="down-content">
        <div class="date">
          <h6>${schoolQns.questionUsername}</h6>
        </div>
        <a href="qnaDetails?qnsid=${schoolQns.questionid}"><h4>${schoolQns.questionTitle}</h4></a>
        <p>${schoolQns.questionDescription}</p>
      </div>
    </div>
  </div>

`;
  return card;
}

// display question within the school for General Public
function displayQuestionsGP(schoolQns) {
  const card = `
  <div class="col-lg-4 templatemo-item-col all">
  <div class="meeting-item">
      <div class="thumb">
  <p id="questionID" hidden>${schoolQns.questionid}</p>
  <a href="qnaDetails?qnsid=${schoolQns.questionid}"><img src="assets/images/meeting-01.jpg" alt=""></a>
   </div>
<div class="down-content">
  <div class="date">
    <h6>${schoolQns.questionUsername}</h6>
  </div>
  <a href="qnaDetails?qnsid=${schoolQns.questionid}"><h4>${schoolQns.questionTitle}</h4></a>
  <p>${schoolQns.questionDescription}</p>
</div>
</div>
</div>`;
  return card;
}

// loads all the questions within a specific school
function loadAllQuestion() {
  // extract user details from local storage
  const userData = localStorage.getItem('userInfo');
  console.log(userData);
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const catid = queryParams.get('catid');
  jQuery('#qns').empty();

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/qna/${catid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      postSearchChar = data;
      console.log(postSearchChar);

      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          const schoolQns = data[i];

          // compile the data that the card needs for its creation
          const schoolQnsCpl = {
            questionid: schoolQns.questionid,
            questionTitle: schoolQns.title,
            questionDescription: schoolQns.description,
            userid: schoolQns.userid,
            questionUpvotes: schoolQns.upvotes,
            questionDownvotes: schoolQns.downvotes,
            questionUsername: schoolQns.username,
            userCredential: schoolQns.credential,
            status: schoolQns.status,
          };

          if (schoolQnsCpl.status !== 'Blocked') {
            if (userData != null) {
              const newCard = displayQuestions(schoolQnsCpl);
              $('#qns').append(newCard);
            } else {
              const newCard = displayQuestionsGP(schoolQnsCpl);
              $('#qns').append(newCard);
            }
          }
        }
      } else {
        $('#qns').append('<h3>No Question</h3>');
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

// loads all the questions within a specific school and sort by upvotes
// eslint-disable-next-line no-unused-vars
function loadAllQuestionByUpvotes() {
  // extract user details from local storage
  const userData = localStorage.getItem('userInfo');
  console.log(userData);
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------------Query Params ----------------');
  console.log(`QUery Param(source): ${window.location.search}`);
  console.log(`Query parrams(extracted): ${queryParams}`);
  const catid = queryParams.get('catid');
  jQuery('#qns').empty();

  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/qna/sortbyupvotes/${catid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const schoolQns = data[i];

        // compile the data that the card needs for its creation
        const schoolQnsCompile = {
          questionid: schoolQns.questionid,
          questionTitle: schoolQns.title,
          questionDescription: schoolQns.description,
          userid: schoolQns.userid,
          questionUpvotes: schoolQns.upvotes,
          questionDownvotes: schoolQns.downvotes,
          questionUsername: schoolQns.username,
          userCredential: schoolQns.credential,
        };

        console.log('--------------Card Info Data Pack--------------');
        console.log(schoolQns);

        if (userData != null) {
          const newCard = displayQuestions(schoolQnsCompile);
          $('#qns').append(newCard);
        } else {
          const newCard = displayQuestionsGP(schoolQnsCompile);
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

// load school category
function loadCurrentSchool() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/school/${catid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);

      const currentSchool = data[0];

      // compile the data that the card needs for its creation
      const currentSchoolCompile = {
        full_name: currentSchool.full_name,
      };

      $('#QNA_Title').html(`QNA - ${currentSchoolCompile.full_name}`);
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

// like a question
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
      console.log(data.rowsAffected);

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

// dislike a question
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
      console.log(data.rowsAffected);
      if (data.rowsAffected === 0) {
        console.log(data);
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Like the post first before disliking',
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

postSearch.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  // eslint-disable-next-line arrow-body-style
  const filterQns = postSearchChar.filter((qna) => {
    return (
      qna.description.toLowerCase().includes(searchString)
    );
  });

  $('#qns').html('');
  $('#similarSearch').html('');
  if (filterQns.length !== 0) {
    for (let i = 0; i < filterQns.length; i++) {
      const schoolQns = filterQns[i];

      // compile the data that the card needs for its creation
      const schoolQnsCompile = {
        questionid: schoolQns.questionid,
        questionTitle: schoolQns.title,
        questionDescription: schoolQns.description,
        userid: schoolQns.userid,
        questionUpvotes: schoolQns.upvotes,
        questionDownvotes: schoolQns.downvotes,
        questionUsername: schoolQns.username,
        userCredential: schoolQns.credential,
      };

      const userData = localStorage.getItem('user');
      if (userData != null) {
        const newCard = displayQuestions(schoolQnsCompile);
        $('#qns').append(newCard);
      } else {
        const newCard = displayQuestionsGP(schoolQnsCompile);
        $('#qns').append(newCard);
      }
    }
  } else {
    $('#similarSearch').html('<h3>Nothing Found</h3>');
  }
});

const userid = localStorage.getItem('userid');
const queryParams = new URLSearchParams(window.location.search);
const catid = queryParams.get('catid');
$(document).ready(() => {
  // checks for query in the address bar
  if (queryParams.has('catid') && queryParams.has('search_questiontitle')) {
    const questionTitle = queryParams.get('search_questiontitle');

    getQuestionBySearch(questionTitle);
    loadCurrentSchool();
  } else {
    loadAllQuestion();
    loadCurrentSchool();
  }

  // add a question when add button is triggered
  $('#add').click(() => {
    // get token
    const tmpToken = JSON.parse(localStorage.getItem('token'));
    // data extraction
    const title = $('#title').val();
    const description = $('#description').val();
    const userid = localStorage.getItem('userid');
    const categoryid = queryParams.get('catid');

    const data = {
      title,
      description,
      userid,
      categoryid,
    };
    console.log(`Data: ${JSON.stringify(data)}`);
    // call the web service endpoint
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/qna`,
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data, textStatus) {
        console.log(`Data Success ${textStatus}`);
        if (data != null && textStatus.toString() === 'success') {
          $('#msg').html(`<i>'${title}' has been added successfully!</i>`);

          window.location.assign(`${frontEndUrl}/qna?catid=${categoryid}`);
        } else {
          console.log('Error');
          window.location.assign(`${frontEndUrl}/qna?catid=${categoryid}`);
        }
      },
      error() {
        console.log('Error in Operation');
        window.location.assign(`${frontEndUrl}/qna?catid=${categoryid}`);
      },
    });
    return false;
  });

  // search for question when search button is triggered
  $('#Search').click(() => {
    console.log('Search button is clicked');
    const queryParams = new URLSearchParams(window.location.search);
    const catid = queryParams.get('catid');
    // data extraction
    const searchQuestionTitle = $('#questionTitle').val();
    console.log(`Search questionTitle: ${searchQuestionTitle}`);
    console.log(`Search categoryid: ${catid}`);

    // data compilation
    const redirectURL = (`${frontEndUrl}/qna?catid=${catid}&search_questiontitle=${searchQuestionTitle}`);
    console.log(`Redirect URL${redirectURL}`);

    // redirect to url with query parameters
    window.location.assign(redirectURL);

    // disable the normal behaviour of a form submit
    return false;
  });

  // log out
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign(`${frontEndUrl}/login`);
  });
});

const userData = localStorage.getItem('userInfo');

if (userData != null) {
  $('#loginBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#register').attr({ hidden: 'true', disabled: 'true' });
  $('#commentUserPost').removeAttr('hidden disabled');
  $('#userpost').removeAttr('hidden disabled');
  $('#addqnsbtn').removeAttr('hidden disabled');
  $('#addStorybtn').removeAttr('hidden disabled');
  $('#addEventBtn').removeAttr('hidden disabled');
  $('#profilebtn').removeAttr('hidden disabled');
  $('#joinbtn').removeAttr('hidden disabled');
  $('#logout').removeAttr('hidden disabled');
  $('#welcome').append(`Hello ${userData}`);
} else {
  $('#welcome').append('Welcome Students');
  $('#userpost').attr({ hidden: 'true', disabled: 'true' });
  $('#commentUserPost').attr({ hidden: 'true', disabled: 'true' });
  $('#joinbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#profilebtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addStorybtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addEventBtn').attr({ hidden: 'true', disabled: 'true' });
  $('#addqnsbtn').attr({ hidden: 'true', disabled: 'true' });
  $('#logout').attr({ hidden: 'true', disabled: 'true' });
  $('#register').removeAttr('hidden disabled');
  $('#loginBtn').removeAttr('hidden disabled');
}
