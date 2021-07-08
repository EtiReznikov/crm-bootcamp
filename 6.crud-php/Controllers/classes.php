<?php 
require_once('controller.php');

class classes extends controller
{

    public $model_cls = "classes";
    public function __construct()
    {
        parent::__construct();
    }


    public function getClasses()
    {      
        $gym_id = $this->data->business_id;
        $classes= $this->model->getAllClasses($gym_id);
        $this->response["classes"] = $classes;
        return $classes;
    }


    public function addClass()
    {      
        $gymId = $this->data->business_id;
        $className = $this->data->className;
        $classDescription = $this->data->classDescription;
        $color = $this->data->color;
        $addClass = $this->model->addNewClient($gymId, $className, $classDescription, $color);
        if ($addClass){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }

    public function editClassData(){
        // $clientId = $this->data->clientId;
        // $clientName = $this->data->clientName;
        // $clientPhone= $this->data->clientPhone;
       
        
      
        // $editClient = $this->model->editClient($clientId, $clientName, $clientPhone);
        // if ($editClient){
        //     return true;
        // }
        // else{
        //     throw new Exception('DB error');
        // }
         //*TODO add validation
    }

    public function removeClient(){
        $clientId=$this->data->clientId;
        $removeClient = $this->model->removeClientById($clientId);
        return $removeClient;
        //*TODO add validation
        if ($removeClient){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }
}
