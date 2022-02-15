/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const serveStatic = require('serve-static');

// set hostname and portnumber
const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method !== 'GET') {
    res.type('.html');
    const msg = '<html><body>This server only serves web pages with GET!</body></html>';
    res.end(msg);
  } else {
    next();
  }
});

// go to homepage
app.get('/', (req, res) => {
  res.sendFile('/public/assets/html/homepage.html', { root: __dirname });
});
// go to homepage
app.get('/homepage', (req, res) => {
  res.sendFile('/public/assets/html/homepage.html', { root: __dirname });
});

// go to qna page
app.get('/qna', (req, res) => {
  res.sendFile('public/assets/html/qna/qna.html', { root: __dirname });
});
// go to school page
app.get('/school', (req, res) => {
  res.sendFile('/public/school.html', { root: __dirname });
});

// go to my profile page
app.get('/profile', (req, res) => {
  res.sendFile('/public/assets/html/profile.html', { root: __dirname });
});
// go to my question page
app.get('/questions', (req, res) => {
  res.sendFile('/public/profile/questions.html', { root: __dirname });
});

// go to qna details page
app.get('/qnaDetails', (req, res) => {
  res.sendFile('public/assets/html/qna/qnaDetails.html', { root: __dirname });
});
// go to search page
app.get('/search', (req, res) => {
  res.sendFile('/public/search.html', { root: __dirname });
});

// go to dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile('/public/assets/html/admin/dashboard.html', { root: __dirname });
});

// go to events-admin page
app.get('/events-admin', (req, res) => {
  res.sendFile('/public/assets/html/admin/events-admin.html', { root: __dirname });
});

// go to post-admin page
app.get('/post-admin', (req, res) => {
  res.sendFile('/public/assets/html/admin/post-admin.html', { root: __dirname });
});

// go to stories-admin page
app.get('/stories-admin', (req, res) => {
  res.sendFile('/public/assets/html/admin/stories-admin.html', { root: __dirname });
});

// go to reports page
app.get('/reports', (req, res) => {
  res.sendFile('/public/assets/html/admin/reports.html', { root: __dirname });
});

// go to team page
app.get('/team', (req, res) => {
  res.sendFile('/public/assets/html/admin/team.html', { root: __dirname });
});

// go to story page
app.get('/story', (req, res) => {
  res.sendFile('/public/assets/html/story/story.html', { root: __dirname });
});
app.get('/storyDetails', (req, res) => {
  res.sendFile('/public/assets/html/story/storyDetails.html', { root: __dirname });
});
app.get('/error', (req, res) => {
  res.sendFile('/public/assets/html/error.html', { root: __dirname });
});
app.get('/addStory', (req, res) => {
  res.sendFile('/public/assets/html/story/addStory.html', { root: __dirname });
});
app.get('/updateStory', (req, res) => {
  res.sendFile('/public/assets/html/story/updateStory.html', { root: __dirname });
});

// go to events page
app.get('/event', (req, res) => {
  res.sendFile('/public/assets/html/event/event.html', { root: __dirname });
});

// go to event detail page
app.get('/eventDetails', (req, res) => {
  res.sendFile('/public/assets/html/event/eventDetails.html', { root: __dirname });
});

// go to add event page
app.get('/addEvent', (req, res) => {
  res.sendFile('/public/assets/html/event/addEvent.html', { root: __dirname });
});

// go to chat room page
app.get('/joinroom', (req, res) => {
  res.sendFile('/public/assets/html/chat/join.html', { root: __dirname });
});
app.get('/chatroom', (req, res) => {
  res.sendFile('/public/assets/html/chat/chat.html', { root: __dirname });
});

// retrieve from public folder
app.use(serveStatic(`${__dirname}/public`));

// listen to hostname and port

// app.listen(port, hostname, () => {
//   console.log(`Server hosted at http://${hostname}:${port}`);
// });

// const server = app.listen(port);
// const socketio = require('socket.io');

// const io = socketio(server);
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app);
const io = new Server(httpServer);

const formatMessage = require('./public/assets/js/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./public/assets/js/users');

const botName = 'Chat Bot';
// Listen to user connection
io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Student chat room!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`),
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`),
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

httpServer.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});
