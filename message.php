<?php
$postData = file_get_contents('php://input');
$postData = json_decode($postData, true);
$postData = [
    "model" => $postData['model'],
    "file" => new CURLFile($postData['file']),
    "response_format" => $postData['response_format'],
];
$ch = curl_init();
$OPENAI_API_KEY = "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";
$headers  = [
    'Accept: application/json',
    'Content-Type: multipart/form-data',
    'Authorization: Bearer ' . $OPENAI_API_KEY . ''
];

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/audio/transcriptions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

$result = curl_exec($ch);

if( isset( $result ) ) {
    $text = $result;
    $status = "success";
    $debug = "";
} elseif( isset( $result->error->message ) ) {
    $text = "The server returns an error message.".$complete->error->message;
    $status = "error";
    $debug = $postData;
} else {
    $text = "The server aborts or returns an exception message.";
    $status = "error";
    $debug = $postData;
}

echo json_encode( [
    "transcript" => $text,
    "debug" => $debug,
    "status" => $status,
 ] );

// $content2 = $_SERVER["REMOTE_ADDR"]." | ".date("Y-m-d H:i:s")."\n";
// $content2 .= "File:".$postData['file']."\nA:".$text."\n----------------\n";
// $myfile = fopen(__DIR__ . "/transcript.txt", "a") or die("Writing file failed.");
// fwrite($myfile, $content2);
// fclose($myfile);
?>
