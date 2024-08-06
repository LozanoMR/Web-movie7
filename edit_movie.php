<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $index = $data['index'];
    $movie = $data['movie'];

    $json = file_get_contents('movies.json');
    $movies = json_decode($json, true);

    if (isset($movies[$index])) {
        $movies[$index] = $movie;
        file_put_contents('movies.json', json_encode($movies));
        echo json_encode($movies);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Película no encontrada"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Método no permitido"]);
}
?>
