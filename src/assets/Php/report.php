<?php require_once("./db_connection.php"); ?>
<?php require_once("./functions.php"); ?>
<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH,PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

    $id = $_POST['id'];
    $table = $_POST['table'];
    $from= $_POST['from'];
    $to = $_POST['to'];
    $id= str_replace(",","','",$id);
    $sql = "SELECT * FROM $table WHERE DeviceID in ('$id') AND date BETWEEN '$from' AND '$to' ORDER BY date, SrNo ASC";
    $result = $conn->query($sql);
    $all_rows = array();            
    if($result->num_rows>0){
        $all_rows = array();        
        while($row = $result->fetch_assoc()){
            array_walk($row,"unitConv") ;                      
            $all_rows[]=$row;
}   
} 
        
    echo  json_encode($all_rows);
    $conn->close();

?>
