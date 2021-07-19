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
        $location = $this->data->location;
        $addClass = $this->model->addNewClass($gymId, $className, $classDescription, $color, $dayAndTime, $location);
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
        $location = $this->data->location;
        $editClass = $this->model->editClass($classId, $className, $description, $color, $dayAndTime, $location);
        return $editClass;
    }

    //remove class post request
    public function removeClass()
    {
        $classId = $this->data->classId;
        $removeClass = $this->model->removeClassById($classId);
        return $removeClass;
    }

    public function getRegisterToClass(){
        $gymId = $this->data->business_id;
        $classId= $this->data->classId;
        $registers = $this->model->getAllRegisters($gymId, $classId);
        $this->response["registers"] = $registers;
        return $registers;
    }
}
