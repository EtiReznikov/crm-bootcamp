<?php 
require_once('controller.php');

class packageClient extends controller
{

    public $model_cls = "packageClient";
    public function __construct()
    {
        parent::__construct();
    }


    public function getPackageByClient()
    {      
        $client_id= $this->data->client_id;
        $package = $this->model->getPackage($client_id);
        $this->response["package"] = $package;
        return $package;
    }

    public function addPackageSell()
    {
        $packageId= $this->data->packageId;
        $clientId= $this->data->clientId;
        $startDate= $this->data->startDate;
        $endDate= $this->data->endDate;
        $totalPrice= $this->data->totalPrice;
        $transaction= $this->data->transaction;
        $createTime= $this->data->createTime;
        $addPackageSell = $this->model->addNewPackageSell($packageId, $clientId, $startDate, $endDate,  $totalPrice, $transaction, $createTime);
        return $addPackageSell;
    }

   
}
