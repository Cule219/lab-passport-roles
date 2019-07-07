const express   = require('express');
const bcrypt    = require('bcrypt');
const passport  = require('passport');
const User      = require("../models/user");
const router    = express.Router();
const hbs       = require('hbs');

hbs.registerHelper('select', function(selected, options) {
  return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('index');
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/",
    failureFlash: true
  })
);

const loginCheck = () => {
  return (req, res, next) => {
    console.log(req.user);
    if (req.isAuthenticated()) next();
    else res.redirect("/login");
  };
};

router.use(loginCheck());

router.get("/users", (req, res, next) => {
  let user;
  if(req.role === 'Boss');
  User.find()
    .then(users => {
      user = users.role='Boss'?true:false
      res.render("protected/users", { users, user: user});
      console.log(user + ' req:' + req.role);
    })
    .catch(err => {
      // console.log(err)
      next(err);
    });
});

router.get("/user/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      res.render("protected/user", { user });
    })
    .catch(err => {
      next(err);
    });
});

const checksRole = role => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.redirect("/users");
    }
  };
};

router.get("/signup", checksRole("Boss"), (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", checksRole("Boss"), (req, res) => {
  const { username, password, role } = req.body;

  if (!password || !username) {
    res.render("auth/signup", { errorMessage: "Both fields are required" });

    return;
  } else if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "Password needs to be 8 characters min"
    });

    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "This username is already taken"
        });

        return;
      }
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      console.log(role);
      return User.create({
        username,
        password: hash,
        role: role
      }).then(data => {
        res.redirect("/users");
      });
    })
    .catch(err => {
      res.render("views/signup", { errorMessage: err._message });
    });
});

router.get(
  "/user/:userId/delete",
  checksRole("Boss"),
  (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
      .then(data => {
        res.redirect("/users");
      })
      .catch(err => {
        next(err);
      });
  }
);

router.get("/profile", (req, res) => {
  User.find({ _id: req.user._id }).then(user => {

    if (user.role === 'Boss') {
      user.optionASelected = true;
    } else if (user.role === 'TA') {
      user.optionBSelected = true;
    }else{
      user.optionCSelected = true;
    }
    res.render("protected/profile", { user: req.user});
  });
});

router.get("/user/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      res.render("protected/user", { user });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;

