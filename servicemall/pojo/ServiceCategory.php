<?php

/**
 * Created by PhpStorm.
 * User: chep
 * Date: 2016/5/17 0017
 * Time: 15:30
 */
class ServiceCategory
{
    public $id;
    public $cat;
    public $desc;
    public $services = array();
    public $type;

    /**
     * ServiceCategory constructor.
     * @param $cat
     * @param $desc
     * @param $services
     */
    public function __construct($id,$cat, $desc, $services, $type)
    {
        $this->id = $id;
        $this->cat = $cat;
        $this->desc = $desc;
        $this->services = $services;
        $this->type = $type;
    }

}