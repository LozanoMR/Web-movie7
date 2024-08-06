<?php
    $moviesFile = 'movies.json';
    $movies = json_decode(file_get_contents($moviesFile), true);
    echo json_encode($movies);
?>
