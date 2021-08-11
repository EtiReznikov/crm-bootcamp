<?php
require_once('controller.php');

class payments extends controller
{

    public $model_cls = "payments";
    public function __construct()
    {
        parent::__construct();
    }

    
    public function getPaymentsByClient()
    {
        $clientId = $this->data->clientId;
        $payments = $this->model->getPaymentsByClientId($clientId);
        $this->response["payments"] = $payments;
        return $payments;
    }
   
}
