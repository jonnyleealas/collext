'use strict';

import { Schema, model } from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { verify, sign } from 'jsonwebtoken';

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
});

// Before we save, hash the plain text password
UserSchema.pre('save', function(next) {
  hash(this.password,10)
    .then(hashedPassword => {
      // Update the password for this instance to the hashed version
      this.password = hashedPassword;
      // Continue on (actually do the save)
      next();
    })
    // In the event of an error, do not save, but throw it instead
    .catch( error => {throw error;} );
});

UserSchema.statics.createFromOAuth = function(incoming) {


  if ( ! incoming || ! incoming.email ) {
    return Promise.reject('VALIDATION ERROR: missing username/email or password ');
  }

  return this.findOne({email:incoming.email})
    .then(user => {
      if ( ! user ) { throw new Error ('User Not Found'); }
      return user;
    })
    .catch( error => {
    // Create the user
      let username = incoming.email;
      let password = 'none';
      return this.create({
        username: username,
        password: password,
        email: incoming.email,
      });
    });

};

// If we got a user/password, compare them to the hashed password
// return the user instance or an error
UserSchema.statics.authenticate = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(user => user && user.comparePassword(auth.password))
    .catch(error => error);
};

UserSchema.statics.authorize = function(token) {
  let parsedToken = verify(token, process.env.SECRET);
  let query = {_id:parsedToken.id};
  return this.findOne(query)
    .then(user => {
      // looked up their role and then all capabilities
      return user;
    })
    .catch(error => error);
};

// Compare a plain text password against the hashed one we have saved
UserSchema.methods.comparePassword = function(password) {
  return compare(password, this.password)
    .then(valid => valid ? this : null);
};

// Generate a JWT from the user id and a secret
UserSchema.methods.generateToken = function() {
  return sign( {id:this._id}, process.env.SECRET);
};

export default model('users', UserSchema);