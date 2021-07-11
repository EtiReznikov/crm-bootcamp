<?php

require_once("Model.php");

class Model_packages extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllCPackages($gymId)
    {
        //* TODO sql injection prevent
        $packages = $this->getDB()
            ->query("SELECT * FROM  packages WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
       
        return $packages;
    }

   public function addNewPackage($gymId, $name, $price, $selectedClasses )
   {
   
    $addPackage = $this->getDB()
    ->query("INSERT INTO packages (package_name,price, gym_id) VALUES ('$name', '$price', '$gymId')");
   if ( $addPackage){
       $lastId= mysqli_insert_id($this->getDB());
       foreach ($selectedClasses as $class){
        $addClassToPackage = $this->getDB()
        ->query("INSERT INTO package_classes (package_id,class_id) VALUES ('$lastId', '$class->value')");
       }
   }
   return $addPackage;
   
   }
}
