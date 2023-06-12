const userRouter = require('express').Router();
const User = require('../../models/User.js');

// Get all users
userRouter.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res
      .User(500)
      .json({ message: 'Internal server error. Could not get users.' });
  }
});

// Get a user by id
userRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Internal server error. Could not get user.' });
  }
});

// Create a new user
userRouter.post('/', async (req, res) => {
  try {
    // If user is found, do not create.
    const [newUser, created] = await User.findOrCreate({
      where: { username: req.body.username },
      defaults: {
        password: req.body.password,
        email: req.body.email,
      },
    });
    // If user was not created just now, respond 409.
    if (!created) {
      res
        .status(409)
        .json({ message: 'Could not create user. User already exists.' });
      return;
    }
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Internal server error. Could not create user.' });
  }
});

// User sign-in
userRouter.post('/login', async (req, res) => {
  try {
    // Get username or email from client.
    const [userByUsername, userByEmail] = await Promise.all([
      User.findOne({
        where: { username: req.body.login },
      }),
      User.findOne({
        where: { email: req.body.login },
      }),
    ]);
    // Check if the user exists.
    const user = userByUsername || userByEmail;
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    // Check password.
    const auth = await user.authPassword(req.body.password);
    if (!auth) {
      res.status(401).json({ message: 'Wrong password.' });
      return;
    }
    // Add userId and loggedIn data to session. Save session to db.
    req.session.save(() => {
      req.session.userId = user.id;
      req.session.loggedIn = true;
      res.json({ message: 'Successfully signed in.', user: user });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Internal server error. Could not sign in.' });
  }
});

userRouter.post('/logout', (res, req) => {
  if (req.session.loggedIn) {
    req.session.destroy();
    res.status(204).end();
  } else {
    res
      .status(404)
      .json({ message: 'Internal server error. Sign out failed.' });
  }
});

module.exports = userRouter;
