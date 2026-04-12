import express from "express";

const app = express();
const port = 8000;

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor",
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer",
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor",
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress",
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender",
        },
    ],
};

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello!");
});

const findUserByName = (name) => {
    return users["users_list"].filter( (user) => user["name"] === name);
}

const findUserById = (id) => {
    return users["users_list"].find( (user) => user["id"] === id);
}

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
};

const removeUserById = (id) => {
    const userToRemove = findUserById(id);
    if (userToRemove === undefined) {
        return undefined;
    }
    users.users_list = users.users_list.filter( (user) => user.id !== id);

    return userToRemove;
};


app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    let result = users.users_list;

    if (name !== undefined) {
        result = findUserByName(name);
    }
    if (job !== undefined) {
        result = result.filter( (user) => user.job === job)
    }

    res.send({users_list: result});
});

app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    let result = findUserById(id);
    if (result === undefined ){
        res.status(404).send("id not found");
    }
    else {
        res.send(result);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    addUser(userToAdd);
    res.status(200).send();
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    let result = removeUserById(id);
    if (result === undefined) {
        return res.status(404).send("user not found");
    }
    else {
        return res.status(200).send("user removed");
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});