<?php

require_once("Model.php");

class Model_personalTraining extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function addNewPersonalTraining($user_id, $client_id, $date, $business_id, $price, $transaction, $createTime)
    {
        $date = new DateTime($date);

        date_modify($date, '+3 hours');
        $date = $date->format('Y-m-d H:i:s');
        //prevent mysql injection
        $user_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $user_id);
        $client_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $client_id);

        $addPersonalTraining  =  $this->getDB()
            ->query("INSERT INTO personal_trainings (user_id, client_id, date, price, gym_id) VALUES ('$user_id', '$client_id', '$date', $price, '$business_id') ");
        if ($addPersonalTraining) {
            $PersonalTraining_id = $this->getDB()->insert_id;
            $transactionInsert = $this->getDB()
                ->query("INSERT INTO transactions  ( sell_id , transaction, date, type) VALUES ('$PersonalTraining_id ', '$transaction', '$createTime', 'personalTraining')");
            return $transactionInsert;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function getAllPersonalTrainings($gymId)
    {
        $gymId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $gymId);
        $trainings = $this->getDB()
            ->query("SELECT clients.client_id, clients.client_name, users.user_id, users.user_name, personal_trainings.date
            FROM  personal_trainings JOIN users ON  users.user_id = personal_trainings.user_id JOIN
            clients ON clients.client_id = personal_trainings.client_id
            WHERE personal_trainings.gym_id='$gymId'")
            ->fetch_all(MYSQLI_ASSOC);

        return $trainings;
    }

    public function getPersonalTrainingsByUser($userId, $startLimit, $numOfRows)
    {
        $userId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $userId);
        $startLimit = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $startLimit);
        $trainings = $this->getDB()
            ->query("SELECT personal_trainings.personal_training_id, clients.client_name, personal_trainings.date  FROM personal_trainings JOIN clients ON personal_trainings.client_id = clients.client_id   WHERE date >= CURDATE() AND user_id='$userId' ORDER by date LIMIT $startLimit, $numOfRows ")
            ->fetch_all(MYSQLI_ASSOC);
        return $trainings;
    }

    public function editTraining($training_id, $date)
    {
        $date = new DateTime($date);
        date_modify($date, '+3 hours');
        $date = $date->format('Y-m-d H:i:s');
        $training_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $training_id);
        $editTraining = $this->getDB()
            ->query("UPDATE personal_trainings set date='$date' WHERE personal_training_id=$training_id");
        if ($editTraining) {
            return true;
        } else {
            return $this->getDB()->error;
        }
    }
}
