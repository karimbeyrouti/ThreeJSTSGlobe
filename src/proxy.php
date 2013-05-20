<?php

$url = ($_POST['url']) ? $_POST['url'] : $_GET['url'];
echo( file_get_contents( $url ) );

?>