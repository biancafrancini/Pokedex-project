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
      console.log(visibleData.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPokemon = async () => {
    const response = await axios.post(`http://localhost:3001/pokemons`, {
      id: visibleData.id,
      name: visibleData.name,
      image: visibleData.image,
    });

    const newPokemon = JSON.parse(response.config.data);

    setPokemonCart([...pokemonCart, newPokemon]);
    //console.log(newPokemon);
    setInputPokemon("");
  };

  const handleDeletePokemon = async (id) => {

    const startedIndex = pokemonCart.findIndex((pokemon) => pokemon.id !== id);
    const newPokemonCart = [...pokemonCart].splice(1, startedIndex);

    setPokemonCart(newPokemonCart);

    await axios.delete(`http://localhost:3001/pokemons/${id}`)
    //console.log(response.data)
  };

  return (
    <div className="inputContainer w-1/2 my-4 ml-2">
      <div className="flex">
        <input
          type="search"
          value={inputPokemon}
          placeholder="Search pokemons..."
          onChange={(e) => setInputPokemon(() => e.target.value)}
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
        <button
          type="submit"
          onClick={showPokemonCard}
          className="text-white mx-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>

      <div className="data-container">
        <div className="empty-div"></div>
        {visibleData && (
          <div className="flex place-items-center m-8">
            <span>{visibleData.name}</span>
            <img className="mx-4" src={visibleData.image} alt="pokemon pic" />
            <button type="submit" onClick={handleAddPokemon}>
              Add to your cart
            </button>
          </div>
        )}
        {/*!error && visibleData === undefined && <div>Sorry, this Pokemon is not available</div>*/}

        <div className="cart-container flex flex-col m-2">
          <h3 className="flex font-bold border border-4 rounded-lg border-red-500 w-fit p-4">
            Your Pokedex
            <img src={pokeball} alt="pokeball-icon" className="pokeball mx-2" />
          </h3>
          {pokemonCart.map((pokemon, index) => (
            <div key={index} className="flex items-center">
              <img src={pokemon.image} alt="pokemon saved pic" />
              <p>{pokemon.name}</p>
              <button
                type="delete"
                className="delete-pokemon-btn mx-4 p-2 border border-2 rounded-lg border-red-500"
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
