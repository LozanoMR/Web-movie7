document.addEventListener('DOMContentLoaded', () => {
    const adminMovieList = document.getElementById('admin-movie-list');
    const movieForm = document.getElementById('movie-form');
    const themeToggle = document.getElementById('theme-toggle');

    let movies = [];
    let editIndex = -1;

    // Load movies from JSON file
    fetch('get_movies.php')
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayAdminMovies();
        })
        .catch(error => console.error('Error al cargar las películas:', error));

    // Display movies on admin.html
    function displayAdminMovies() {
        if (adminMovieList) {
            adminMovieList.innerHTML = '';
            movies.forEach((movie, index) => {
                const movieItem = document.createElement('div');
                movieItem.className = 'movie-item';
                movieItem.innerHTML = `
                    <img src="${movie.image}" alt="${movie.name}">
                    <p>${movie.name}</p>
                    <p><a href="${movie.link}" target="_blank">${movie.link}</a></p>
                    <button onclick="editMovie(${index})">Editar</button>
                    <button onclick="deleteMovie(${index})">Eliminar</button>
                `;
                adminMovieList.appendChild(movieItem);
            });
        }
    }

    // Add or edit movie
    movieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('movie-name').value;
        const image = document.getElementById('movie-image').value;
        const link = document.getElementById('movie-link').value;

        const newMovie = { name, image, link };

        if (editIndex === -1) {
            // Add new movie
            fetch('add_movie.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMovie)
            })
            .then(response => response.json())
            .then(data => {
                movies = data;
                displayAdminMovies();
                movieForm.reset();
            })
            .catch(error => console.error('Error al agregar la película:', error));
        } else {
            // Edit existing movie
            movies[editIndex] = newMovie;
            fetch('edit_movie.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index: editIndex, movie: newMovie })
            })
            .then(response => response.json())
            .then(data => {
                movies = data;
                displayAdminMovies();
                movieForm.reset();
                editIndex = -1;
            })
            .catch(error => console.error('Error al editar la película:', error));
        }
    });

    // Edit movie
    window.editMovie = (index) => {
        editIndex = index;
        const movie = movies[index];
        document.getElementById('movie-name').value = movie.name;
        document.getElementById('movie-image').value = movie.image;
        document.getElementById('movie-link').value = movie.link;
    };

    // Delete movie
    window.deleteMovie = (index) => {
        fetch(`delete_movie.php?index=${index}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            movies = data;
            displayAdminMovies();
        })
        .catch(error => console.error('Error al eliminar la película:', error));
    };

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
