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
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $clients = $this->getDB()
            ->query("SELECT * FROM  clients WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        if ($clients) {
            return $clients;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function addNewClient($gymId, $name, $phone)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $name = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $name);
        $phone = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $phone);

        $addClient  =  $this->getDB()
            ->query("INSERT INTO clients (client_name,client_phone, gym_id) VALUES ('$name', '$phone', '$gymId')");
        if ($addClient) {
            return $addClient;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function removeClientById($clientId)
    {
        $clientId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientId);
        $removeClient  =  $this->getDB()
            ->query("DELETE FROM clients WHERE client_id=$clientId");
        if ($removeClient)
            return true;
        else
            return  $this->getDB()->error;
    }

    public function editClient($clientId, $clientName, $clientPhone)
    {
        //prevent mysql injection
        $clientId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientId);
        $clientName = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientName);
        $clientPhone = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientPhone);

        $editClient = $this->getDB()
            ->query("UPDATE clients set client_name='$clientName', client_phone='$clientPhone'  WHERE client_id=$clientId");

        if ($editClient ) {
            return true;
        } else {
            return $this->getDB()->error;
        }
    }
}
