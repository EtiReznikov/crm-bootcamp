<?php

require_once("Model.php");

class Model_packagesClasses extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getClasses($package_id)
    {

        $package_id= preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $package_id);
        $classes = $this->getDB()
            ->query("SELECT packages.package_id, package_classes.class_id , classes.class_name FROM  packages JOIN package_classes ON packages.package_id= package_classes.package_id LEFT JOIN classes on  package_classes.class_id = classes.class_id  WHERE packages.package_id=$package_id")
            ->fetch_all(MYSQLI_ASSOC);

        return $classes;
    }

}
