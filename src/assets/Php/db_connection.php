<?php ob_start() ?>
<?php
    error_reporting(0);

	define("DB_SERVER", "localhost");
	define("DB_USER", "user");
	define("DB_PASS", "pass");
	define("DB_NAME", "dbname");
	


	// 1. Create a database connection
    $conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
	//Test if connection occured.
    if($conn->connect_error){
        die("Connection Failed : " . $conn->connect_error);
    }
?>
