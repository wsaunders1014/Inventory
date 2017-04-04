<?php

namespace Inventory\Model;

class SessionOnline {
	public $id;
    public $session_id;
    public $updated;
    public $created;

    
    public function exchangeArray($data) {

        $this->id     = (!empty($data['id'])) ? $data['id'] : null;
        $this->session_id = (!empty($data['session_id'])) ? $data['session_id'] : null;
        $this->updated  = (!empty($data['updated'])) ? $data['updated'] : null;
        $this->created     = (!empty($data['created'])) ? $data['created'] : null;
      
    }
}