<?php

require_once("Model.php");

class Model_clients extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllClients($gym_id)
    {
        //* TODO sql injection prevent
        $clients = $this->getDB()
            ->query("SELECT * FROM  clients WHERE gym_id=$gym_id")
            ->fetch_all(MYSQLI_ASSOC);
        return $clients;
    }

    public function addNewClient($gym_id, $name, $phone)
    {
        $addClient  =  $this->getDB()
            ->query("INSERT INTO client (client_name,client_phone, gym_id) VALUES ('$name', '$phone', '$gym_id')");
        return $addClient;
    }
}
