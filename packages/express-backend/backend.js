import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import UserService from "./services/user-service.js"

dotenv.config();

mongoose.set("debug", true);

const app = express();
const port = 8000;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    UserService.getUsers(name, job)
        .then((result) => {
            if (result) {
                res.send(result);
            } else {
                res.status(404).send("Service unavailable");
            }
        })
        .catch( (error) => {
            res.status(500).send(error.name);
        })
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;

    UserService.findUserById(id)
        .then((result) => {
            if (result) {
               res.send(result);
            }
            else {
                res.status(404).send(`Not found: ${id}`);
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        })
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    UserService.addUser(userToAdd)
        .then((result) => {
            if (result) {
                res.status(201).send(result);
            }
            else {
                res.status(404).send(`Not a valid user`);
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        })
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    UserService.removeUser(id)
        .then((result) => {
            if (result) {
                res.status(200).send(result);
            }
            else {
                res.status(404).send(`User not found`);
            }
        })
        .catch((error) => {
            res.status(500).send(error.name);
        })
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});