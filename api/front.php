<?php

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    exit;
}
$code = $_POST['mainCodeContent'];

$filename = 'editor-result.php';

$response = [];

if(is_writable($filename)){
    if(!$handle = fopen($filename, 'w')){
        $response['statusOpenFile'] = 'Can\'t open file (permisson denied)';
    } else {
        $response['statusOpenFile'] = 'Succesfull open file';
    }

    if(!fwrite($handle, $code)){
        $response['statusWriteFile'] = 'Can\'t write file';
    } else {
        $response['statusWriteFile'] = 'Succesfull write file';
    }

    $response['codeId'] = random_int(1000, 2200000);

    fclose($handle);
} else {
    $response['statusWriteable'] = 'FALSE';
}

header('content-type: application/json');
header("Access-Control-Allow-Origin: *");

echo json_encode($response);
