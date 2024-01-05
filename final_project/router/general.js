const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  // Kullanıcıyı kaydetme işlemi burada yapılacak
  // ...
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    // Burada Axios ile kendi sunucunuzdaki kitap listesi rotasına istek gönderin
    const response = await axios.get("http://localhost:5000/"); // Bu URL, kitap listesini döndüren rotanız olmalıdır
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  try {
    const response = await axios.get(
      `http://localhost:5000/books?author=${author}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const response = await axios.get(
      `http://localhost:5000/books?title=${title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const booksArray = Object.values(books); // books nesnesini diziye çevir
  const book = booksArray.find((book) => book.isbn === isbn);

  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
