<?php 
require_once('controller.php');

class packages extends controller
{

    public $model_cls = "packages";
    public function __construct()
    {
        parent::__construct();
    }


    public function getPackages()
    {      
        $gym_id = $this->data->business_id;
        $packages = $this->model->getAllPackages($gym_id);
        $this->response["packages"] = $packages;
        return $packages;
    }


    public function addPackage()
    {       
        $gymId = $this->data->business_id;
        $name = $this->data->name;
        $price= $this->data->price;
        $selectedClasses= $this->data->selectedClasses;
        $addPackage = $this->model->addNewPackage($gymId, $name, $price, $selectedClasses );
        if ($addPackage){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }

    // public function editClientData(){
    //     $clientId = $this->data->clientId;
    //     $clientName = $this->data->clientName;
    //     $clientPhone= $this->data->clientPhone;
       
        
      
    //     $editClient = $this->model->editClient($clientId, $clientName, $clientPhone);
    //     if ($editClient){
    //         return true;
    //     }
    //     else{
    //         throw new Exception('DB error');
    //     }
    //      //*TODO add validation
    // }

    // public function removeClient(){
    //     $clientId=$this->data->clientId;
    //     $removeClient = $this->model->removeClientById($clientId);
    //     return $removeClient;
    //     //*TODO add validation
    //     if ($removeClient){
    //         return true;
    //     }
    //     else{
    //         throw new Exception('DB error');
    //     }
    // }
}
