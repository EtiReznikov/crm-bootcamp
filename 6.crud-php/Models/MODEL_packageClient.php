<?php

require_once("Model.php");

class Model_packageClient extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getPackage($client_id)
    {
        $client_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $client_id);
        $classes = $this->getDB()
            ->query("SELECT clients.client_id, package_client.package_id , packages.package_name
                FROM  clients JOIN package_client  ON clients.client_id= package_client.client_id
                LEFT JOIN packages on  package_client.package_id = packages.package_id 
                WHERE clients.client_id=$client_id")
            ->fetch_all(MYSQLI_ASSOC);
        if ($classes) {
            return $classes;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function addNewPackageSell($packageId, $clientId, $startDate, $endDate,  $totalPrice, $transaction, $createTime)
    {

        $packageId= preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $packageId);
        $clientId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientId);

        $packageSell = $this->getDB()
            ->query("INSERT INTO package_client (package_id,client_id, start_date, end_date, total_price) VALUES ('$packageId' , '$clientId', '$startDate','$endDate', '$totalPrice')");

        if ($packageSell) {
            $package_client_id = $this->getDB()->insert_id;
            $transactionInsert = $this->getDB()
                ->query("INSERT INTO transactions  ( sell_id  , transaction, date, type) VALUES ('$package_client_id' , '$transaction', '$createTime', 'package')");
                if ($transactionInsert) {
                    return $transactionInsert;
                } else {
                    return  $this->getDB()->error;
                }
        }
        else{
            return  $this->getDB()->error;
        }
    }
}
