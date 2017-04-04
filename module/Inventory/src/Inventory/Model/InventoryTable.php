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

class InventoryTable {
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
         $this->tableGateway = $tableGateway;
    }

    public function fetchAll() {
        $resultSet = $this->tableGateway->select();
        return $resultSet;
    }

    public function getInventory($id) {
        $id  = (int) $id;
        $rowset = $this->tableGateway->select(array('id' => $id));
        $row = $rowset->current();
        if (!$row) {
            throw new \Exception("Could not find row $session_id");
        }
        return $row;
    }
    
    public function getInventoryBySession($session_id) {
    	$where= new Where();
    	$where->equalTo('session_id',$session_id);
    	$select = new Select('inventory');
    	$select->where($where);
    	$rowset = $this->tableGateway->selectWith($select);
    	//$row = $rowset->current();
    	return $rowset;
    }
    
     
    public function update($data= array(), $id = null) {
    	
    	$this->tableGateway->update($data, array('session_id' => $id));
    }
    
   
    public function save($data) {
           $this->tableGateway->insert($data);
    }

    public function delete($session_id){
        $this->tableGateway->delete(array('session_id' =>  $session_id));
    }

   
}