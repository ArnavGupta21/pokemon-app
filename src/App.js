import React, { useState, useEffect } from "react";
import Banner from "./Banner.png";
import "./App.css";

function App () {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Loading The Pokémons..");
  const itemsPerPage = 10;
  const totalPokemons = 720;

  useEffect(() => {
    const fetchPokemonData = async () => {
      const getPokemonDetails = async (id) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch Pokémon with ID: ${id}`);
          }
          const pokemonData = await response.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            cp: pokemonData.base_experience,
            attack: pokemonData.stats.find(
              (stat) => stat.stat.name === "attack"
            ).base_stat,
            defense: pokemonData.stats.find(
              (stat) => stat.stat.name === "defense"
            ).base_stat,
            type: pokemonData.types[0].type.name,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      };

      const fetchAllPokemonData = async () => {
        const allPokemonData = [];
        for (let id = 1; id <= totalPokemons; id++) {
          const pokemon = await getPokemonDetails(id);
          if (pokemon) {
            allPokemonData.push(pokemon);
          }
        }
        setPokemonList(allPokemonData);
        setTotalPages(Math.ceil(allPokemonData.length / itemsPerPage));
        setIsLoading(false);
      };

      fetchAllPokemonData();
    };

    fetchPokemonData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) => {
        if (prevText.endsWith("...")) {
          return "Loading The Pokémons..";
        } else {
          return prevText + ".";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (event) => {
    const inputValue = event.target.value.toLowerCase();
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const filteredPokemonList = pokemonList.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm) ||
      String(pokemon.id) === searchTerm
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPokemonList = filteredPokemonList.slice(startIndex, endIndex);

  const renderStatBar = (value, label) => {
    const maxStatValue = 400;
    const barWidth = (value / maxStatValue) * 100;

    return (
      <div className="pokemon-stat-bar">
        <div
          className="pokemon-stat-bar-fill"
          style={{ width: `${barWidth}%` }}
        >
          <span className="pokemon-stat-value">{value}</span>
        </div>
        <span className="pokemon-stat-label">{label}</span>
      </div>
    );
  };

  return (
    <div className="pokemon-app">
      <div className="pokemon-header">
        <img
          src={Banner}
          alt="Pokemon Logo"
          className="pokemon-logo"
        />
      </div>
      <div className="pokemon-search">
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pokemon"
          className="pokemon-input"
        />
        <button onClick={handleSearch} className="pokemon-button">
          ⌫
        </button>
      </div>
      {isLoading ? (
        <p>{loadingText}</p>
      ) : (
        <ul className="pokemon-list">
          {displayedPokemonList.map((pokemon) => (
            <li key={pokemon.id} className="pokemon-card">
              <h2 className="pokemon-name">{pokemon.name.toUpperCase()}</h2>
              <div className="pokemon-image-container">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
              </div>
              <p className="pokemon-type"><strong>Pokemon Type: </strong>{pokemon.type.toUpperCase()}</p>
              <br></br>
              <div className="pokemon-info">
                <strong>CP</strong>
                {renderStatBar(pokemon.cp, "")}
              </div>
              <div className="pokemon-info">
                <strong>Attack Power</strong>
                {renderStatBar(pokemon.attack, "")}
              </div>
              <div className="pokemon-info">
                <strong>Defense</strong>
                {renderStatBar(pokemon.defense, "")}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="pokemon-pagination">
        <button
          id="pokemon-pagination-previous"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </button>
        <span className="pokemon-pagination-text">
          Page {currentPage} of {totalPages}
        </span>
        <button
          id="pokemon-pagination-next"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;