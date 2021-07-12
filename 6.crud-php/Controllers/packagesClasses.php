<?php 
require_once('controller.php');

class packagesClasses extends controller
{

    public $model_cls = "packagesClasses";
    public function __construct()
    {
        parent::__construct();
    }


    public function getClassesByPackage()
    {      
        $package_id = $this->data->package_id;
        $classes = $this->model->getClasses($package_id);
        $this->response["classes"] = $classes;
        return $classes;
    }


   
}
