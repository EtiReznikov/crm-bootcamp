<?php

require_once("Model.php");

class Model_payments extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    //get payments by client id from my sql
    public function getPaymentsByClientId($clientId)
    {
        //prevent mysql injection
        $clientId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $clientId);
        $payments = $this->getDB()
            ->query("SELECT package_client.client_id, transactions.date, package_client.total_price AS price,
                    transactions.type, package_client.start_date, package_client.end_date, packages.package_name  AS name
                    FROM transactions LEFT JOIN package_client ON package_client.id= transactions.sell_id 
                    LEFT join packages ON package_client.package_id=packages.package_id
                    WHERE type='package' AND package_client.client_id='$clientId' 
                    UNION
                    SELECT personal_trainings.client_id, transactions.date, personal_trainings.price, 
                    transactions.type , personal_trainings.date,  personal_trainings.date, users.user_name 
                    FROM transactions LEFT JOIN personal_trainings ON personal_trainings.personal_training_id= transactions.sell_id 
                    lEFT JOIN users ON personal_trainings.user_id=users.user_id
                    WHERE type='personalTraining' AND personal_trainings.client_id='$clientId'
                    ORDER BY date;
            ")
            ->fetch_all(MYSQLI_ASSOC);
        if ($payments) {
            return $payments;
        } else {
            return  $this->getDB()->error;
        }
    }

}
