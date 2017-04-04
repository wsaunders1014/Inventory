<?php

namespace Inventory\Model;

use Zend\Db\TableGateway\TableGateway;

class ItemTable {
     
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll() {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getItem($item_id) {
         
        $item_id  = (int) $item_id;
        $rowset = $this->tableGateway->select(array('item_id' => $item_id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $item_id");
        }
        return $row;
    }     

    public function getItem_SC($sub_category){
        $sub_category  =  $sub_category;
        $item = array();
        $rowset = $this->tableGateway->select(array('sub_category' => $sub_category));
        foreach ($rowset as $row) {
            $item[] = $row->item;
        }
        if (!$row) {
            throw new \Exception("Could not find row $item_id");
        }
        return $item;
    }
}