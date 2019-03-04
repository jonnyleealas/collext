'use strict';

import Router from 'express';
const authRouter = Router();
import oauth from './lib/oauth.js';


authRouter.get('/oauth', (req, res, next) => {
  let URL = process.env.CLIENT_URL;

  // Offload the oauth handshaking process to a module designed
  // to do that job. The route itself shouldn't contain any logic...
  oauth.authorize(req)
    .then ( token => {
      res.cookie('auth', token);
      res.redirect(`${URL}?token=${token}`);
    })
    .catch(next);
});

export default authRouter;