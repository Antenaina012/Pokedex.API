import { useEffect, useState } from 'react';
import image from '/src/wp3636965-removebg-preview.png';
import './App.css';
import img from '/src/assets/pokedex.png';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [flippingIndex, setFlippingIndex] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);


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
      <div className={`bigContainer ${theme} ${isSearchFocused ? "blur-active" : ""}`}>
      <div>
        <ul className='nav_title'>
          <li>
            <img className='POKEMON' src={image} alt="Pokémon" />
          </li>


          <li>
            <img
              src="public/pngwing.com.png"
              onClick={handleThemeClick}
              className={`theme-toggle-button ${isRotating ? 'rotate' : ''}`}
            />
          </li>

        </ul>
                  <div className='filter-search'>
                    <input
                      type="text"
                      placeholder="Rechercher un Pokémon..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur(); 
                        }
                      }}
                      className={`search-bar ${isSearchFocused ? "expanded" : ""}`}
                    />
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

                  </div>


        <div className="content-box">
        <div className={`pokemon-grid ${theme}`}>
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
                    className={`pokemon-card ${flippingIndex === index ? 'card-flip' : ''}`}
                    onClick={() => {
                        setFlippingIndex(index); 
                            setTimeout(() => {
                              setSelectedCard({ name: pokemon.name, id });
                              setFlippingIndex(null); 
                            }, 600); 
                        }}

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

        {selectedCard && (
          <div
            className="modal"
            onClick={() => setSelectedCard(null)}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pokemon-card large">
                              <button
                className="close-button"
                onClick={() => setSelectedCard(null)}
              >
                ✖
              </button>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedCard.id}.png`}
                  alt={selectedCard.name}
                />
                <p>
                  #{selectedCard.id}{" "}
                  {selectedCard.name.charAt(0).toUpperCase() + selectedCard.name.slice(1)}
                </p>
              </div>
            </div>
          </div>
        )}

    </div>
  );
}

export default App;
