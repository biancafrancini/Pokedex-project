import axios from "axios";
import { useState } from "react";
import pokeball from "../images/pokeball.png";

export const HomePage = () => {
  const [inputPokemon, setInputPokemon] = useState("");
  const [visibleData, setVisibleData] = useState("");
  const [pokemonCart, setPokemonCart] = useState([]);
  const [error, setError] = useState(false);

  const showPokemonCard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/pokemons/${inputPokemon}`
      );
      setVisibleData(response.data);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  const handleAddPokemon = async () => {
    const response = await axios.post(`http://localhost:3001/pokemons`, {
        name: visibleData.name,
        image: visibleData.image,
      });

      const newPokemon= JSON.parse(response.config.data);

      setPokemonCart([
        ...pokemonCart,
        newPokemon,
      ]);
    console.log(response);
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
        {visibleData && (
          <div className="flex place-items-center m-8">
            <span>{visibleData.name}</span>
            <img className="mx-4" src={visibleData.image} alt="pokemon pic"></img>
            <button type="submit" onClick={handleAddPokemon}>
              Add to your cart
            </button>
          </div>
        )}
        {/*!error && visibleData === undefined && <div>Sorry, this Pokemon is not available</div>*/}

        <div className="cart-container flex flex-col">
            <h3 className="flex flex-col items-left">Your Pokedex <img src={pokeball} alt="pokeball-icon" className="w-1/5"></img></h3>
            {pokemonCart.map(creature => <div className="flex"><img src={creature.image} alt="pokemon saved pic"/> <p className="place-items-center">{creature.name}</p></div>)}
        </div>
      </div>
    </div>
  );
};
