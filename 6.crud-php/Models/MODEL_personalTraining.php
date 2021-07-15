<?php

require_once("Model.php");

class Model_personalTraining extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function addNewPersonalTraining($user_id, $client_id, $date, $business_id)
    {
        //prevent mysql injection
        $user_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $user_id);
        $client_id = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $client_id);
      
        $addPersonalTraining  =  $this->getDB()
            ->query("INSERT INTO personal_trainings (user_id, client_id, date, gym_id) VALUES ('$user_id', '$client_id', '$date', '$business_id')");
        if ($addPersonalTraining ) {
            return $addPersonalTraining ;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function getAllPersonalTrainings($gymId)
    {
        //* TODO sql injection prevent
        $trainings = $this->getDB()
            ->query("SELECT clients.client_id, clients.client_name, users.user_id, users.user_name, personal_trainings.date
            FROM  personal_trainings JOIN users ON  users.user_id = personal_trainings.user_id JOIN
            clients ON clients.client_id = personal_trainings.client_id
            WHERE personal_trainings.gym_id='$gymId'")
            ->fetch_all(MYSQLI_ASSOC);

        return $trainings;
    }


}
