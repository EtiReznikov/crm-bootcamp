<?php 
require_once('controller.php');

class dashboard extends controller
{

    public $model_cls = "dashboard";
    public function __construct()
    {
        parent::__construct();
    }


    public function getPaymentsByDates()
    {
        $businessId = $this->data->businessId;
        $startDate = $this->data->startDate;
        $endDate = $this->data->endDate;
        $payments = $this->model->paymentsByDates($businessId, $startDate, $endDate);
        $this->response["payments"] = $payments;
        return $payments;
    }

    public function getPaymentsByDatesForPackages()
    {
        $businessId = $this->data->businessId;
        $startDate = $this->data->startDate;
        $endDate = $this->data->endDate;
        $payments = $this->model->getPaymentsByDatesForPackages($businessId, $startDate, $endDate);
        $this->response["payments"] = $payments;
        return $payments;
    }

    public function getPaymentsByDatesForPersonalTraining(){
        $businessId = $this->data->businessId;
        $startDate = $this->data->startDate;
        $endDate = $this->data->endDate;
        $payments = $this->model->getPaymentsByDatesForPersonalTraining($businessId, $startDate, $endDate);
        $this->response["payments"] = $payments;
        return $payments;
    }

    public function getFiveLastSells(){
        $businessId = $this->data->businessId;
        $sells= $this->model->getFiveLastSells($businessId);
        $this->response["sells"] = $sells;
        return $sells;
    }
    public function countPersonalTrainingPerTrainer(){
        $businessId = $this->data->businessId;
        $count= $this->model->countPersonalTrainingPerTrainer($businessId);
        $this->response["count"] = $count;
        return $count;
    }

    public function countPackages(){
        $businessId = $this->data->businessId;
        $countPackages= $this->model->countPackages($businessId);
        $this->response["count"] = $countPackages;
        return $countPackages;
    }
}
