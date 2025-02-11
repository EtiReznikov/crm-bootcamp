<?php

require_once("Model.php");

class Model_classes extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    //get all classes from my sql
    public function getAllClasses($gymId)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $classes = $this->getDB()
            ->query("SELECT * FROM  classes WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        if ($classes) {
            return $classes;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function getAllClassesWithTrainer($gymId)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $classes = $this->getDB()
            ->query("SELECT classes.*, users.user_name FROM  classes LEFT JOIN users on users.user_id = classes.trainer_id WHERE classes.gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        if ($classes) {
            return $classes;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function addNewClass($gymId, $className, $classDescription, $color, $dayAndTime, $location,  $trainer)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $className = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $className);
        $classDescription = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classDescription);
        $color = preg_replace('/[\x00-\x1F\x80-\xFF]/', '',  $color);
        $dayAndTime = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $dayAndTime);
        $addClass  =  $this->getDB()
            ->query("INSERT INTO classes (class_name, description, color, gym_id, days_and_time,  location, trainer_id) VALUES ('$className', '$classDescription', '$color', '$gymId', '$dayAndTime', '$location', '$trainer' )");
        if ($addClass) {
            return $addClass;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function removeClassById($classId)
    {
        //prevent mysql injection
        $classId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classId);

        $removeClass  =  $this->getDB()
            ->query("DELETE FROM classes WHERE class_id=$classId");
        if ($removeClass)
            return $removeClass;
        else
            return  $this->getDB()->error;
    }

    public function editClass($classId, $className, $description, $color, $dayAndTime, $location, $trainer)
    {
        //prevent mysql injection
        $classId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classId);
        $className = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $className);
        $description = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $description);
        $color = preg_replace('/[\x00-\x1F\x80-\xFF]/', '',  $color);
        $dayAndTime = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $dayAndTime);

        $editClass = $this->getDB()
            ->query("UPDATE classes set class_name='$className', description='$description' , color='$color' ,days_and_time='$dayAndTime', location='$location' , trainer_id='$trainer' WHERE class_id=$classId");
        if ($editClass) {
            return $editClass;
        } else {
            return $this->getDB()->error;
        }
    }

    public function getAllRegisters($gymId, $classId)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $classId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classId);
        $registers = $this->getDB()
            ->query("SELECT clients.client_name, clients.file FROM classes 
                    LEFT JOIN package_classes ON classes.class_id=package_classes.class_id 
                    LEFT JOIN package_client ON package_classes.package_id= package_client.package_id
                    LEFT JOIN clients on package_client.client_id = clients.client_id 
                    WHERE classes.class_id='$classId' AND classes.gym_id='$gymId'")
            ->fetch_all(MYSQLI_ASSOC);
        if ($registers) {
            return $registers;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function getTrainer($classId)
    {
        $classId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classId);
        $trainer = $this->getDB()
            ->query(
                "SELECT classes.class_id, users.user_id , users.user_name 
                FROM  classes 
                LEFT JOIN users ON classes.trainer_id = users.user_id  
                WHERE classes.class_id='$classId'"
            )
            ->fetch_all(MYSQLI_ASSOC);
        if ($trainer) {
            return  $trainer;
        } else {
            return  $this->getDB()->error;
        }
    }
}
