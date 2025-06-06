import React, { useState, useEffect, useRef } from 'react';
import Search from './components/Search';
import MovieCard from './components/MovieCard';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use useRef to persist debounce timer across renders
  const debounceTimeout = useRef(null);

  // Default movies to show when no search is performed
  const defaultMovies = [
    'Inception', 'The Dark Knight', 'Pulp Fiction', 'The Godfather',
    'Interstellar', 'Fight Club', 'The Matrix', 'Goodfellas'
  ];

  const fetchMovies = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=1`);
      const data = await response.json();

      if (data.Response === 'True' && Array.isArray(data.Search)) {
        setMovies(data.Search.slice(0, 8));
        setErrorMessage('');
      } else {
        setMovies([]);
        setErrorMessage(data.Error || 'No movies found.');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch movies. Please try again later.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDefaultMovies = async () => {
    setIsLoading(true);
    try {
      const moviePromises = defaultMovies.map(async (title) => {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
      });

      const results = await Promise.all(moviePromises);
      const validMovies = results.filter(movie => movie !== null);
      
      setMovies(validMovies);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to load default movies.');
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Clear previous debounce timer
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // If search term is empty or less than 3 chars, show default movies
    if (searchTerm.trim().length === 0) {
      fetchDefaultMovies();
      return;
    }

    if (searchTerm.trim().length < 3) {
      setMovies([]);
      setErrorMessage('Please enter at least 3 characters to search.');
      return;
    }

    // Set debounce timer for search
    debounceTimeout.current = setTimeout(() => {
      fetchMovies(searchTerm.trim());
    }, 500);

    // Cleanup function
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm]);

  // Load default movies on initial mount
  useEffect(() => {
    fetchDefaultMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Background" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>{searchTerm.trim() ? 'Search Results' : 'Featured Movies'}</h2>
          {isLoading && <p className="text-blue-500">Loading movies...</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <ul className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default App;