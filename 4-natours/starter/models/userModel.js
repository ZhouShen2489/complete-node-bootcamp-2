const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // only work for Create and Save
      validator: function(el) {
        return el === this.password;
      },
      message: 'The passwords are not the same!'
    }
  },
  passwordChangedAt: {
    type: Date
  }
});

userSchema.pre('save', async function(next) {
  // Run only when password is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Set the passwordConfirm to undefined
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }
  // false measn NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
