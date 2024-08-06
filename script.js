document.addEventListener('DOMContentLoaded', () => {
    const movieList = document.getElementById('movie-list');
    const searchInput = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');

    let movies = [];

    // Load movies from JSON file
    fetch('get_movies.php')
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayMovies(movies);
        })
        .catch(error => console.error('Error al cargar las películas:', error));

    // Display movies on index.html
    function displayMovies(movies) {
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-item';
            movieItem.innerHTML = `
                <img src="${movie.image}" alt="${movie.name}">
                <p>${movie.name}</p>
            `;
            movieItem.addEventListener('click', () => {
                window.location.href = movie.link;
            });
            movieList.appendChild(movieItem);
        });
    }

    // Filter movies based on search input
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredMovies = movies.filter(movie => movie.name.toLowerCase().includes(searchTerm));
        displayMovies(filteredMovies);
    });

    // Handle theme toggle
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        document.cookie = `theme=${isDark ? 'dark' : 'light'}; path=/; max-age=31536000`;
        updateThemeToggleText(isDark);
    });

    // Load theme from cookie
    function loadThemeFromCookie() {
        const theme = getCookie('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        updateThemeToggleText(theme === 'dark');
    }

    // Update theme toggle button text
    function updateThemeToggleText(isDark) {
        themeToggle.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
    }

    // Get cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    loadThemeFromCookie();
});
