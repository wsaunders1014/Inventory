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
use Zend\Db\Sql\Predicate\Expression as Exp;

class SelectItemTable {
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
         $this->tableGateway = $tableGateway;
    }

    public function fetchAll() {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getItem($id) {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $session_id");
        }
        return $row;
    }
    
    public function getItemBySession($session_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$select = new Select('select_item_table');
    	$select->where($where);
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
    
    public function countItems($session_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$select = new Select('select_item_table');
    	$select->columns(array('total_items' => new Exp('SUM(qty)')));
    	$select->where($where);
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
    public function getAllItemBySession($session_id) {
    	
    	$select = new Select('select_item_table');
    	$select->join('item_table',new Exp('item_table.item_id = select_item_table.item_id AND select_item_table.unlisted_item_id = 0'),array('final_item'),'LEFT');
    	$select->join('unlisted_items', new Exp('unlisted_items.id = select_item_table.unlisted_item_id AND select_item_table.item_id = 0'),array('full_name'),'LEFT');
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$select->where($where);
    	$select->order('id DESC');
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
    public function getItemsByRooms($session_id ,$room_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$where->equalTo('room_id',$room_id);
    	$select = new Select('select_item_table');
    	$select->where($where);
    	$select->order('item_num');
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
   
    public function isItemExist($session_id ,$room_id,$item_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$where->equalTo('item_id',$item_id);
    	$where->equalTo('room_id',$room_id);
    	$select = new Select('select_item_table');
    	$select->where($where);
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
     
    public function isUnlistedItemExist($session_id ,$room_id,$item_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$where->equalTo('item_id',0);
    	$where->equalTo('unlisted_item_id',$item_id);
    	$select = new Select('select_item_table');
    	$select->where($where);
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
     
    public function update($data= array(), $id = null) {
    	$this->tableGateway->update($data, array('id' => $id));
    }
    
   
    public function saveItem($data) {
           $this->tableGateway->insert($data);
    }

    public function deleteItem($session_id){
        $this->tableGateway->delete(array('session_id' => (int) $session_id));
    }

    public function deleteSelectItem($session_id,$room_id,$item_id){
        $this->tableGateway->delete(array('session_id'=>$session_id,'room_id' => $room_id,'item_id' =>  $item_id));
    }
    public function deleteUnlistedItem($session_id,$room_id,$item_id){
    	$this->tableGateway->delete(array('session_id'=>$session_id,'room_id' => $room_id,'unlisted_item_id' =>  $item_id));
    }
}