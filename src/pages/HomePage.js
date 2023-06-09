import axios from "axios";
import { useState } from "react";
import { Background } from "../components/Background";
import pokeball from "../images/pokeball.png";
import { SiPokemon } from "react-icons/si";
import { motion, useMotionValue, useTransform } from "framer-motion";

import "../styles/homepage.css";

export const HomePage = () => {
  const [inputPokemon, setInputPokemon] = useState("");
  const [visibleData, setVisibleData] = useState("");
  const [pokemonCart, setPokemonCart] = useState([]);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [-30, 30]);
  const rotateY = useTransform(x, [100, -100], [30, -30]);

  const showPokemonCard = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/pokemons/${inputPokemon}`
      );

      //console.log(response.data);
      setVisibleData(response.data);
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
      setVisibleData("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePokemon = async (id) => {
    try {
      const pokemonIndex = pokemonCart.findIndex(
        (pokemon) => pokemon.id === id
      );
      const _pokemonCart = [...pokemonCart];
      _pokemonCart.splice(pokemonIndex, 1);

      setPokemonCart(_pokemonCart);

      await axios.delete(`http://localhost:3001/pokemons/${id}`);
      //console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const animatedMenuOptions = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        delay: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };
  const dropdownMenu = () => {
    setIsMouseEntered(!isMouseEntered);
  };

  return (
    <div className="relative">
      <div className="cart-container absolute top-0 right-0 flex flex-col items-end">
        <motion.div
          onClick={dropdownMenu}
          className="dropdown-menu flex font-bold text-yellow-300 shadow shadow-yellow-200 p-4 px-8 m-2 rounded-lg"
        >
          <img src={pokeball} alt="pokeball-icon" className="pokeball mr-4" />
          <h3>Your Pokédex</h3>
        </motion.div>
        <motion.div
          initial="exit"
          animate={isMouseEntered ? "enter" : "exit"}
          variants={animatedMenuOptions}
          className="pokemonCart-container grid grid-cols-2 place-items-center rounded-md px-4"
        >
          {pokemonCart.map((pokemon, index) => (
            <div
              key={index}
              className="flex items-center border-b-2 border-gray-200 bg-gray-600 rounded-md px-4"
            >
              <img
                className="object-contain max-w-20 max-h-20 mr-2"
                src={pokemon.image}
                alt="pokemon saved pic"
              />
              <span className="flex flex-col items-start">
                <p className="font-bold py-2 text-yellow-500 text-xs">
                  {pokemon.name.toUpperCase()}
                </p>
                <button
                  type="delete"
                  className="delete-add-pokemon-btn text-xs font-bold rounded-xl p-1"
                  onClick={() => handleDeletePokemon(pokemon.id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="main-container grid grid-cols-1 place-items-center">
        <Background />
        <div className="mb-20 mt-24 mx-auto text-center max-w-full place-items-center">
          <SiPokemon color="yellow" size="20rem" />
        </div>
        <div className="grid grid-rows-2 max-w-full h-full place-items-center">
          <div className="flex justify-center w-full">
            <input
              type="search"
              value={inputPokemon}
              placeholder="Search pokemons..."
              onChange={(e) => setInputPokemon(() => e.target.value)}
              className="block w-full p-4 pl-10 text-sm text-gray-900 border rounded-lg bg-gray-300 focus:outline-none dark:bg-gray-500 dark:border-gray-800 dark:placeholder-gray-200 dark:text-white dark:focus:ring-yellow-800 dark:focus:border-yellow-500"
              required
            />
            <button
              type="submit"
              onClick={showPokemonCard}
              className="text-white mx-2 bg-red-400 hover:ring-4 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 border border-gray-800 dark:bg-red-600 dark:focus:ring-gray-600 dark:hover:ring-red-800"
            >
              Search
            </button>
          </div>
          <div className="empty-div h-52"></div>
          <div style={{ perspective: 2000 }}>
            <motion.div
              style={{ x, y, rotateX, rotateY, z: 100 }}
              drag
              dragElastic={0.18}
              dragConstrains={{ top: 0, left: 0, right: 0, bottom: 0 }}
              whileHover={{ cursor: "grabbing" }}
              className="data-container flex items-center h-52"
            >
              {visibleData && (
                <motion.div
                  whileHover={{ scaleZ: 1.2 }}
                  className="card max-w-sm bg-white p-8 border-2 border-red-200 rounded-lg shadow dark:bg-gray-700 dark:border-yellow-500"
                >
                  <img
                    className="rounded-lg bg-white w-full object-center"
                    src={visibleData.image}
                    alt="pokemon pic"
                  />
                  <div className="flex flex-col items-center">
                    <h3 className="p-5 my-6 text-lg font-bold text-center dark:text-yellow-200">
                      {visibleData.name.toUpperCase()}
                    </h3>
                    <button
                      type="submit"
                      className="delete-add-pokemon-btn font-bold text-gray-800 w-34 h-15 rounded-full p-2"
                      onClick={handleAddPokemon}
                    >
                      Add to Pokédex
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
