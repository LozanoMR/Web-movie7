<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['index'])) {
    $index = (int) $_GET['index'];

    $json = file_get_contents('movies.json');
    $movies = json_decode($json, true);

    if (isset($movies[$index])) {
        array_splice($movies, $index, 1);
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
