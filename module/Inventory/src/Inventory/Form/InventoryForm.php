<?php

namespace Inventory\Form;

use Zend\Form\Form;

class InventoryForm extends Form {

     public function __construct($name = null) {
         
         parent::__construct('inventory');

         $this->add(array(
             'name' => 'session_id',
             'type' => 'Hidden',
         ));

         $this->add(array(
             'name' => 'room_name',
             'type' => 'Text',
             'options' => array(
                 'label' => 'Room name',
             ),
         ));

         $this->add(array(
             'name' => 'room_type',
             'type' => 'Text',
             'options' => array(
                 'label' => 'Room type',
             ),
         ));

         $this->add(array(
             'name' => 'submit',
             'type' => 'Submit',
             'attributes' => array(
                 'value' => 'Go',
                 'session_id' => 'submitbutton',
             ),
         ));
     }
 }