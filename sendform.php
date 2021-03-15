<?php
$name = $_POST['name'];
$phone = $_POST['phone'];
$date = $_POST['date'];
$time = $_POST['time'];


$token = "1550791921:AAGdAtiCKyRdwMaCavWM9LkPbXRLEzyxZ2k";
$chat_id = "-385590912";
$sitename = "";

$arr = array(
    'Заказ с сайта: ' => $sitename,
    'Имя: ' => $name,
    'Телефон: ' => $phone,
    'Дата: ' => $date,
    'Время: ' => $time
);

foreach($arr as $key => $value) {
    $txt .= "<b>".$key."</b> ".$value."%0A";
}

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

?>

