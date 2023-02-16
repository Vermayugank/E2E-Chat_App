const PORT = process.env.PORT || 3000;
const QuickEncrypt = require("quick-encrypt");
const ejs = require("ejs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { messege: "", original: "", encrypted: "" });
});

app.post("/", (req, res) => {
  const data = req.body;
//   console.log(data);

  // --- RSA Keypair Generation ---
  let keys = QuickEncrypt.generate(1024);

  //   // --- Encrypt using public key ---
  let encryptedText = QuickEncrypt.encrypt(data.messege, keys.public);
  //   console.log(encryptedText); // This will print out the ENCRYPTED text, for example : " 01c066e00c660aabadfc320621d9c3ac25ccf2e4c29e8bf4c...... "

  //   // --- Decrypt using private key ---
  let decryptedText = QuickEncrypt.decrypt(encryptedText, keys.private);
//   console.log(decryptedText); // This will print out the DECRYPTED text, which is " This is some super top secret text! "
  res.render("index", {
    messege: decryptedText,
    original: data.messege,
    encrypted: encryptedText,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
