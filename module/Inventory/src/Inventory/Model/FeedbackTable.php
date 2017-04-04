<?php

namespace Inventory\Model;

use Zend\Db\TableGateway\TableGateway;
 
class FeedbackTable {
     
    protected $tableGateway;

    public function __construct(TableGateway $tableGateway) {
        $this->tableGateway = $tableGateway;
    }

    public function save($data) {
    	$this->tableGateway->insert($data);
    	return $this->tableGateway->getLastInsertValue();
    }
    
    public function delete($id) {
    	  $this->tableGateway->delete(array('id' =>  $id));
    }
}