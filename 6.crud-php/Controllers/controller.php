<?php 

   
class controller
{
    public $response;
    public $errors = "";
    public $model;
    public $model_cls;
    public $data;


    public function __construct()
    {
        $model_class_name = "Model_" . $this->model_cls;
        require_once("./Models/$model_class_name.php");
        $this->model = new $model_class_name();


        $json = file_get_contents('php://input');
        $this->data = json_decode($json);
    }
}


?>