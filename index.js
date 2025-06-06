const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Vérification de la connexion MongoDB
function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

// Middleware
app.use(express.json());
app.use(express.static('public')); // Sert les fichiers statiques depuis le dossier 'public'

// Middleware pour vérifier la connexion MongoDB
app.use(async (req, res, next) => {
  console.log(`Requête reçue: ${req.method} ${req.path}`);
  if (!isMongoConnected()) {
    console.log('MongoDB non connecté, tentative de reconnexion...');
    try {
      await mongoose.connect("mongodb+srv://devinho:GeneraL123ForGlobalTest@cluster0.seme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Reconnecté à MongoDB avec succès');
    } catch (error) {
      console.error('Erreur de reconnexion à MongoDB:', error);
      return res.status(500).json({ error: 'Base de données indisponible' });
    }
  }
  next();
});

// Définition du modèle Video
const videoSchema = new mongoose.Schema({
  name: String,
  path: String,
  active: Boolean
});

const Video = mongoose.model('Video', videoSchema);

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

app.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/videos/:id', async (req, res) => {
  try {
    const { active } = req.body;
    
    // Vérifier si la vidéo existe avant de faire des modifications
    const targetVideo = await Video.findById(req.params.id);
    if (!targetVideo) {
      return res.status(404).json({ error: 'Vidéo non trouvée' });
    }
    
    if (active) {
      // Désactiver toutes les autres vidéos
      await Video.updateMany({}, { active: false });
    }
    
    // Mettre à jour la vidéo cible
    targetVideo.active = active;
    await targetVideo.save();
    
    // Renvoyer la vidéo mise à jour
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route temporaire pour réinitialiser les vidéos
app.get('/reset-videos', async (req, res) => {
  try {
    await Video.deleteMany({});
    const videoFiles = [
      { file: 'video1.mp4', name: 'video1' },
      { file: 'video2.mp4', name: 'video2' },
      { file: 'video3.mp4', name: 'video3' },
      { file: 'video4.mp4', name: 'video4' }
    ];
    const videos = videoFiles.map(video => ({
      name: video.name,
      path: video.file,
      active: false
    }));
    await Video.insertMany(videos);
    res.json({ message: 'Vidéos réinitialisées avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Initialisation des vidéos
async function initVideos() {
  try {
    // Vérifier si des vidéos existent déjà
    const existingVideos = await Video.find();
    if (existingVideos.length === 0) {
      const videoFiles = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4'];
      const videos = videoFiles.map(filename => ({
        name: filename.replace('.mp4', ''),
        path: filename,  // Chemin relatif au dossier public
        active: false
      }));
      
      await Video.insertMany(videos);
      console.log('Vidéos initialisées avec succès');
    } else {
      console.log('Les vidéos sont déjà initialisées');
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des vidéos:', error);
  }
}

// Connexion à MongoDB et démarrage du serveur
async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://devinho:GeneraL123ForGlobalTest@cluster0.seme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à MongoDB');
    
    // Initialiser les vidéos après la connexion à MongoDB
    await initVideos();
    
    app.listen(PORT, () => {
      console.log("Server en ligne sur le port " + PORT);
    });
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  }
}

startServer();

// Le serveur sera démarré après la connexion à MongoDB