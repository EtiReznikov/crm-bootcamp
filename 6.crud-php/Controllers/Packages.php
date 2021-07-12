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

    public function editPackageData(){
        // $clientId = $this->data->clientId;
        // $clientName = $this->data->clientName;
        // $clientPhone= $this->data->clientPhone;
        $packageId = $this->data->packageId;
        $name = $this->data->name;
        $price = $this->data->price;
        $selectedClasses= $this->data->selectedClasses;
        
        $editPackage = $this->model->editPackage($packageId, $name, $price, $selectedClasses );
        if ($editPackage){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
         //*TODO add validation
    }

    public function removePackage(){
        $packageId=$this->data->packageId;
        $removePackage = $this->model->removePackageById($packageId);
        return $removePackage;
        //*TODO add validation
        if ($removePackage){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }
}
