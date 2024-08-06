<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $movie = json_decode(file_get_contents('php://input'), true);

    $json = file_get_contents('movies.json');
    $movies = json_decode($json, true);

    $movies[] = $movie;
    file_put_contents('movies.json', json_encode($movies));
    
    echo json_encode($movies);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
