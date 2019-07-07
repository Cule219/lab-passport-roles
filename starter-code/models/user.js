const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Boss', 'Developer', 'TA']
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;


// const bcrypt    = require('bcrypt');
// mongoose
//   .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
//   .then(x => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
//   })
//   .catch(err => {
//     console.error('Error connecting to mongo', err)
//   });

// function createBoss() {
//   const salt = bcrypt.genSaltSync();
//   const hash = bcrypt.hashSync("password", salt);
//   User.create({
//     username: 'boss',
//     password: hash,
//     role: 'Boss'
//   }).then(data => {
//     console.log(data)
//   });
// }
// createBoss();