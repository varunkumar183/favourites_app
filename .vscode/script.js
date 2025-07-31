// script.js

const API_KEY = 'cff86bc5'; // <= Replace with your actual OMDb API Key before use
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const movieDetailsDiv = document.getElementById('movieDetails');

// Optionally, use a better quality placeholder (save it as "placeholder.jpg" in the project folder)
const PLACEHOLDER_IMG = 'placeholder.jpg';

// Search on button click
searchButton.addEventListener('click', () => {
    handleSearch();
});

// Search on pressing Enter
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    movieDetailsDiv.innerHTML = ''; // Clear details if new search
    if (!searchTerm) {
        resultsDiv.innerHTML = `<p>Please enter a movie title to search.</p>`;
        return;
    }
    searchMovies(searchTerm);
}

async function searchMovies(query) {
    resultsDiv.innerHTML = `<p>Loading...</p>`;
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        const data = await response.json();
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            resultsDiv.innerHTML = `<p>No movies found. Please try again.</p>`;
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        resultsDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
}

function displayMovies(movies) {
    resultsDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_IMG}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
        `;
        movieItem.addEventListener('click', () => fetchMovieDetails(movie.imdbID));
        resultsDiv.appendChild(movieItem);
    });
}

async function fetchMovieDetails(id) {
    movieDetailsDiv.innerHTML = `<p>Loading details...</p>`;
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
        const movie = await response.json();
        if (movie.Response === "True") {
            displayMovieDetails(movie);
        } else {
            movieDetailsDiv.innerHTML = `<p>Movie details not found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        movieDetailsDiv.innerHTML = `<p>Could not load movie details.</p>`;
    }
}

function displayMovieDetails(movie) {
    movieDetailsDiv.innerHTML = `
        <h2>${movie.Title}</h2>
        <p><strong>Genre:</strong> ${movie.Genre}</p>
        <p><strong>Director:</strong> ${movie.Director}</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
        <p><strong>Cast:</strong> ${movie.Actors}</p>
        <p><strong>Released:</strong> ${movie.Released}</p>
        <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
    `;
}
