const express = require("express");
let books = require("./booksdb.js");
const regd_users = express.Router();
const jwt = require("jsonwebtoken");

let users = [
  {
    username: "admin",
    password: "admin123",
  },
];

// Kullanıcı adı geçerlilik kontrolü
const isValid = (username) => {
  return username && typeof username === "string";
};

// Yeni kullanıcı kaydı için rota
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!isValid(username) || users.some((u) => u.username === username)) {
    return res
      .status(400)
      .json({ message: "Geçersiz kullanıcı adı veya zaten alınmış." });
  }
  users.push({ username, password });
  res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
});

// Kullanıcı girişi için rota
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    res.json({ message: "Successfully logged in" });
  } else {
    res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı." });
  }
});

// Kitap incelemesi ekleme
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.body;
  const { isbn } = req.params;
  const username = "admin";

  if (!books[isbn]) {
    return res
      .status(404)
      .json({ message: "Bu ISBN numarasına sahip bir kitap bulunamadı." });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;

  res.json({ message: "New review succesfully added." });
});

// Kitap incelemesi silme
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = "admin";

  if (books[isbn] && books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.json({ message: "Review deleted." });
  } else {
    res.status(404).json({ message: "Silinecek inceleme bulunamadı." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
