<?php

namespace Inventory\Model;

use Zend\Db\TableGateway\TableGateway;
 
class SessionOnlineTable {
     
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
        $this->tableGateway = $tableGateway;
    }
    public function fetchAll() {
    	$resultSet = $this->tableGateway->select();
    	return $resultSet;
    }
    
    public function save($data) {
    	$this->tableGateway->insert($data);
    	return $this->tableGateway->getLastInsertValue();
    }
    public function checkOnline($session_id) {
    	return $this->tableGateway->select(array('session_id' => $session_id));
    }
    public function update($data,$session_id) {
    	$this->tableGateway->update($data,array('session_id' => $session_id));
    }
    public function deleteBySession($session_id) {
    	$this->tableGateway->delete(array('session_id' => $session_id));
    }
    public function delete($id) {
    	  $this->tableGateway->delete(array('id' =>  $id));
    }
}