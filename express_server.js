const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

function generateRandomString(length) {
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

app.post("/redirect", (req, res) => {
  const longURL = 'http://' + req.body.longURL;
  console.log(longURL)
  const id = generateRandomString(6);

  // Add the new URL to your 'urlDatabase' object
  urlDatabase[id] = longURL;

  console.log("Created new URL:", longURL);

  // Render the "urls_show" template with the newly created URL's details
  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});



app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console

  // You should generate an ID here and redirect to the details page
  const id = generateRandomString(6);
  const longURL = req.body.longURL;

  // Add the new URL to your 'urlDatabase' object
  urlDatabase[id] = longURL;

  // Redirect to the details page for the newly created URL
  res.redirect(`/urls/${id}`);
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
}); 

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
 });
 
 app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});