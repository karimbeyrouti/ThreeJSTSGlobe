<?php

    $long       = $_POST['long'];
    $lat        = $_POST['lat'];
    $country    = $_POST['country'];
    $city       = $_POST['city'];

    if( strpos(file_get_contents("data.txt"),'|' . $country. '|' . $city . "\n") !== false) {
        //IT DOES CONTAIN THAT CITY ALREADY
    } else {

        if( isset( $long )) {

            $myFile     = "data.txt";
            $fh         = fopen($myFile, 'a') or die("can't open file");
            $stringData = $long . '|' . $lat. '|' . $country . '|' . $city . "\n";

            fwrite($fh, $stringData);
            fclose($fh);

        }

    }

    if( isset( $long )) {

        $myFile     = "data_all.txt";
        $fh         = fopen($myFile, 'a') or die("can't open file");
        $stringData = $long . '|' . $lat. '|' . $country . '|' . $city . "\n";

        fwrite($fh, $stringData);
        fclose($fh);

    }



?>