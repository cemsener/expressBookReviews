const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const books = require("./router/booksdb.js");

const app = express();

app.use(express.json());

app.get("/books", (req, res) => {
  res.json(books);
});

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

// app.use("/customer/auth/*", function auth(req, res, next) {
//   // Oturumdan erişim belirtecini al
//   const token = req.session.accessToken;

//   // Erişim belirtecini kontrol et
//   if (token) {
//     try {
//       // jwt ile belirteci doğrula
//       const decoded = jwt.verify(token, "sifrem");
//       // Belirteç geçerli, sonraki middleware'e geç
//       next();
//     } catch (error) {
//       // Belirteç geçersiz, hata mesajı gönder
//       res.status(401).send("Unauthorized: Invalid token");
//     }
//   } else {
//     // Belirteç bulunamadı, hata mesajı gönder
//     res.status(401).send("Unauthorized: No token provided");
//   }
// });

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
