// === DOM-Elemente ===
const buttonUp = document.getElementById("moveUp");
const buttonRight = document.getElementById("moveRight");
const buttonLeft = document.getElementById("moveLeft");
const buttonDown = document.getElementById("moveDown");
const text = document.getElementById("text");
const metaInfo = document.getElementById("metaInfo");
const pokemonListUI = document.getElementById("pokemonList");
const posXDisplay = document.getElementById("posX");
const posYDisplay = document.getElementById("posY");

// === Konstanten für Map-Grenzen ===
const mapMaxX = 200;
const mapMaxY = 200;

// === Spielerobjekt ===
const PLAYER = {
  name: "Unbekannt",
  level: 1,
  xp: 0,
  position: { x: 0, y: 0 },
  inventory: [],
  pokemons: [],
  currentPokemon: "Unbekannt",

  levelUp() {
    this.level++;
    this.xp = 0;
  },

  gainXP(amount) {
    this.xp += amount;
    if (this.xp >= 100) this.levelUp();
  },

  addPokemon(pokemon) {
    this.pokemons.push(pokemon);
  },

  setCurrentPokemon(pokemon) {
    this.currentPokemon = pokemon;
  },

  catchPokemon(pokemon) {
    this.addPokemon(pokemon);
    this.setCurrentPokemon(pokemon);
  },

  releasePokemon(pokemon) {
    this.pokemons = this.pokemons.filter((p) => p !== pokemon);
  },
};

// === Position anzeigen ===
function changePosition() {
  posXDisplay.textContent = `X: ${PLAYER.position.x} (${mapMaxX})`;
  posYDisplay.textContent = `Y: ${PLAYER.position.y} (${mapMaxY})`;
}

// === Bewegung ausführen ===
function move(direction) {
  switch (direction) {
    case "up":
      PLAYER.position.y += 1;
      text.textContent = "Du gehst nach Vorne";
      break;
    case "right":
      PLAYER.position.x += 1;
      text.textContent = "Du gehst nach Rechts";
      break;
    case "left":
      PLAYER.position.x -= 1;
      text.textContent = "Du gehst nach Links";
      break;
    case "down":
      PLAYER.position.y -= 1;
      text.textContent = "Du gehst nach Hinten";
      break;
  }
  changePosition();
}

// === Meta-Infos anzeigen ===
function updateMetaData() {
  metaInfo.textContent = "Textadventure";
}

function updatePlayerStats() {
  let playerStats = document.getElementById("playerStats");
  playerStats.innerHTML = `
    <p>Name: ${PLAYER.name}</p>
    <p>Level: ${PLAYER.level}</p>
    <p>XP: ${PLAYER.xp}</p>
    <p>Pokemon: ${PLAYER.currentPokemon}</p>
  `;
}

// === Pokémon laden ===
async function loadAll151Pokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Fehler beim Abrufen der Pokémon:", error);
    return [];
  }
}

async function readAll151Pokemon() {
  const basicList = await loadAll151Pokemon();
  if (!basicList.length) return;

  const detailedList = await Promise.all(
    basicList.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      return {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprite: data.sprites.front_default,
        id: data.id,
      };
    })
  );

  for (const pokemon of detailedList) {
    const listItem = document.createElement("li");

    const img = document.createElement("img");
    img.src = pokemon.sprite;
    img.alt = pokemon.name;
    img.width = 50;
    img.height = 50;
    img.style.marginRight = "10px";
    img.style.verticalAlign = "middle";

    listItem.append(img, pokemon.name);
    pokemonListUI.appendChild(listItem);
  }
}

// === Event Listener ===
buttonUp.addEventListener("click", () => move("up"));
buttonRight.addEventListener("click", () => move("right"));
buttonLeft.addEventListener("click", () => move("left"));
buttonDown.addEventListener("click", () => move("down"));

// === Initiale Aufrufe ===
updateMetaData();
changePosition();
updatePlayerStats();
readAll151Pokemon();
