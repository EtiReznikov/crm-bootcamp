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

    public function editClass($classId, $className, $description, $color, $dayAndTime){
        $editClass = $this->getDB()
            ->query("UPDATE classes set class_name='$className', description='$description' , color='$color' ,days_and_time='$dayAndTime' WHERE class_id=$classId");
        return  $editClass;
    }
}
