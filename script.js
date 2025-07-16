const apiKey = "eb9593cc"; // OMDb API key

document.addEventListener("DOMContentLoaded", () => {
  fetchRandomMovies();
});

function toggleMenu() {
  const menu = document.getElementById("navMenu");
  menu.classList.toggle("show");
}

async function fetchRandomMovies() {
  const randomKeywords = ["love", "war", "action", "king", "hero"];
  const keyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${keyword}`);
  const data = await res.json();
  const container = document.getElementById("randomMovies");
  container.innerHTML = "";

  if (data.Response === "True") {
    data.Search.forEach(movie => {
      container.innerHTML += `
        <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
          <h4>${movie.Title}</h4>
        </div>
      `;
    });
  }
}

async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("movieResults");
  const randomSection = document.getElementById("randomMovies");
  const sectionTitle = document.getElementById("sectionTitle");

  resultsDiv.innerHTML = "";

  if (!query) {
    sectionTitle.innerText = "Trending Now";
    randomSection.style.display = "flex";
    resultsDiv.style.display = "none";
    fetchRandomMovies();
    return;
  }

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (data.Response === "False") {
    resultsDiv.innerHTML = `<p>${data.Error}</p>`;
    return;
  }

  resultsDiv.innerHTML = "";
  data.Search.forEach(movie => {
    resultsDiv.innerHTML += `
      <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
        <h4>${movie.Title}</h4>
        <p>${movie.Year}</p>
      </div>
    `;
  });

  sectionTitle.innerText = `Search Results for "${query}"`;
  resultsDiv.style.display = "flex";
  randomSection.style.display = "none";
}

async function fetchCategory(genre) {
  const resultsDiv = document.getElementById("movieResults");
  const randomSection = document.getElementById("randomMovies");
  const sectionTitle = document.getElementById("sectionTitle");

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${genre}`);
  const data = await res.json();

  resultsDiv.innerHTML = "";
  sectionTitle.innerText = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;

  if (data.Response === "True") {
    data.Search.forEach(movie => {
      resultsDiv.innerHTML += `
        <div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.Title}">
          <h4>${movie.Title}</h4>
          <p>${movie.Year}</p>
        </div>
      `;
    });
  } else {
    resultsDiv.innerHTML = `<p>No ${genre} movies found.</p>`;
  }

  resultsDiv.style.display = "flex";
  randomSection.style.display = "none";
}

async function showMovieDetails(imdbID) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`);
  const movie = await res.json();

  const modal = document.getElementById("movieModal");
  const content = document.getElementById("modalContent");

  content.innerHTML = `
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" style="max-width: 100%;" />
    <p><strong>Year:</strong> ${movie.Year}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("movieModal").classList.add("hidden");
}
function goHome() {
  const resultsDiv = document.getElementById("movieResults");
  const randomSection = document.getElementById("randomMovies");
  const sectionTitle = document.getElementById("sectionTitle");

  resultsDiv.innerHTML = "";
  sectionTitle.innerText = "Trending Now";
  randomSection.style.display = "flex";
  resultsDiv.style.display = "none";
  fetchRandomMovies(); // Reload trending movies
}
