<?php

namespace Inventory\Model;

class UnlistedItem {
	public $id;
    public $name;
    public $full_name;
    public $width;
    public $height;
    public $depth;
    public $measure_unit;
    
    public function exchangeArray($data) {

        $this->id     = (!empty($data['id'])) ? $data['id'] : null;
        $this->name = (!empty($data['name'])) ? $data['name'] : null;
        $this->full_name  = (!empty($data['full_name'])) ? $data['full_name'] : null;
        $this->width     = (!empty($data['width'])) ? $data['width'] : null;
        $this->height    = (!empty($data['height'])) ? $data['height'] : null;
        $this->depth     = (!empty($data['depth'])) ? $data['depth'] : null;
        $this->measure_unit     = (!empty($data['measure_unit'])) ? $data['measure_unit'] : null;
      
    }
}