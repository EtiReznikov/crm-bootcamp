<?php

require_once("Model.php");

class Model_dashboard extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    //get total payment at range of dates
    public function paymentsByDates($businessId, $startDate, $endDate)
    {
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $payments = $this->getDB()
            ->query("SELECT dateFormat, sum(TotalPayments.price) AS totalPayment FROM (
                SELECT DATE_FORMAT(transactions.date,'%d/%m/%Y')  AS dateFormat, package_client.total_price  AS price FROM transactions 
                                    INNER JOIN package_client
                                    ON package_client.id = transactions.sell_id
                                    LEFT JOIN packages
                                    ON  package_client.package_id = packages.package_id
                                    WHERE transactions.type= 'package' AND packages.gym_id='$businessId' AND (transactions.date BETWEEN str_to_date('$startDate','%d/%m/%Y') AND DATE_ADD(str_to_date('$endDate','%d/%m/%Y'), INTERVAL 1 DAY)) group by dateFormat
                                    UNION
                SELECT DATE_FORMAT(transactions.date,'%d/%m/%Y') AS dateFormat ,  sum(personal_trainings.price) AS price FROM transactions 
                                    INNER JOIN personal_trainings
                                    ON personal_trainings.personal_training_id = transactions.sell_id
                                    WHERE transactions.type='personalTraining' AND personal_trainings.gym_id='$businessId' AND (transactions.date BETWEEN str_to_date('$startDate','%d/%m/%Y') AND DATE_ADD(str_to_date('$endDate','%d/%m/%Y'), INTERVAL 1 DAY))group by dateFormat
                    ) as TotalPayments
                    GROUP BY dateFormat
                    ORDER BY dateFormat ")->fetch_all(MYSQLI_ASSOC);
        if ($payments) {
            return $payments;
        } else {
            return  $this->getDB()->error;
        }
    }


    public  function getPaymentsByDatesForPackages($businessId, $startDate, $endDate)
    {
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $payments = $this->getDB()
            ->query("SELECT DATE_FORMAT(transactions.date,'%d/%m/%Y') AS dateFormat, sum(package_client.total_price) AS price FROM transactions 
                    INNER JOIN package_client
                    ON package_client.id = transactions.sell_id
                    LEFT JOIN packages
                    ON  package_client.package_id = packages.package_id
                    WHERE transactions.type= 'package' AND packages.gym_id='$businessId' AND (transactions.date BETWEEN str_to_date('$startDate','%d/%m/%Y') AND DATE_ADD(str_to_date('$endDate','%d/%m/%Y'), INTERVAL 1 DAY))
                    GROUP BY dateFormat
                    ORDER By dateFormat")
            ->fetch_all(MYSQLI_ASSOC);
        if ($payments) {
            return $payments;
        } else {
            return  $this->getDB()->error;
        }
    }

    public  function getPaymentsByDatesForPersonalTraining($businessId, $startDate, $endDate)
    {
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $payments = $this->getDB()
            ->query("SELECT DATE_FORMAT(transactions.date,'%d/%m/%Y') AS dateFormat, sum(personal_trainings.price) AS price FROM transactions 
                    INNER JOIN personal_trainings
                    ON personal_trainings.personal_training_id = transactions.sell_id
                    WHERE transactions.type='personalTraining' AND personal_trainings.gym_id='$businessId' AND (transactions.date BETWEEN str_to_date('$startDate','%d/%m/%Y') AND DATE_ADD(str_to_date('$endDate','%d/%m/%Y'), INTERVAL 1 DAY))
                    GROUP BY dateFormat
                    ORDER By dateFormat")
            ->fetch_all(MYSQLI_ASSOC);
        if ($payments) {
            return $payments;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function getFiveLastSells($businessId)
    {
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $payments = $this->getDB()
            ->query("SELECT transactions.date , package_client.total_price 
                    AS price, transactions.type,
                    package_client.start_date, package_client.end_date, packages.package_name  AS name
                    FROM transactions 
                    INNER JOIN package_client
                    ON package_client.id = transactions.sell_id
                    LEFT JOIN packages
                    ON  package_client.package_id = packages.package_id
                    WHERE transactions.type= 'package' AND packages.gym_id='$businessId'
                    UNION   
                    SELECT transactions.date ,  personal_trainings.price AS price,
                    transactions.type , personal_trainings.date,  personal_trainings.date, users.user_name 
                    FROM transactions 
                    INNER JOIN personal_trainings
                    ON personal_trainings.personal_training_id = transactions.sell_id
                    LEFT JOIN users
                    ON personal_trainings.user_id = users.user_id
                    WHERE transactions.type='personalTraining' AND personal_trainings.gym_id='$businessId' 
	                ORDER by date DESC
                    LIMIT 5")->fetch_all(MYSQLI_ASSOC);
        if ($payments) {
            return $payments;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function countPersonalTrainingPerTrainer($businessId)
    {
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $count = $this->getDB()
            ->query("SELECT users.user_id, users.user_name, COUNT(personal_trainings.personal_training_id) AS count
                    FROM personal_trainings JOIN users
                    ON personal_trainings.user_id = users.user_id
                    WHERE personal_trainings.gym_id='$businessId' 
                    AND MONTH(date) = MONTH(CURRENT_DATE())
                    AND YEAR(date) = YEAR(CURRENT_DATE())
                    GROUP BY users.user_id")
            ->fetch_all(MYSQLI_ASSOC);
        if ($count) {
            return $count;
        } else {
            return  $this->getDB()->error;
        }
    }

    public function countPackages($businessId){
        $businessId = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $businessId);
        $count = $this->getDB()
            ->query("SELECT packages.package_id, packages.package_name, 
            COUNT(package_client.id) AS count FROM package_client
            JOIN packages ON package_client.package_id = packages.package_id
            WHERE packages.gym_id = $businessId
            GROUP BY packages.package_id;")
            ->fetch_all(MYSQLI_ASSOC);
        if ($count) {
            return $count;
        } else {
            return  $this->getDB()->error;
        }
    }
}
