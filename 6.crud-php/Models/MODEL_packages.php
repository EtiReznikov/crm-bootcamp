<?php

require_once("Model.php");

class Model_packages extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getAllPackages($gymId)
    {
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $packages = $this->getDB()
            ->query("SELECT * FROM  packages WHERE gym_id=$gymId")
            ->fetch_all(MYSQLI_ASSOC);
        if ($packages) {
            return $packages;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function addNewPackage($gymId, $name, $price, $selectedClasses)
    {
          $addPackage = $this->getDB()
            ->query("INSERT INTO packages (package_name,price, gym_id) VALUES ('$name', '$price', '$gymId')");
        if ($addPackage) {
            $lastId = mysqli_insert_id($this->getDB());
            foreach ($selectedClasses as $class) {
                $addClassToPackage = $this->getDB()
                    ->query("INSERT INTO package_classes (package_id,class_id) VALUES ('$lastId', '$class->value')");
            }
        }
        return $addPackage;
    }
    public function removePackageById($packageId)
    {
        $removePackage  =  $this->getDB()
            ->query("DELETE FROM packages WHERE package_id=$packageId");
        $removePackageClasses  =  $this->getDB()
            ->query("DELETE FROM package_classes WHERE package_id=$packageId");
        return ($removePackage && $removePackageClasses);
    }

    public function editPackage($packageId, $name, $price, $selectedClasses)
    {
        $editPackage = $this->getDB()
            ->query("UPDATE packages set package_name='$name', price='$price' WHERE package_id=$packageId");

        $removePackageClasses  =  $this->getDB()
            ->query("DELETE FROM package_classes WHERE package_id=$packageId");

        // if ($editPackage & $removePackageClasses)
        foreach ($selectedClasses as $class) {
            $addClassToPackage = $this->getDB()
                ->query("INSERT INTO package_classes (package_id,class_id) VALUES ('$packageId', '$class->value')");
        }
        return ($editPackage & $removePackageClasses);
    }
}
