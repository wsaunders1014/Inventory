<?php

namespace Inventory\Model;

class Feedback {
	public $id;
    public $session_id;
    public $feedback;
    public $created;

    
    public function exchangeArray($data) {

        $this->id     = (!empty($data['id'])) ? $data['id'] : null;
        $this->name = (!empty($data['name'])) ? $data['name'] : null;
        $this->full_name  = (!empty($data['full_name'])) ? $data['full_name'] : null;
        $this->created     = (!empty($data['created'])) ? $data['created'] : null;
      
    }
}