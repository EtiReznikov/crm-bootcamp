<?php

require_once("Model.php");

class Model_classes extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllClasses($gymId)
    {
        //* TODO sql injection prevent
        $classes = $this->getDB()
            ->query("SELECT * FROM  classes WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        return $classes;
    }

    public function addNewClass($gymId, $className, $classDescription, $color)
    {
        $addClass  =  $this->getDB()
            ->query("INSERT INTO classes (class_name, description, color, gym_id) VALUES ('$className', '$classDescription', '$color', '$gymId')");
        return $addClass;
    }

    public function removeClassById($clientId)
    {
        // $removeClient  =  $this->getDB()
        //     ->query("DELETE FROM clients WHERE client_id=$clientId");
        // return $removeClient;
    }

    public function editClass($clientId, $clientName, $clientPhone){
        // $editClient = $this->getDB()
        //     ->query("UPDATE clients set client_name='$clientName', client_phone='$clientPhone' WHERE client_id=$clientId");
        // return  $editClient;
    }
}
