const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://devinho:GeneraL123ForGlobalTest@cluster0.seme1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

const Todo = mongoose.model("Todo", { text: String });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  await todo.save();
  res.json(todo);
});

app.listen(PORT, () => console.log("Server en ligne sur le port " + PORT));
