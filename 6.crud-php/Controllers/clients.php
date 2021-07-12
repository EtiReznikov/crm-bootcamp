<?php 
require_once('controller.php');

class clients extends controller
{

    public $model_cls = "clients";
    public function __construct()
    {
        parent::__construct();
    }


    public function getClients()
    {      
        $gym_id = $this->data->business_id;
        $clients = $this->model->getAllClients($gym_id);
        $this->response["clients"] = $clients;
        return $clients;
    }


    public function addClient()
    {      
        $gymId = $this->data->business_id;
        $name = $this->data->name;
        $phone= $this->data->phone;
        $selectedPackage= $this->data->selectedPackage;
        $addClient = $this->model->addNewClient($gymId, $name, $phone, $selectedPackage);
        if ($addClient){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }

    public function editClientData(){
        $clientId = $this->data->clientId;
        $clientName = $this->data->clientName;
        $clientPhone= $this->data->clientPhone;
        $selectedPackage= $this->data->selectedPackage;


        $editClient = $this->model->editClient($clientId, $clientName, $clientPhone, $selectedPackage);
        if ($editClient){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
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
