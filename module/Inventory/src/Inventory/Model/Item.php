<?php

namespace Inventory\Model;

class Item {
	public $item_id;
    public $category;
    public $sub_category;
    public $item;
    public $sub_item;
    public $final_item;
    public $cf;
    public $lbs;

    public function exchangeArray($data) {

        $this->item_id     = (!empty($data['item_id'])) ? $data['item_id'] : null;
        $this->category = (!empty($data['category'])) ? $data['category'] : null;
        $this->sub_category  = (!empty($data['sub_category'])) ? $data['sub_category'] : null;
        $this->item     = (!empty($data['item'])) ? $data['item'] : null;
        $this->sub_item    = (!empty($data['sub_item'])) ? $data['sub_item'] : null;
        $this->final_item     = (!empty($data['final_item'])) ? $data['final_item'] : null;
        $this->cf     = (!empty($data['cf'])) ? $data['cf'] : null;
        $this->lbs     = (!empty($data['lbs'])) ? $data['lbs'] : null;
    }
}