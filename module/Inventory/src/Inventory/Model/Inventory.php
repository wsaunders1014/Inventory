<?php

namespace Inventory\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Inventory {

	public $id;
	public $session_id;
    public $select_categories;
	public $large_items;
	public $add_boxes;
	public $review_inventory;
	public $completed;
	public $inventory_obj;
	public $email_address;
	public $updated;
	public $created;
	
	
	protected $inputFilter;

	public function exchangeArray($data){
		$this->id = (isset($data['id'])) ? $data['id'] : 0;
		$this->session_id = (isset($data['session_id'])) ? $data['session_id'] : null;
        $this->select_categories = (isset($data['select_categories'])) ? $data['select_categories'] : 0;
        $this->large_items = (isset($data['large_items'])) ? $data['large_items'] : 0;
		$this->add_boxes = (isset($data['add_boxes'])) ? $data['add_boxes'] : 0;
		$this->review_inventory = (isset($data['review_inventory'])) ? $data['review_inventory'] : 0;
		$this->completed = (isset($data['completed'])) ? $data['completed'] : 0;
		$this->inventory_obj = (isset($data['inventory_obj'])) ? $data['inventory_obj'] : null;
		$this->email_address = (isset($data['email_address'])) ? $data['email_address'] : null;
		$this->updated = (isset($data['updated'])) ? $data['updated'] : null;
		$this->created = (isset($data['created'])) ? $data['created'] : 0;
	}


	
}