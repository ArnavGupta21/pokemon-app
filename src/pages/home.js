import React from "react";
import Search from "../components/Search";
import PokemonData from "../components/PokemonData";
import { Spinner, Alert } from "react-bootstrap";

const spinnerStyle = {
  width: "8rem",
  height: "8rem",
  borderWidth: "1rem",
};

const spinnerWrapperStyle = {
  textAlign: "center",
  marginTop: "50px",
};

const baseUrl = "http://pokeapi.co/api/v2";
const query = {
  pokemon: "pokemon",
};

function fetchPokemon(pokemon) {
  return fetch(`${baseUrl}/${query.pokemon}/${pokemon}`);
}

export default function Home() {
  const [pokemon, setPokemon] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const getPokemon = async (query) => {
    setPokemon(null);
    if (!query) {
      setErrorMsg("You must enter a Pokemon");
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetchPokemon(query);
        const results = await response.json();
        console.log(results);
        setPokemon(results);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
        setErrorMsg("Pokemon not found.");
      }
    }, 2000);
  };

  return (
    <div>
      {error ? <Alert variant="danger">{errorMsg}</Alert> : null}

      <Search getPokemon={getPokemon} />

      {loading ? (
        <div style={spinnerWrapperStyle}>
          <Spinner style={spinnerStyle} animation="border" />
        </div>
      ) : null}
      {!loading && pokemon ? (
        <PokemonData
          name={pokemon.name}
          sprite={pokemon.sprites.front_default}
          abilities={pokemon.abilities}
          stats={pokemon.stats}
          types={pokemon.types}
        />
      ) : null}
    </div>
  );
}
