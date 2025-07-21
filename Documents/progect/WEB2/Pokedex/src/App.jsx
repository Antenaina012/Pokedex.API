import { useEffect, useState } from 'react';
import image from '/src/wp3636965-removebg-preview.png';
import './App.css';
import img from '/src/assets/pokedex.png'

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isVisible, setIsVisible] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'; // par défaut dark
});
const [isRotating, setIsRotating] = useState(false);

const handleThemeClick = () => {
  toggleTheme(); // ton ancien comportement
  setIsRotating(true);
  setTimeout(() => setIsRotating(false), 1000);
};

  
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);};

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => setPokemonList(data.results))
      .catch((err) => console.error("Erreur:", err));

    // Charger tous les types (catégories)
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
              <img src={image} alt="Pokemon" />
            </li>
            <li>
            <img  src="public/pngwing.com.png"
                  onClick={handleThemeClick}
                  className={`theme-toggle-button ${isRotating ? 'rotate' : ''}`}
                />
              </li>

            <li>
            <img src={img} alt="pokedex" className='pokedex1'/> <h1 className='tittle'>wanna see some pokemon ?</h1>
            </li>
            <li>      <button onClick={toggleVisibility} className="toggle-button">
        {isVisible ? 'Hide' : 'Show'} pokemon </button></li>
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
          <div className={`content-box ${isVisible ? '' : 'hidden'}`}>
            {/* Sélecteur de type */}


          {/* Grille des Pokémon */}
          <div className="pokemon-grid">
            {pokemonList.map((pokemon, index) => {
              const id = pokemon.url
                ? pokemon.url.split("/")[6]
                : index + 1;
              return (
                <div key={index} className="pokemon-card">
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
    </div>
  );
}

export default App;
