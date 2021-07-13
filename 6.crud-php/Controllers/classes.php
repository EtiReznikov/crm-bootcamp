<?php
require_once('controller.php');

class classes extends controller
{

    public $model_cls = "classes";
    public function __construct()
    {
        parent::__construct();
    }

    //get all classes post request
    public function getClasses()
    {
        $gymId = $this->data->business_id;
        $classes = $this->model->getAllClasses($gymId);
        $this->response["classes"] = $classes;
        return $classes;
    }

    //add class post request
    public function addClass()
    {
        $gymId = $this->data->business_id;
        $className = $this->data->className;
        $classDescription = $this->data->classDescription;
        $color = $this->data->color;
        $dayAndTime = $this->data->dayAndTime;
        $addClass = $this->model->addNewClass($gymId, $className, $classDescription, $color, $dayAndTime);
        return $addClass;
    }

    //edit class post request
    public function editClassData()
    {
        $classId = $this->data->classId;
        $className = $this->data->className;
        $description = $this->data->classDescription;
        $color = $this->data->color;
        $dayAndTime = $this->data->dayAndTime;

        $editClass = $this->model->editClass($classId, $className, $description, $color, $dayAndTime);
        return $editClass;
    }

    //remove class post request
    public function removeClass()
    {
        $classId = $this->data->classId;
        $removeClass = $this->model->removeClassById($classId);
        return $removeClass;
    }
}
