<?php 
/* Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php

Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */
require_once dirname(__FILE__) . '/midtrans/Midtrans.php';

// SAMPLE REQUEST START HERE

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = '';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = true;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;

// Validasi input
if (empty($_POST['total']) || empty($_POST['items']) || empty($_POST['name']) || empty($_POST['alamat']) || empty($_POST['phone'])) {
    die("Input tidak lengkap.");
}

// Siapkan parameter untuk transaksi
$params = array(
    'transaction_details' => array(
        'order_id' => uniqid(), // Menggunakan uniqid() untuk order_id yang unik
        'gross_amount' => (float) $_POST['total'], // Pastikan gross_amount adalah float
    ),
    'item_details' => json_decode($_POST['items'], true), // Tambahkan koma di sini
    'customer_details' => array(
        'first_name' => $_POST['name'], 
        'alamat' => $_POST['alamat'],
        'phone' => $_POST['phone'],
    ),
);

// Mendapatkan Snap Token
$snapToken = \Midtrans\Snap::getSnapToken($params);
echo $snapToken;

?>