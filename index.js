const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://devinho:GeneraL123ForGlobalTest@cluster0.seme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.static('public')); // Sert les fichiers statiques depuis le dossier 'public'

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

app.listen(PORT, () => console.log("Server en ligne sur le port " + PORT));
