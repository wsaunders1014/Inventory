<?php

namespace Inventory\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Customer {

	public $id;
	public $session_id;
    public $item_num;
	public $room_name;
	public $room_type;
	public $room_final_name;
	public $total_room;
	public $total_item;
	protected $inputFilter;

	public function exchangeArray($data){
		$this->id = (!empty($data['id'])) ? $data['id'] : null;
		$this->session_id = (!empty($data['session_id'])) ? $data['session_id'] : null;
        $this->item_num = (!empty($data['item_num'])) ? $data['item_num'] : null;
		$this->room_name = (!empty($data['room_name'])) ? $data['room_name'] : null;
		$this->room_type = (!empty($data['room_type'])) ? $data['room_type'] : null;
		$this->room_final_name = (!empty($data['room_final_name'])) ? $data['room_final_name'] : null;
		$this->total_room = (!empty($data['total_room'])) ? $data['total_room'] : null;
		$this->total_item = (!empty($data['total_item'])) ? $data['total_item'] : null;
	}


	
}