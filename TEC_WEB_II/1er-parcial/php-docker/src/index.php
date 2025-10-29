<?php
echo "Hola , Mundo desde Docker ! <br>";
echo " Fecha y hora del servidor : " . date('Y-m-d H:i:s') . "<br>";

try {
    $pdo = new PDO('mysql:host=mysql-server;dbname=prueba', 'root', 'root');
    echo " Conexión a MySQL exitosa <br>";
} catch (PDOException $e) {
    echo " Error de conexión : " . $e->getMessage() . "<br>";
}
?>
