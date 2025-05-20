const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Définition du modèle Video
const videoSchema = new mongoose.Schema({
  name: String,
  path: String,
  active: Boolean
});

const Video = mongoose.model('Video', videoSchema);

mongoose.connect("mongodb+srv://devinho:GeneraL123ForGlobalTest@cluster0.seme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.static('public')); // Sert les fichiers statiques depuis le dossier 'public'

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

// Routes pour les vidéos
app.get('/videos', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

app.patch('/videos/:id', async (req, res) => {
  const { active } = req.body;
  const video = await Video.findByIdAndUpdate(req.params.id, { active }, { new: true });
  res.json(video);
});

app.listen(PORT, () => console.log("Server en ligne sur le port " + PORT));
