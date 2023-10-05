const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(morgan());

const generateRandomString = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}; 

const getEmailById = id => {
  const user = users.find(user => user.id === id);
  return user ? user.email : null;
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const isLoggedIn = req.cookies.user_id !== undefined;  

  if (isLoggedIn) {
    res.redirect('/urls')
  } else {
    res.redirect('/login')
  }

  res.render('navbar', { loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' });
});

app.get("/urls", (req, res) => {
  const isLoggedIn = req.cookies.user_id !== undefined;
  const templateVars = { urls: urlDatabase, username: getEmailById(req.cookies["user_id"]), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' };
  res.render('urls_index', templateVars);
}); 

app.get("/urls/new", (req, res) => {
  const isLoggedIn = req.cookies.user_id !== undefined;
  const templateVars = { username: getEmailById(req.cookies["user_id"]), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login' };
  res.render("urls_new", templateVars);
}); 


app.get("/urls/:id", (req, res) => {
  const isLoggedIn = req.cookies.user_id !== undefined; 
  const id = req.params.id;
  const url = urlDatabase[id];
  const templateVars = { username: getEmailById(req.cookies["user_id"]), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login'  };

  console.log("URL for ID", id, "is", url);

  if (!url) {
    res.status(404).send("URL not found");
  } else {
    res.redirect(url, templateVars);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
}); 

app.get("/urls/u/:id", (req, res) => {
  const isLoggedIn = req.cookies.user_id !== undefined; 
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    res.status(404).send("URL not found");
  } else {
    const templateVars = { id, longURL: url, username: getEmailById(req.cookies["user_id"]), loginButtonLabel: isLoggedIn ? 'Logout' : 'Login'};
    res.render("urls_show", templateVars);
  }
});

app.get('/login', (req, res) => {
  res.render('login')
});


app.get('/register', (req, res) => {
  res.render('register')
});

app.post('/login', (req, res) => {
  const existingUser = users.find(user => user.email=== req.body.email);

  if (!existingUser) {
    res.status(403).send('User not found');
  } else {
    res.cookie('user_id', existingUser.id);
    
    res.redirect('/urls');
  }
});

app.post("/logout", (req, res) => {
  console.log("Logout route triggered");
  res.clearCookie("user_id"); 
  res.redirect('/login'); 
});

app.post("/newurl", (req, res) => {
  const longURL = 'http://' + req.body.longURL;
  const id = generateRandomString(6);
  urlDatabase[id] = longURL;
  res.redirect(`/urls/u/${id}`);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete  urlDatabase[id];
  res.redirect('/urls');
});

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  console.log(urlDatabase[id])
  urlDatabase[id] = 'http://' + req.body.longURL;
  console.log(urlDatabase[id])
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const existingUser = users.find(user => user.email=== req.body.email);

  if (existingUser) {
    res.status(400).send('User already exists');
  } else {
    const newUser = {
      id: generateRandomString(6),
      email: req.body.email,
      password: req.body.password,
    };
  
    users.push(newUser);

    res.cookie('user_id', newUser.id);
    
    res.redirect('/urls');
  }
}); 



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});