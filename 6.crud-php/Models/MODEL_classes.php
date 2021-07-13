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

    public function addNewClass($gymId, $className, $classDescription, $color, $dayAndTime)
    {
        //prevent mysql injection
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $className = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $className);
        $classDescription = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classDescription);
        $color = preg_replace('/[\x00-\x1F\x80-\xFF]/', '',  $color);
        $dayAndTime = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $dayAndTime);

        $addClass  =  $this->getDB()
            ->query("INSERT INTO classes (class_name, description, color, gym_id, days_and_time) VALUES ('$className', '$classDescription', '$color', '$gymId', '$dayAndTime')");
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

    public function editClass($classId, $className, $description, $color, $dayAndTime)
    {
        //prevent mysql injection
        $classId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $classId);
        $className = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $className);
        $description = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $description);
        $color = preg_replace('/[\x00-\x1F\x80-\xFF]/', '',  $color);
        $dayAndTime = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $dayAndTime);

        $editClass = $this->getDB()
            ->query("UPDATE classes set class_name='$className', description='$description' , color='$color' ,days_and_time='$dayAndTime' WHERE class_id=$classId");
        if ($editClass) {
            return $editClass;
        } else {
            return $this->getDB()->error;
        }
    }
}
