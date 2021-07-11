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

    public function addNewClass($gymId, $className, $classDescription, $color, $dayAndTime)
    {
        $addClass  =  $this->getDB()
            ->query("INSERT INTO classes (class_name, description, color, gym_id, days_and_time) VALUES ('$className', '$classDescription', '$color', '$gymId', '$dayAndTime')");
        return $addClass;
    }

    public function removeClassById($classId)
    {
        $removeClass  =  $this->getDB()
            ->query("DELETE FROM classes WHERE class_id=$classId");
        return $removeClass;
    }

    public function editClass($clientId, $clientName, $clientPhone){
        // $editClient = $this->getDB()
        //     ->query("UPDATE clients set client_name='$clientName', client_phone='$clientPhone' WHERE client_id=$clientId");
        // return  $editClient;
    }
}
