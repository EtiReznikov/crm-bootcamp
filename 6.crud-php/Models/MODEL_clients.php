<?php

require_once("Model.php");

class Model_clients extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllClients($gymId)
    {
        //* TODO sql injection prevent
        $clients = $this->getDB()
            ->query("SELECT * FROM  clients WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        return $clients;
    }

    public function addNewClient($gymId, $name, $phone, $selectedPackage )
    {
        $addClient  =  $this->getDB()
            ->query("INSERT INTO clients (client_name,client_phone, gym_id) VALUES ('$name', '$phone', '$gymId')");
        if ($addClient) {
            $lastId = mysqli_insert_id($this->getDB());
            $addClassToPackage = $this->getDB()
                ->query("INSERT INTO package_client (package_id,client_id) VALUES ('$selectedPackage->value', '$lastId')");
        }
        return $addClient;
    }

    public function removeClientById($clientId)
    {
        $removeClient  =  $this->getDB()
            ->query("DELETE FROM clients WHERE client_id=$clientId");
        $removePackageClient  =  $this->getDB()
            ->query("DELETE FROM package_client WHERE client_id=$clientId");
        return ($removeClient && $removePackageClient);
    }

    public function editClient($clientId, $clientName, $clientPhone, $selectedPackage)
    {
        $editClient = $this->getDB()
            ->query("UPDATE clients set client_name='$clientName', client_phone='$clientPhone' WHERE client_id=$clientId");

        $removePackageClient  =  $this->getDB()
            ->query("DELETE FROM package_client WHERE client_id=$clientId");

        $addClassToPackage = $this->getDB()
            ->query("INSERT INTO package_client (package_id,client_id) VALUES ('$selectedPackage->value', '$clientId')");
        return  $editClient;
    }
}
