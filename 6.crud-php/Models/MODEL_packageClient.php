<?php

require_once("Model.php");

class Model_packageClient extends Model
{

    public function __construct()
    {
        parent::__construct();
    }

    public function getPackage($client_id)
    {
        //* TODO sql injection prevent
        $classes = $this->getDB()
            ->query("SELECT clients.client_id, package_client.package_id , packages.package_name
                FROM  clients JOIN package_client  ON clients.client_id= package_client.client_id
                LEFT JOIN packages on  package_client.package_id = packages.package_id 
                WHERE clients.client_id=$client_id")
                    ->fetch_all(MYSQLI_ASSOC);

        return $classes;
    }
}
