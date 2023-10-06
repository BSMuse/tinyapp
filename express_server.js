const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookiesession = require('cookie-session'); 
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookiesession({
  name: 'thy-session',
  keys: ['muh-secret-key-shhhhh'], 
}));

const generateRandomString = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}; 

const getEmailById = (id, database) => {
  const user = database.find(user => user.id === id);
  return user ? user.email : null;
}; 

const validateId = (id, database) => {
  const user = database.find(user => user.id === id);
  return user;
}; 

const users = [
  {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
];

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID", 
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID", 
  },
};

app.get('/', (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);   

  if (isLoggedIn) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }

  res.render('navbar', { loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' });
});

app.get("/urls", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);
  console.log(req.session.user_id)
  const userURLs = {};

  if (isLoggedIn) {
    for (const urlID in urlDatabase) {
      if (urlDatabase[urlID].userID === req.session.user_id) {
        userURLs[urlID] = urlDatabase[urlID];
      }
    }
  }

  const templateVars = { urls: userURLs, username: getEmailById(req.session.user_id, users), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' };
  res.render('urls_index', templateVars);
}); 

app.get("/urls/new", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users); 
  const templateVars = { username: getEmailById(req.session.user_id, users), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' };

  if (isLoggedIn) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
}); 

app.get("/urls/:id", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);  
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    res.status(404).send("URL not found");
    console.log(id)
  } else if (isLoggedIn && url.userID === req.session.user_id) {
    const templateVars = { id, longURL: url.longURL, username: getEmailById(req.session.user_id, users), loginButtonLabel: 'Logout' };
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("You do not have permission to access this URL.");
  }
});

app.get('/login', (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);   
  
  if (isLoggedIn) {
    res.redirect('/urls');
  } else {
    res.render('login');
  }
});

app.get('/register', (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);   
  
  if (isLoggedIn) {
    res.redirect('/urls');
  } else {
    res.render('register');
  }
}); 

app.get("/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id] && urlDatabase[id].longURL) {
    const longURL = urlDatabase[id].longURL;
    res.redirect(longURL);
  } else {
    res.status(404).send("URL not found");
  }
});

app.post('/register', (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users); 

  if (isLoggedIn) {
    return res.redirect('/urls');
  }

  const existingUser = users.find(user => user.email === req.body.email);

  if (existingUser) {
    res.status(400).send('User already exists');
  } else {
    const newUser = {
      id: generateRandomString(6),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };

    users.push(newUser);
    req.session.user_id = newUser.id;
    res.redirect('/urls');
  }
});

app.post('/login', (req, res) => {
  const existingUser = users.find(user => user.email === req.body.email);

  if (!existingUser) {
    res.status(403).send('User not found');
  } else if (bcrypt.compareSync(req.body.password, existingUser.password)) {
    req.session.user_id = existingUser.id;
    res.redirect('/urls');
  } else {
    res.status(403).send('Incorrect password');
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login'); 
});

app.post("/newurl", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users); 

  if (isLoggedIn) {
    const longURL = 'http://' + req.body.longURL;
    const id = generateRandomString(6);
    const userID = req.session.user_id;

    urlDatabase[id] = { longURL, userID };
    res.redirect(`/urls/${id}`);
  } else {
    res.status(401).send("You are not logged in.");
  }
});

app.post("/urls", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users); 

  if (isLoggedIn) {
    const id = generateRandomString(6);
    const longURL = 'http://' + req.body.longURL;
    const userID = req.session.user_id;

    urlDatabase[id] = { longURL, userID };
    res.redirect(`/urls/${id}`);
  } else {
    res.status(401).send("You are not logged in.");
  }
});

app.post("/urls/:id/delete", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users); 

  if (!isLoggedIn) {
    return res.status(401).send('You are not logged in.');
  }

  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    return res.status(404).send('URL not found.');
  }

  if (url.userID === req.session.user_id) {
    delete urlDatabase[id];
    res.redirect('/urls');
  } else {
    res.status(403).send('You do not have permission to delete this URL.');
  }
});

app.post("/urls/:id/edit", (req, res) => {
  const isLoggedIn = validateId(req.session.user_id, users);

  if (!isLoggedIn) {
    return res.status(401).send('You are not logged in.');
  }

  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    return res.status(404).send('URL not found.');
  }

  if (url.userID === req.session.user_id) {
    const longURL = 'http://' + req.body.longURL;
    urlDatabase[id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(403).send('You do not have permission to edit this URL.');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

