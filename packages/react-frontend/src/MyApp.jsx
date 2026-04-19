import React, { useEffect, useState } from "react";
import Table from "./Table.jsx";
import Form from "./Form.jsx";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    deleteUser(characters.at(index).id)
        .then(() => {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        })
        .catch((error) => {
          console.log(error);
        });
  }

  function updateList(person) {
    postUser(person)
      .then((createdUser) => setCharacters([...characters, createdUser]))
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users");
  }

  function postUser(user) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }).then((res) => {
      if (res.status === 201) {
        return res.json();
      } else {
        throw new Error(`wrong status: ${res.status}`);
      }
    });
  }

function deleteUser(id) {
  return fetch(`http://localhost:8000/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 404) {
      throw new Error(res.statusText);
  }});
}

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
