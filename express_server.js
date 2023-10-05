const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

const generateRandomString = length => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
} 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
}); 

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
}); 

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;

  const url = urlDatabase[id];

  console.log("URL for ID", id, "is", url);

  if (!url) {
    res.status(404).send("URL not found");
  } else {
    // Redirect directly to the long URL
    res.redirect(url);
  }
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id]
  res.redirect(longURL);
}); 

app.get("/urls/u/:id", (req, res) => {
  const id = req.params.id;
  const url = urlDatabase[id];

  if (!url) {
    res.status(404).send("URL not found");
  } else {
    const templateVars = { id, longURL: url };
    res.render("urls_show", templateVars);
  }
});

app.post("/login", (req, res) => {
  res.cookie('username', {username: req.body.username})
  res.redirect('/urls')
})

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});