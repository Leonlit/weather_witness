<?php
    try{
        if (!isset($_GET["city"])){
            throw new Exception();
        }
        $param = filter_var($_GET["city"], FILTER_SANITIZE_STRING);
        if (strlen($param) > 2){
            try {                
                $file = fopen("cityObject.txt","r");

                while(! feof($file)) {
                    $content = fgets($file);
                    $line = explode(",", $content);
                }
                fclose($file);
            } catch (Exception $ex) {
                http_response_code(500);
            }
            $found = [];
            foreach ($line as $city) {
                if (stripos($city, $param)) {
                    array_push($found, $city);
                }
            }
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode($found);
        }else {
            throw new Exception();
        }
    }catch(Exception $ex){
        http_response_code(422);
    }
?>