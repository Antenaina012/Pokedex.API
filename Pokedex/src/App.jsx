import { useEffect, useState } from 'react';
import image from '/src/wp3636965-removebg-preview.png';
import './App.css';
import img from '/src/assets/pokedex.png'
import { useRef } from "react";

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [flippingIndex, setFlippingIndex] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const typeScrollRef = useRef(null);



  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const handleWheelScroll = (e) => {
  if (!types || types.length === 0) return;
  if (e.deltaY > 0) {
    setSelectedTypeIndex((prev) => (prev + 1) % types.length);
  } else {
    setSelectedTypeIndex((prev) => (prev - 1 + types.length) % types.length);
  }
};



const handleCardClick = (pokemon) => {
  setSelectedCard(pokemon.id);        
  setPokemonDetails(pokemon);         
};

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
    
       fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0")
      .then((res) => res.json())
.then(async (data) => {
  const detailedList = await Promise.all(
    data.results.map(async (pokemon) => {
      const res = await fetch(pokemon.url);
      const details = await res.json();

      return {
        id: details.id,
        name: details.name,
        url: pokemon.url,
        image: details.sprites.other["official-artwork"].front_default,
        types: details.types,
        stats: details.stats,
        abilities: details.abilities,
      };
    })
  );
  setPokemonList(detailedList);
})

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
        <p> Touch Pokeball for theme</p>
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
                      <div
                ref={typeScrollRef}
                className="type-scroll"
                onWheel={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleWheelScroll(e);
                }}
              >
                {types.length > 0 && (
                  <div className="type-display">
                    {types[selectedTypeIndex]?.name?.charAt(0).toUpperCase() +
                      types[selectedTypeIndex]?.name?.slice(1)}
                  </div>
                )}
              </div>
        </div>
        

                  </div>


        <div className="content-box">
          <h2>
            <strong>
              List of pokemon :
            </strong>
          </h2>
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
                              setSelectedCard({ ...pokemon, id });
                              setFlippingIndex(null); 
                            }, 600); 
                        }}

                  >
                    <img src={pokemon.image} 
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

                          {pokemonDetails && pokemonDetails.stats && pokemonDetails.types ? (
                            <div className="card-info">
                              <p><strong>Type(s) :</strong> {pokemonDetails.types.map(t => t.type.name).join(', ')}</p>
                              <p><strong>HP :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'hp')?.base_stat}</p>
                              <p><strong>Attaque :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'attack')?.base_stat}</p>
                              <p><strong>Défense :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'defense')?.base_stat}</p>
                              <p><strong>Vitesse :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'speed')?.base_stat}</p>
                              <p><strong>Att. Spé :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'special-attack')?.base_stat}</p>
                              <p><strong>Déf. Spé :</strong> {pokemonDetails.stats.find(s => s.stat.name === 'special-defense')?.base_stat}</p>
                              <p><strong>Capacités :</strong> {pokemonDetails.abilities.map(a => a.ability.name).join(', ')}</p>

                            </div>
                          ) : (
                            <p style={{ textAlign: "center", padding: "1rem" }}>Chargement des détails...</p>
                          )}
                          
                  
                </div>

              </div>
            </div>
          
        )}

    </div>
  );
}

export default App;
