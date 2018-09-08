const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: { type: String, unique: true },
  email: String,
  hash: String,
  salt: String,
});

UsersSchema.plugin(uniqueValidator, { message: '{PATH} already exists!' });

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    username: this.username,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    user :{
      _id: this._id,
      username: this.username
    },
    jwt : this.generateJWT()
  };
};

mongoose.model('Users', UsersSchema);