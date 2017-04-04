<?php

namespace Inventory\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class SelectItem {

	public $id;
	public $session_id;
    public $room_id;
	public $item_id;
	public $unlisted_item_id;
	public $qty;
	public $final_item;
	public $full_name;
	public $total_items;
	
	protected $inputFilter;

	public function exchangeArray($data){
		$this->id = (isset($data['id'])) ? $data['id'] : null;
		$this->session_id = (isset($data['session_id'])) ? $data['session_id'] : null;
        $this->room_id = (isset($data['room_id'])) ? $data['room_id'] : 0;
        $this->unlisted_item_id = (isset($data['unlisted_item_id'])) ? $data['unlisted_item_id'] : 0;
		$this->item_id = (isset($data['item_id'])) ? $data['item_id'] : 0;
		$this->qty = (isset($data['qty'])) ? $data['qty'] : 0;
		$this->final_item = (isset($data['final_item'])) ? $data['final_item'] : null;
		$this->full_name = (isset($data['full_name'])) ? $data['full_name'] : null;
		$this->total_items = (isset($data['total_items'])) ? $data['total_items'] : 0;
	}


	
}