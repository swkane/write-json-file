const writeJsonFile = require("write-json-file");
const express = require("express");
const request = require("request");
const rp = require("request-promise");
const app = express();
app.use(express.json());

const POKEMON_API_URL = "http://pokeapi.co/api/v2/pokemon/";

let ids = new Array(99).fill().map((a, b) => (a = b + 1));
let obj = [];
ids.forEach(id => {
  const option = {
    uri: POKEMON_API_URL + id,
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true // Automatically parses the JSON string in the response
  };
  rp(option)
    .then(data => {
      obj.push([
        {
          name: data.name,
          id: data.id,
          types: data.types,
          sprites: data.sprites
        },
        data.id
      ]);
      console.log(obj);
    })
    .then(() => {
      if (obj.length === ids.length) {
        const idRange = ids[0] + "-" + ids[ids.length - 1];
        obj = obj.sort((a, b) => a[1] - b[1]);
        obj = obj.map(a => a[0]);
        writeJsonFile(`pokemon_${idRange}.json`, obj);
      }
    })
    .then(() => {
      obj.length === ids.length
        ? console.log(`all done with, ${obj.length} entries`)
        : console.log("added...");
    })
    .catch(function(err) {
      console.error(err.message);
    });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
