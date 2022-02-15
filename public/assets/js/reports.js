/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */

// url
const frontEndUrl = 'https://spforum.herokuapp.com';
const backEndUrl = 'https://spforum-backend.herokuapp.com';

// get item from url
const userData = localStorage.getItem('userInfo');
const tmpToken = JSON.parse(localStorage.getItem('token'));
let reportSearchChar = [];
const reportSearch = document.getElementById('reportSearch');
let blockedSearchChar = [];
const blockSearch = document.getElementById('blockedSearch');

function loadUserProfilePic() {
  const pic = JSON.parse(localStorage.getItem('userImage'));
  document.getElementById('adminName').innerText = JSON.parse(userData);
  if (pic == null) {
    document.getElementById('profilePic').src = 'assets/images/spforumLogo.png';
  } else {
    document.getElementById('profilePic').src = pic;
  }
}
function displayReports(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.reportid}</th>
            <td>${cardInfo.description}</td>
            <td>${cardInfo.title}</td>
            <td>${cardInfo.username}</td>
            <td>${cardInfo.status}</td>
            <td>
            <button class="btn btn-danger btnBlock" 
            onclick="document.getElementById('editReportModal').style.display = 'flex';
            $('#reportPurpose').val('${cardInfo.title}');
            $('#reportID').val(${cardInfo.reportid});
            $('#reportDetailsInput').val('${cardInfo.detail}');
            $('#questionID').val('${cardInfo.questionid}');
            $('#postDetails').val('${cardInfo.description}');
            $('#userEmail').val('${cardInfo.email}');
            $('#userName').val('${cardInfo.username}');
            $('#posterName').val('${cardInfo.poster}');
            $('#posterEmail').val('${cardInfo.posterEmail}');">Block</button>
            </td>
        </tr>
    `;

  return card;
}
function displayBlocked(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.reportid}</th>
            <td>${cardInfo.postTitle}</td>
            <td>${cardInfo.description}</td>
            <td>${cardInfo.username}</td>
            <td>${cardInfo.status}</td>
            <td>
            <button class="btn btn-danger btnBlock" onclick="
            document.getElementById('blockedPostModal').style.display = 'flex';
            $('#reportPurposeInput').val('${cardInfo.title}');
            $('#blockedDetailsInput').val('${cardInfo.detail}');
            $('#reportStatusInput').val('${cardInfo.status}');">Details</button>
            </td>
        </tr>
    `;

  return card;
}
function sendEmail(name, email, post, poster, posterEmail, purpose, details, reason, status) {
  if (status === 'Blocked') {
    Email.send({
      Host: 'smtp.gmail.com',
      Username: 'spforumsofficial@gmail.com',
      Password: 'qxyosyqkzpijcydj',
      To: `${email}`,
      From: 'spforumsofficial@gmail.com',
      Subject: 'Report Results',
      Body: `<h3>Name: ${name} </h3> 
                <h3>Email: ${email} </h3> 
                <h3>Post: ${post} by ${poster}</h3>
                <h3>Report: ${purpose}, ${details} </h3>
                <h4>Thank you ${name} for your report. After much investigation and validation, we concluded that the post 
                will be blocked due to ${reason}.</h4>
                `,
    });

    Email.send({
      Host: 'smtp.gmail.com',
      Username: 'spforumsofficial@gmail.com',
      Password: 'qxyosyqkzpijcydj',
      To: `${posterEmail}`,
      From: 'spforumsofficial@gmail.com',
      Subject: 'Report Results',
      Body: `<h3>Name: ${poster} </h3> 
                <h3>Email: ${posterEmail} </h3> 
                <h3>Post: ${post} by ${poster}</h3>
                <h4>${poster}, you have received a report for your post. After much investigation and validation, we concluded that the post 
                will be blocked due to ${reason}.</h4>
                `,
    });
  } else if (status === 'Reject') {
    Email.send({
      Host: 'smtp.gmail.com',
      Username: 'spforumsofficial@gmail.com',
      Password: 'qxyosyqkzpijcydj',
      To: `${email}`,
      From: 'spforumsofficial@gmail.com',
      Subject: 'Report Results',
      Body: `<h3>Name: ${name} </h3> 
                <h3>Email: ${email} </h3> 
                <h3>Post: ${post} by ${poster}</h3>
                <h3>Report: ${purpose}, ${details} </h3>
                <h4>Thank you ${name} for your report. After much investigation and validation, we concluded that the report
                will be rejected due to ${reason}.</h4>
                `,
    });
  }
  new Noty({
    timeout: '5000',
    type: 'success',
    layout: 'topCenter',
    theme: 'sunset',
    text: 'Email Sent!!',
  }).show();
}
function allReports() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/reports`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      reportSearchChar = data;
      console.log(reportSearchChar);

      $('#allReports').html('');
      $('#msgPending').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const report = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            reportid: report.reportID,
            detail: report.reportDetail,
            status: report.status,
            questionid: report.questionid,
            title: report.title,
            description: report.description,
            username: report.username,
            poster: report.Poster,
            posterEmail: report.PosterEmail,
            email: report.email,
          };

          const newCard = displayReports(cardInfo);

          $('#allReports').append(newCard);
        }
      } else {
        $('#msgPending').append('No Pending Reports Found');
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
function allBlockedReports() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/blockedposts`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);
      blockedSearchChar = data;
      console.log(blockedSearchChar);

      $('#allBlockedReports').html('');
      $('#msgResults').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const blocked = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            reportid: blocked.reportID,
            detail: blocked.reportDetail,
            status: blocked.status,
            questionid: blocked.questionid,
            title: blocked.title,
            description: blocked.description,
            username: blocked.username,
            postTitle: blocked.qnTitle,
          };

          const newCard = displayBlocked(cardInfo);

          $('#allBlockedReports').append(newCard);
        }
      } else {
        $('#msgResults').append('No Blocked Or Rejected Reports Found');
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
function filterBlockedReports(tmpStatus) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/filterposts/${tmpStatus}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('---------Response Data ------------');
      console.log(data);

      $('#allBlockedReports').html('');
      $('#msgResults').html('');
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          const question = data[i];

          // compile the data that the card needs for its creation
          const cardInfo = {
            reportid: question.reportID,
            detail: question.reportDetail,
            status: question.status,
            questionid: question.questionid,
            title: question.title,
            description: question.description,
            username: question.username,
            postTitle: question.qnTitle,
          };

          const newCard = displayBlocked(cardInfo);

          $('#allBlockedReports').append(newCard);
        }
      } else {
        $('#msgResults').append('No Blocked Or Rejected Reports Found');
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
function blockPosts() {
  // data extraction
  const blkReason = $('#BlockReasonInput').val();
  const blkStatus = $('#reportStatus').val();
  const qnID = $('#questionID').val();
  const post = $('#postDetails').val();
  const purpose = $('#reportPurpose').val();
  const details = $('#reportDetailsInput').val();
  const user = $('#userName').val();
  const email = $('#userEmail').val();
  const posterEmail = $('#posterEmail').val();
  const poster = $('#posterName').val();

  // get item from local storage
  const data = {
    reason: blkReason,
    status: blkStatus,
  };
  console.log(`DATA: ${JSON.stringify(data)}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/block/${qnID}`,
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

        document.getElementById('editReportModal').style.display = 'none';
        allReports();
        allBlockedReports();
        sendEmail(user, email, post, poster, posterEmail, purpose, details, blkReason, blkStatus);
        $('#BlockReasonInput').val('');
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
function rejectReport() {
  // data extraction
  const blkReason = $('#BlockReasonInput').val();
  const blkStatus = $('#reportStatus').val();
  const reportID = $('#reportID').val();
  const post = $('#postDetails').val();
  const purpose = $('#reportPurpose').val();
  const details = $('#reportDetailsInput').val();
  const user = $('#userName').val();
  const email = $('#userEmail').val();
  const posterEmail = $('#posterEmail').val();
  const poster = $('#posterName').val();

  // get item from local storage
  const data = {
    reason: blkReason,
    status: blkStatus,
  };
  console.log(`DATA: ${JSON.stringify(data)}`);

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/reject/${reportID}`,
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
        document.getElementById('editReportModal').style.display = 'none';
        allReports();
        allBlockedReports();
        sendEmail(user, email, post, poster, posterEmail, purpose, details, blkReason, blkStatus);
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
reportSearch.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  // eslint-disable-next-line arrow-body-style
  const filterReports = reportSearchChar.filter((report) => {
    return (
      report.description.toLowerCase().includes(searchString)
    );
  });
  console.log(filterReports);
  $('#allReports').html('');
  $('#msgPending').html('');
  if (filterReports.length !== 0) {
    for (let i = 0; i < filterReports.length; i++) {
      const question = filterReports[i];

      // compile the data that the card needs for its creation
      const cardInfo = {
        reportid: question.reportID,
        detail: question.reportDetail,
        status: question.status,
        questionid: question.questionid,
        title: question.title,
        description: question.description,
        username: question.username,
        poster: question.Poster,
        posterEmail: question.PosterEmail,
        email: question.email,
      };

      const newCard = displayReports(cardInfo);

      $('#allReports').append(newCard);
    }
  } else {
    $('#msgPending').append('No Pending Reports Found');
  }
});
blockSearch.addEventListener('keyup', (e) => {
  const searchString = e.target.value.toLowerCase();
  // eslint-disable-next-line arrow-body-style
  const filterBlocked = blockedSearchChar.filter((user) => {
    return (
      user.description.toLowerCase().includes(searchString)
    );
  });

  $('#allBlockedReports').html('');
  $('#msgResults').html('');
  if (filterBlocked.length !== 0) {
    for (let i = 0; i < filterBlocked.length; i++) {
      const blocked = filterBlocked[i];

      // compile the data that the card needs for its creation
      const cardInfo = {
        reportid: blocked.reportID,
        detail: blocked.reportDetail,
        status: blocked.status,
        questionid: blocked.questionid,
        title: blocked.title,
        description: blocked.description,
        username: blocked.username,
        postTitle: blocked.qnTitle,
      };

      const newCard = displayBlocked(cardInfo);

      $('#allBlockedReports').append(newCard);
    }
  } else {
    $('#msgResults').append('No Blocked Or Rejected Reports Found');
  }
});
$(document).ready(() => {
  loadUserProfilePic();
  allReports();
  allBlockedReports();

  $('#blockPost').click(() => {
    const reportStatus = $('#reportStatus').val();
    if (reportStatus === 'Blocked') {
      blockPosts();
    } else if (reportStatus === 'Reject') {
      rejectReport();
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
