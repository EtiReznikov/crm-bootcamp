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

    public function addNewClient($gymId, $name, $phone)
    {
        $addClient  =  $this->getDB()
            ->query("INSERT INTO clients (client_name,client_phone, gym_id) VALUES ('$name', '$phone', '$gymId')");
        return $addClient;
    }

    public function removeClientById($clientId)
    {
        $removeClient  =  $this->getDB()
            ->query("DELETE FROM clients WHERE client_id=$clientId");
        return $removeClient;
    }

    public function editClient($clientId, $clientName, $clientPhone){
        $editClient = $this->getDB()
            ->query("UPDATE clients set client_name='$clientName', client_phone='$clientPhone' WHERE client_id=$clientId");
        return  $editClient;
    }
}
