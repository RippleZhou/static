<?php

/**
 * Created by PhpStorm.
 * User: chep
 * Date: 2016/5/17 0017
 * Time: 15:42
 */
class ServiceDetail
{
    public $id;
    public $name;
    public $desc;
    public $pcode;

    /**
     * ServiceDetail constructor.
     * @param $name
     * @param $desc
     * @param $pcode
     */
    public function __construct($id, $name, $desc, $pcode)
    {
        $this->id = $id;
        $this->name = $name;
        $this->desc = $desc;
        $this->pcode = $pcode;
    }


    


}