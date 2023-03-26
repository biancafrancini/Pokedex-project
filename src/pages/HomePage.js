import axios from "axios";
import { useState } from "react";
import pokeball from "../images/pokeball.png";

import "../styles/homepage.css";

export const HomePage = () => {
  const [inputPokemon, setInputPokemon] = useState("");
  const [visibleData, setVisibleData] = useState("");
  const [pokemonCart, setPokemonCart] = useState([]);

  const showPokemonCard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/pokemons/${inputPokemon}`
      );
      setVisibleData(response.data);
      //console.log(visibleData.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPokemon = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/pokemons`, {
      id: visibleData.id,
      name: visibleData.name,
      image: visibleData.image,
    });

    const newPokemon = JSON.parse(response.config.data);

    setPokemonCart([...pokemonCart, newPokemon]);
    //console.log(newPokemon);
    setInputPokemon("");

    } catch (error) {
      console.log(error);
    } 
  };

  const handleDeletePokemon = async (id) => {
    try {
      const pokemonIndex = pokemonCart.findIndex((pokemon) => pokemon.id === id);
      const _pokemonCart = [...pokemonCart]
      _pokemonCart.splice(pokemonIndex,1);

      setPokemonCart(_pokemonCart);

      await axios.delete(`http://localhost:3001/pokemons/${id}`)
      //console.log(response.data)

    } catch (error) {
      console.log(error)
    } 
  };

  return (
    <div className="inputContainer w-1/2 my-4 ml-2">
      <div className="flex">
        <input
          type="search"
          value={inputPokemon}
          placeholder="Search pokemons..."
          onChange={(e) => setInputPokemon(() => e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-red-300 rounded-lg bg-gray-300 focus:ring-red-500 focus:border-red-500 dark:bg-gray-500 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"
          required
        />
        <button
          type="submit"
          onClick={showPokemonCard}
          className="text-white mx-2 bg-red-400 hover:ring-4 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:focus:ring-red-700 dark:hover:ring-red-700"
        >
          Search
        </button>
      </div>
      <div className="data-container">
        {visibleData && (
          <div className="flex place-items-center m-8">
            <span>{visibleData.name}</span>
            <img className="mx-4" src={visibleData.image} alt="pokemon pic" />
            <button type="submit" className="delete-add-pokemon-btn" onClick={handleAddPokemon}>
              Add to your Pokédex
            </button>
          </div>
        )}
      <div className="empty-div"></div>
        <div className="cart-container flex flex-col m-2">
          <h3 className="flex font-bold border border-2 border-red-500 rounded-lg w-fit p-4 bg-gray-200">
            Your Pokédex
            <img src={pokeball} alt="pokeball-icon" className="pokeball mx-2" />
          </h3>
          {pokemonCart.map((pokemon, index) => (
            <div key={index} className="flex items-center">
              <img src={pokemon.image} alt="pokemon saved pic" />
              <p>{pokemon.name}</p>
              <button
                type="delete"
                className="delete-add-pokemon-btn"
                onClick={() => handleDeletePokemon(pokemon.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
