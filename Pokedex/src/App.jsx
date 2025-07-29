import { useEffect, useState } from 'react';
import image from '/src/wp3636965-removebg-preview.png';
import './App.css';
import img from '/src/assets/pokedex.png';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isRotating, setIsRotating] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); 

  const handleThemeClick = () => {
    toggleTheme();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1000);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };


  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => setPokemonList(data.results))
      .catch((err) => console.error("Erreur:", err));

    fetch("https://pokeapi.co/api/v2/type")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.results.filter(type =>
          !['shadow', 'unknown'].includes(type.name)
        );
        setTypes(filtered);
      });
  }, []);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);

    if (type === 'all') {
      fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then((res) => res.json())
        .then((data) => setPokemonList(data.results));
    } else {
      fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.pokemon
            .filter((p) => parseInt(p.pokemon.url.split("/")[6]) <= 151)
            .map((p) => p.pokemon);
          setPokemonList(filtered);
        });
    }
  };

  return (
    <div className={`bigContainer ${theme}`}>
      <div>
        <ul>
          <li>
            <img src={image} alt="Pokémon" />
          </li>
          <li>
            <img
              src="public/pngwing.com.png"
              onClick={handleThemeClick}
              className={`theme-toggle-button ${isRotating ? 'rotate' : ''}`}
            />
          </li>
          <li>
            <img src={img} alt="pokedex" className='pokedex1' />
          </li>

        </ul>

        <div className="filter-container">
          <label htmlFor="type-select">Filtrer par catégorie : </label>
          <select id="type-select" onChange={handleTypeChange} value={selectedType}>
            <option value="all">Tous</option>
            {types.map((type) => (
              <option key={type.name} value={type.name}>
                {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Rechercher un Pokémon..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ margin: "20px 0", padding: "8px", width: "200px" }}
        />

        <div className="content-box">
          <div className="pokemon-grid">
            {pokemonList
              .filter(pokemon =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pokemon, index) => {
                const id = pokemon.url
                  ? pokemon.url.split("/")[6]
                  : index + 1;

                return (
                  <div
                    key={index}
                    className="pokemon-card"
                    onClick={() => setSelectedCard({ name: pokemon.name, id })}
                  >
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={pokemon.name}
                    />
                    <p>#{id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Modal affichage carte en grand */}
      {selectedCard && (
        <div className="modal" onClick={() => setSelectedCard(null)}>
          <div className="modal-content">
            <div className="pokemon-card large">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedCard.id}.png`}
                alt={selectedCard.name}
              />
              <p>#{selectedCard.id} {selectedCard.name.charAt(0).toUpperCase() + selectedCard.name.slice(1)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
