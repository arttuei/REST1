const express = require("express");
const fs = require("fs");

// Muuttujien alustus
const PORT = 3000;
const sanakirjaTiedosto = "sanakirja.txt";

// Luodaan uusi Express-sovellus
const app = express();

// Apufunktio sanan etsimiseen sanakirjasta
function etsiSana(suomiSana) {
  const sanakirja = fs.readFileSync(sanakirjaTiedosto, "utf8").split("\n");
  for (let rivi of sanakirja) {
    const sanapari = rivi.split(" ");
    if (sanapari[0] === suomiSana) {
      return sanapari[1];
    }
  }
  return null;
}

// Määritellään sovelluksen käyttävän JSONia
app.use(express.json());

// GET-reitti sanojen hakemiselle
app.get("/haku", (req, res) => {
  const suomiSana = req.query.sana;
  const englantiSana = etsiSana(suomiSana);

  if (englantiSana) {
    return res.json({ englanti: englantiSana });
  }

  res.status(404).json({ virhe: "Sana ei löytynyt" });
});

// POST-reitti sanojen lisäämiselle
app.post("/lisaa", (req, res) => {
  const { suomi, englanti } = req.body;

  if (suomi && englanti) {
    fs.appendFileSync(sanakirjaTiedosto, `\n${suomi} ${englanti}`);
    return res.json({ viesti: "Sana lisätty" });
  }

  res.status(400).json({ virhe: "Väärä syöte" });
});

// Palvelimen käynnistys
app.listen(PORT, () => {
  console.log(`Serveri käyttää porttia ${PORT}`);
});
