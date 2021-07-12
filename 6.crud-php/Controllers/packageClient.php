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


   
}
