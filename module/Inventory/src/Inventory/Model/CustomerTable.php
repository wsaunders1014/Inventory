<?php

namespace Inventory\Model;

use Zend\Db\TableGateway\TableGateway;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Db\Adapter\Driver\ResultInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Predicate\Between;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Zend\Db\Sql\Delete;

class CustomerTable {
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
         $this->tableGateway = $tableGateway;
    }

    public function fetchAll() {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getInventory($session_id) {
        $session_id  = (int) $session_id;
        $rowset = $this->tableGateway->select(array('session_id' => $session_id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $session_id");
        }
        return $row;
    }
    public function getAllRooms($session_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$select = new Select('customer_table');
    	$select->where($where);
    	$select->order('item_num');
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
    
    
    
    public function getInventoryByItem($item_num=0) {
        $where= new Where();
        $where->equalTo('item_num',$item_num);
        $rowset = $this->tableGateway->select($where);
        $row = $rowset->current();
        return $row;
    }

    public function updateInventory($data= array(), $item_num = null) {
        if(!empty($data) && $item_num != null){
            $record = $this->getInventoryByItem($item_num);
            if($record){
                $this->tableGateway->update($data, array('item_num' => $item_num));
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    public function update($data= array(), $session_id = null, $item_num = null) {
    	$this->tableGateway->update($data, array('session_id' => $session_id,'item_num' => $item_num));
    }

    public function saveInventory (Inventory $inventory) {
        $data = array(
        	'session_id' => $inventory->session_id,
            'item_num' => $inventory->item_num,
            'room_name' => $inventory->room_name,
            'room_type'  => $inventory->room_type,
            'room_final_name' => $inventory->room_final_name,
            'total_room' => $inventory->total_room,
            'total_item' => $inventory->total_item,
        );

        $session_id = (int) $inventory->session_id;
        if ($session_id == null) {
            $this->tableGateway->insert($data);
        } else {
            if ($this->getInventory($session_id)) {
              	$this->tableGateway->update($data, array('session_id' => $session_id));
            } else {
                 throw new \Exception('Session id does not exist');
            }
        }
    }

    public function deleteInventory($session_id){
        $this->tableGateway->delete(array('session_id' => (int) $session_id));
    }

    public function deleteInventoryByItem($session_id,$item_num){
        $this->tableGateway->delete(array('session_id'=>$session_id,'item_num' =>  $item_num));
    }
}