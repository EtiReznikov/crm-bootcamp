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
        $gym_id = $this->data->business_id;
        $name = $this->data->name;
        $phone= $this->data->phone;
        $addClient = $this->model->addNewClient($gym_id, $name, $phone);
        if ($addClient){
            return true;
        }
        else{
            throw new Exception('DB error');
        }
    }

    public function removeClient(){
        $client_id=$this->data->clientId;
        $removeClient = $this->model->removeClientById($client_id);
        return $removeClient;
        // if ($removeClient){
        //     return true;
        // }
        // else{
        //     throw new Exception('DB error');
        // }
    }
}
