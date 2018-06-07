<?php require_once("./db_connection.php"); ?>
<?php

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH,PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");

    $id = $_POST['id'];
    $table = $_POST['table'];
    $from= $_POST['from'];
    $to = $_POST['to'];
    $sql = "SELECT * FROM $table WHERE DeviceID in ('$id') AND date BETWEEN '$from' AND '$to' ORDER BY SrNo ASC";
    $result = $conn->query($sql);
    if($result->num_rows>0){
        $all_rows = array();        
        while($row = $result->fetch_assoc()){
            $row['Total_Volume_Dispensed']=$row['Total_Volume_Dispensed']/1000;
            $all_rows[]=$row;
}   
} 
        
    echo  json_encode($all_rows);
    $conn->close();

?>