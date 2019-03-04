
import { join } from 'path';
import express from 'express';
import { urlencoded } from 'body-parser';
import session from 'express-session';
import flash from 'connect-flash';

import cookieParser from 'cookie-parser';
import authRouter from './auth/router';

import config from './config';

import routes from './controllers/index';
import notifications from './controllers/notifications';


// Create Express web app
let app = express();

// Use morgan for HTTP request logging in dev and prod
if (process.env.NODE_ENV !== 'test') {
  // app.use(morgan('combined'));
}

// Serve static assets
app.use(express.static(join(__dirname, 'public')));
app.set('views', join(__dirname, './public/views'));
// app.set('view engine', 'pug');

// Parse incoming form-encoded HTTP bodies
app.use(cookieParser());

app.use(urlencoded({
  extended: true,
}));


// Create and manage HTTP sessions for all requests
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
}));

// Use connect-flash to persist informational messages across redirects
app.use(flash());


// Add CSRF protection for web routes

// app.use(csurf());
// app.use(function(request, response, next) {
//   response.locals.csrftoken = request.csrfToken();
//   next();
// });


app.use('/', routes);
app.use('/notifications', notifications);
app.use(authRouter);


// production error handler
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {},
//   });
// });



export default app;