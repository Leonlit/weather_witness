<?php
    $param = $_GET["city"];
    if (strlen($param) > 2){
        $file = fopen("cityObject.txt","r");

        while(! feof($file)) {
            $content = fgets($file);
            $line = explode(",", $content);//.split(",");
        }
        fclose($file);

        $found = [];
        foreach ($line as $city) {
            if (stripos($city, $param)) {
                array_push($found, $city);
            }
        }
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode($found);
    }
?>