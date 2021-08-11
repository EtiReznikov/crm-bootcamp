<?php
require_once('controller.php');

class personalTraining extends controller
{

    public $model_cls = "personalTraining";
    public function __construct()
    {
        parent::__construct();
    }

    public function addPersonalTraining()
    {

        $user_id = $this->data->userId;
        $client_id = $this->data->clientId;
        $date = $this->data->date;
        $business_id = $this->data->business_id;
        $price = $this->data->totalPrice;
        $transaction = $this->data->transaction;
        $createTime = $this->data->createTime;
        $addPersonalTraining = $this->model->addNewPersonalTraining($user_id, $client_id, $date, $business_id, $price, $transaction, $createTime);
        if ($addPersonalTraining) {
            return true;
        } else {
            throw new Exception('DB error');
        }
    }

    public function getPersonalTraining()
    {
        $gym_id = $this->data->business_id;
        $trainings = $this->model->getAllPersonalTrainings($gym_id);
        $this->response["trainings"] = $trainings;
        return $trainings;
    }

    public function getPersonalTrainingByUser()
    {
        $user_id = $this->data->userId;
        $startLimit = $this->data->startLimit;
        $numOfRows = $this->data->numOfRows;
        $trainings = $this->model->getPersonalTrainingsByUser($user_id, $startLimit, $numOfRows);
        $this->response["trainings"] = $trainings;
        return $trainings;
    }
    public function editPersonalTrainingTime()
    {
        $training_id = $this->data->trainingId;
        $date = $this->data->date;
        $editTraining = $this->model->editTraining($training_id, $date);
        if ($editTraining) {
            return true;
        } else {
            throw new Exception('DB error');
        }
    }
}
