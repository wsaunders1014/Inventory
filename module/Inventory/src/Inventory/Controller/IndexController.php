<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2014 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Inventory\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;
use Zend\Session\Container;
use Equate\Service\Postmark;

class IndexController extends AbstractActionController
{
	protected $inventory_table;
	protected $customer_table;
	protected $select_item_table;
	protected $unlisted_item_table;
	protected $feedbackTable;
	protected $leadTable;
	protected $postmark_key = 'c6c42a28-e456-48b7-a997-6b5c479b51ab';
	protected $from_email = 'info@gotmovers.com';
	protected $confirmation_table;
	protected $session_online;
	
	public function getCustomerTable(){ 
		if($this->customer_table == null){
			$sl = $this->getServiceLocator();
			$this->customer_table = $sl->get('Inventory\Model\CustomerTable');
		}
		return $this->customer_table;
	}
	
	public function getSelectItemTable() {
		if($this->select_item_table == null){
			$sl = $this->getServiceLocator();
			$this->select_item_table = $sl->get('Inventory\Model\SelectItemTable');
		}
		return $this->select_item_table;
	}
	
	public function getUnlistedItemTable() {
		if($this->unlisted_item_table == null){
			$sl = $this->getServiceLocator();
			$this->unlisted_item_table = $sl->get('Inventory\Model\UnlistedItemTable');
		}
		return $this->unlisted_item_table;
	}
	
	public function getFeedbackTable() {
		if($this->feedbackTable == null){
			$sl = $this->getServiceLocator();
			$this->feedbackTable = $sl->get('Inventory\Model\FeedbackTable');
		}
		return $this->feedbackTable;
	}
	
	public function getInventory(){
		if($this->inventory_table == null){
			$sl = $this->getServiceLocator();
			$this->inventory_table = $sl->get('Inventory\Model\InventoryTable');
		}
		return $this->inventory_table;
	}
	
	public function getSessionOnline(){
		if($this->session_online == null){
			$sl = $this->getServiceLocator();
			$this->session_online = $sl->get('Inventory\Model\SessionOnlineTable');
		}
		return $this->session_online;
	}
	
	public function getLeadTable(){
		
		if($this->leadsTable == null){
			$sl = $this->getServiceLocator();
			$this->leadsTable = $sl->get('leads_table');
		}
		return $this->leadsTable;
	}
	
	public function getLeadsSubmissionsTable(){
		if($this->leadsSubmissionsTable == null){
			$sl = $this->getServiceLocator();
			$this->leadsSubmissionsTable = $sl->get('leads_submissions_table');
		}
		return $this->leadsSubmissionsTable;
	}
	
	public function getConfirmationTable(){
		if($this->confirmation_table == null){
			$sl = $this->getServiceLocator();
			$this->confirmation_table = $sl->get('confirmation_number');
		}
		return $this->confirmation_table;
	}
	
    public function indexAction()
    {
        return new ViewModel();
    }
	
	public function inventoryAction()
	{
		$this->layout('layout/inventory');
		$session = $this->getSession();
		$session_id = $session->getId();
		
		$rowset = $this->getLeadTable()->select(array('session_id'=> $this->session->getId()));
		
		$lead = $rowset->current();
		
		if(!$lead) {
			return $this->redirect()->toUrl('/MOVING_RATES');
		}
		// create record in inventory when its first time
		$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
		if($InventoryObj == false) {
			$InventoryData = array();
			$InventoryData['session_id'] = $session_id;
			$InventoryData['created'] = date('Y-m-d H:i:s');
			$this->getInventory()->save($InventoryData);
		}
	
		// Add session to check if user active or not
		$sessrow  = $this->getSessionOnline()->checkOnline($session_id)->current();
		if(empty($sessrow)) {
			$data = array();
			$time = date('Y-m-d H:i:s');
			$data['session_id'] = $session_id;
			$data['updated'] = $time;
			$data['created'] = $time;
			$this->getSessionOnline()->save($data);
		} else {
			$data = array();
			$time = date('Y-m-d H:i:s');
			$data['updated'] = $time;
			$this->getSessionOnline()->update($data,$session_id);
		}
		$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
// 		echo $session_id;
		//var_dump($InventoryObj);exit;
		return new ViewModel(
			array(
				'inventory' => $this->getInventory(),
			//	'all_rooms' => $all_rooms,
			//	'selectedItems' => $selectedItemArr,
				'lead' => $lead,
				'inventory' => $InventoryObj
			//	'room_size' =>$room_size,
			//	'confirm' => $confirm
			)
		);
	}
	
	public function confirmationAction()
	{
		$this->layout('layout/inventory');
		
		$session = $this->getSession();
		$session_id = $session->getId();
		$rowset = $this->getLeadTable()->select(array('session_id'=> $this->session->getId()));
		$lead = $rowset->current();
		$all_rooms = $this->getCustomerTable()->getAllRooms($session_id);
		
		$all_items = $this->getSelectItemTable()->countItems($session_id)->current();
		
		return new ViewModel(
			array(
				'inventory' => $this->getInventory(),
				'total_rooms' => $all_rooms->count(),
				'total_items' => $all_items->total_items,
				'lead' => $lead
			)
		);
	}
	
	public function searchAction()
	{
		$request= $this->getRequest();
		$inventoryTable= $this->getInventory();
		$term = $request->getPost('search_term');
		$list = $inventoryTable->getSearchInventory($term);
		$json= new JsonModel(array('result'=>json_encode($list->toArray())));
		$json->setTerminal(true);
		return $json;
	}
	
	public function subOrderAction()
	{
		$request= $this->getRequest();
		$inventoryTable= $this->getInventory();
		$param = array();
		$order=$request->getPost('order');
		switch($order){
			case 'br_order':
			case 'kr_order':
			case 'ns_order':
			case 'dr_order':
			case 'kt_order':
			case 'lr_order':
			case 'ou_order':
			case 'gr_order':
			case 'of_order':
				$param = $order.' ASC';
				break;
			default:
				$param = 'category_id ASC';
		}
		$list = $inventoryTable->getInventorySubCategoryPriority($param);
		$json= new JsonModel(array('result'=>json_encode($list->toArray())));
		$json->setTerminal(true);
		return $json;	
	}
	
	public function itemsAction(){
		$request= $this->getRequest();
		$inventoryTable= $this->getInventory();
		$search_term = array();
		$cate = $request->getPost('category');
		$order = $request->getPost('order');
		if(!empty($cate)){
			$search_term['category'] = htmlspecialchars_decode($cate);
		}
		$sub_cate=$request->getPost('sub_category');
		if(!empty($sub_cate)){
			$search_term['sub_category'] = htmlspecialchars_decode($sub_cate);
		}
		$item_id= $request->getPost('item_id');
		if(!empty($item_id)){
			$search_term['item_id'] = htmlspecialchars_decode($item_id);
		}
		if(!empty($order)){
			$list = $inventoryTable->getInventoryItems($search_term,$order);
		}else{
			$list = $inventoryTable->getInventoryItems($search_term);
		}
		$json= new JsonModel(array('result'=>json_encode($list->toArray())));
		$json->setTerminal(true);
		return $json;		
	}
	
	public function subItemsAction(){
		$request= $this->getRequest();
		$inventoryTable= $this->getInventory();
		$search_term = array();
		$cate = $request->getPost('category');
		if(!empty($cate)){
			$search_term['category'] = $cate;
		}
		$sub_cate=$request->getPost('sub_category');
		if(!empty($sub_cate)){
			$search_term['sub_category'] = $sub_cate;
		}
		$item_id= $request->getPost('item_id');
		if(!empty($item_id)){
			$search_term['item_id'] = $item_id;
		}
		$item= $request->getPost('item');
		if(!empty($item)){
			$search_term['item'] = $item;
		}
		
		$list = $inventoryTable->getInventory($search_term);
		$json= new JsonModel(array('result'=>json_encode($list->toArray())));
		$json->setTerminal(true);
		return $json;
	}
	
	public function InsertAction(){
		date_default_timezone_set('America/Los_Angeles');
		$date= date('Y/m/d H:i:s');
		
		$inventoryTable= $this->getInventory();
		$testdata = array('item_id' => 33,
							'created' => $date);
		$inventoryTable->getInventoryInsert($testdata);
		$json = new JsonModel();
		$json->setTerminal(true);
		return $json;
		
		
	}
	
	public function ajaxAddRoomAction() {
		$request= $this->getRequest();
		if($request->isPost()) {
				$session = $this->getSession();
                $session_id = $session->getId();
                $post = $request->getPost();
                $room_name = isset($post->room_name) ? $post->room_name : null ;
                $room_type = isset($post->room_type) ? $post->room_type : null;
                $item_num = $post->item_num;
                $inventoryTable= $this->getInventory();
              	 $result =  $inventoryTable->isBedRoomExist($session_id,$item_num)->current();
                if(empty($result)) {
                	$data = array();
                	$data['session_id'] = $session_id;
                	$data['room_name'] = $room_name;
                	$data['room_type'] = $room_type;
                	$data['item_num'] = $item_num;
                	$inventoryTable->addRoom($data);
                } else {
                	$data = array();
                	if(!empty($room_name))
                		$data['room_name'] = $room_name;
                	if(!empty($room_type))
                		$data['room_type'] = $room_type;
                	$this->getCustomerTable()->update($data ,$session_id,$item_num );
                }
		} else {
			
		}
                echo "success"; exit;
	}
	
	public function ajaxDeleteRoomAction() {
		$request= $this->getRequest();
		if($request->isPost()) {
				$session = $this->getSession();
                $session_id = $session->getId();
                $post = $request->getPost();
                $item_num = $post->item_num;
                $this->getCustomerTable()->deleteInventoryByItem($session_id,$item_num );
               
		} else {
			
		}
        echo "success"; exit;
	}
	
	public function ajaxAddItemAction() {
		$request= $this->getRequest();
		if($request->isPost()) {
			$session = $this->getSession();
			$session_id = $session->getId();
			$post = $request->getPost();
			$room_id = isset($post->room_id) ? $post->room_id : null ;
			$item_id = isset($post->item_id) ? (int) $post->item_id : 0;
			$qty = isset($post->qty) ? $post->qty : 0;
			$unlisted_item_id = isset($post->unlisted_item_id) ? (int) $post->unlisted_item_id : 0;
			$itemTable= $this->getSelectItemTable();
			if($item_id != 0)
				$result =  $itemTable->isItemExist($session_id,$room_id,$item_id)->current();
			if($unlisted_item_id != 0)
				$result =  $itemTable->isUnlistedItemExist($session_id,$room_id,$unlisted_item_id)->current();
			
			if(empty($result)) {
				$data = array();
				$data['session_id'] = $session_id;
				$data['room_id'] = $room_id;
				$data['item_id'] = $item_id;
				$data['qty'] = $qty;
				$data['unlisted_item_id'] = $unlisted_item_id;
				$itemTable->saveItem($data);
			} else {
				$data = array();
				$data['qty'] = $qty;
				$itemTable->update($data ,$result->id );
				
			}
		} else {
				
		}
		echo "success"; exit;
	}
	
	public function ajaxDeleteItemAction() {
		$request= $this->getRequest();
		if($request->isPost()) {
			$session = $this->getSession();
			$session_id = $session->getId();
			$post = $request->getPost();
			$item_id = $post->item_id;
			$room_id = $post->room_id;
			$type = $post->type ;
			if($type == 'I') 
				$this->getSelectItemTable()->deleteSelectItem($session_id,$room_id,$item_id );
			else if($type == 'U') {
				$this->getSelectItemTable()->deleteUnlistedItem($session_id,$room_id,$item_id );
				$this->getUnlistedItemTable()->delete($item_id );
			}
				
		} else {
				
		}
		echo "success"; exit;
	}
	
	public function ajaxAddUnlistedItemAction() {
		$request= $this->getRequest();
		$returnArr = array();
		if($request->isPost()) {
			$session = $this->getSession();
			$session_id = $session->getId();
			$post = $request->getPost();
			$name = isset($post->name) ? $post->name : null ;
			$full_name = isset($post->full_name) ? $post->full_name : null;
			$width = isset($post->width) ? $post->width : 0;
			$height = isset($post->height) ? $post->height : 0;
			$depth = isset($post->depth) ? $post->depth : 0;
			$measure_unit = isset($post->unit) ? $post->unit : null;
			$itemTable= $this->getUnlistedItemTable();
			$data = array();
			$data['name'] = $name;
			$data['full_name'] = $full_name;
			$data['width'] = $width;
			$data['height'] = $height;
			$data['depth'] = $depth;
			$data['measure_unit'] =$measure_unit;
			
			$item_id = $itemTable->save($data);
			$returnArr['status'] = true;
			$returnArr['id'] = $item_id;
			echo json_encode($returnArr);
		} else {
			$returnArr['status'] = false;
		}
		exit;
	}
	
	public function feedbackAction() {
		$request= $this->getRequest();
		$returnArr = array();
		if($request->isPost()) {
			$post = $request->getPost();
			$session = $this->getSession();
			$session_id = $session->getId();
			$data = array();
			$data['feedback'] = $post->feedback;
			$data['session_id'] = $session_id;
			$this->getFeedbackTable()->save($data);
			// send mail code
			$content = "Hi , <br />";
			$content .= $post->feedback;
			$postmark = new Postmark($this->postmark_key, $this->from_email);
			$postmark->to('disha@equatemedia.com');
			$postmark->subject("Feedback from GotMovers.");
			$postmark->html_message($content);
			$send = $postmark->send();
			
			echo "success";
		}
		exit;
	}
	
	function setInventoryAction() {
		$request= $this->getRequest();
		$returnArr = array();
		if($request->isPost()) {
			$post = $request->getPost();
			$session = $this->getSession();
			$session_id = $session->getId();
			$data = array();
			$data['inventory'] = $post->inventory;
			$this->getLeadsSubmissionsTable()->update($data,array('session_id' => $session_id,'matrix_lead_id IS NULL'));
			
			$sessrow  = $this->getSessionOnline()->checkOnline($session_id)->current();
			if(empty($sessrow)) {
				$data = array();
				$time = date('Y-m-d H:i:s');
				$data['session_id'] = $session_id;
				$data['updated'] = $time;
				$data['created'] = $time;
				$this->getSessionOnline()->save($data);
			} else {
				$data = array();
				$time = date('Y-m-d H:i:s');
				$data['updated'] = $time;
				$this->getSessionOnline()->update($data,$session_id);
			}
			
			$result = array();
			$result['status'] = true ;
			$result['id'] = $session_id;
			echo json_encode($result);
		}
		exit;
	}
	
	function keepAliveAction(){
		$session = $this->getSession();
		$session_id = $session->getId();
		$row  = $this->getSessionOnline()->checkOnline($session_id)->current();
		if(empty($row)) {
			$data = array();
			$time = date('Y-m-d H:i:s');
			$data['session_id'] = $session_id;
			$data['updated'] = $time;
			$data['created'] = $time;
			$this->getSessionOnline()->save($data);
		} else {
			$data = array();
			$time = date('Y-m-d H:i:s');
			$data['updated'] = $time;
			$this->getSessionOnline()->update($data,$session_id);
		}
		exit;
	}
	
	public function cronChangeInventoryStatusAction() {
		$sessions = $this->getSessionOnline()->fetchAll();
		$current_time = date('Y-m-d H:i:s');
		foreach($sessions as $row) {
			
			$session_id = $row->session_id;
			
			$d1 = strtotime($row->updated);
			$d2 = strtotime($current_time);
			$diff = $d2 - $d1;
			$minute = round(abs($diff) / 60,2);
			
			if($minute >= 1 ) {
				$leads = $this->getLeadsSubmissionsTable()->select(array('session_id' => $session_id))->current();
				if($leads->inventory == 1) {
					$data = array();
					$data['inventory'] = 2;
					$this->getLeadsSubmissionsTable()->update($data,array('session_id' => $session_id));
				}
				$this->getSessionOnline()->deleteBySession($session_id);
			}
			
			echo round(abs($diff) / 60,2). " minute";
			echo $diff;
		}
		exit;
	}
	public function getSession(){
		if($this->session == null){
			$sm = $this->getServiceLocator();
			$this->session = $sm->get('session_manager');
		}
		return $this->session;
	}
	
	private function getRoomSize($room_size) {
		    $room_size = strtolower($room_size);
		    $size = 1;
		    if (strpos($room_size, 'studio') !== false || $room_size == 'moving boxes only') {
		        $size = 1;
		    } else if (strpos($room_size, 'one') !== false) {
		        $size = 1;
		    } else if (strpos($room_size, 'two') !== false) {
		        $size = 2;
		    } else if (strpos($room_size, 'three') !== false) {
		        $size = 3;
		    } else if (strpos($room_size, 'four') !== false) {
		        $size = 4;
		    } else if (strpos($room_size, 'five') !== false) {
		        $size = 5;
		    } else if (strpos($room_size, 'six') !== false) {
		        $size = 6;
		    } else if(strpos($room_size, 'commercial') !== false) {
		         $size = 6;
		    }
		    return $size;
	}
	
	public function getInventoryAction() {
		$session = $this->getSession();
		$session_id = $session->getId();
		$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
// 		echo '<pre>';
// 		print_r($InventoryObj);
// 		exit;
		if($InventoryObj && !empty($InventoryObj->inventory_obj)) {
			//echo $InventoryObj->inventory_obj;
			$response = new \Zend\Http\Response();
			$response->getHeaders()->addHeaderLine('Content-Type', 'application/json; charset=utf-8');
			$response->setContent($InventoryObj->inventory_obj);
			return $response;
		} else {
			$applicance = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false,'Kitchen', 'Laundry', 'Other'), 'total' => 0);
			$beds = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false,"Mattress Only", "Mattress & Box Spring", "Bed Frames", "Futons", "Nursery", "Other"), 'total' => 0);
			$bookcases = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$boxes = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$bicycles = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$cabinets = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false,"Dining", "Office", "Bedroom", "Entertainment"), 'total' => 0);
			$canoes_kayaks = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$chairs = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false,"Living Room", "Dining", "Office", "Patio"), 'total' => 0);
			$childrens_furniture = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$computers = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$exercise_equipment = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$futons = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$games = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$instruments = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$lamps = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$mirrors = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$misc = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$motorcycles_atvs = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$nursery_furniture = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$odds_ends = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false,"Decor", "Kitchen", "Patio", "Nursery/Kid's Room", "Safes", "Garage", "Other"), 'total' => 0);
			$office_equipment = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$pianos = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$plants = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$sofas_couches = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$travel_storage = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$sports_hobbies = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false, "Dining", "Coffee & End Tables", "Desks", "Patio", "Other"), 'total' => 0);
			$stereos = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$tools = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$toys = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$travel_storage = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$tvs = array('items' => array(false), 'itemCount' => array(false), 'isActive' => 'false', "sub_categories" => array(false), 'total' => 0);
			$inventory = array( 
					'categories' =>
					array('Appliances' => $applicance,
							'Beds' => $beds,
							'Bicycles'=>$bicycles,
							'Bookcases' => $bookcases,
							'Boxes' => $boxes,
							'Cabinets' => $cabinets,
							'Canoes & Kayaks' => $canoes_kayaks,
							'Chairs' => $chairs,
							"Children's Furniture" => $childrens_furniture,
							'Computers' => $computers,
							'Exercise Equipment' => $exercise_equipment,
							'Futons'=>$futons,
							'Games'=>$games,
							'Instruments'=>$instruments,
							'Lamps' => $lamps,
							'Mirrors' => $mirrors,
							'Misc' => $misc,
							'Motorcycles & ATVs'=>$motorcycles_atvs,
							'Nursery Furniture'=>$nursery_furniture,
							'Odds & Ends' => $odds_ends,
							'Office Equipment'=>$office_equipment,
							'Pianos'=>$pianos,
							'Plants'=>$plants,
							'Sports & Hobbies'=>$sports_hobbies,
							'Stereos'=> $stereos,
							'Sofas & Couches' => $sofas_couches,
							'Tables & Desks' => $tables_desk,
							'Travel & Storage'=>$travel_storage,				
							'Tools' => $tools,
							'Toys' => $toys,
							'TVs'=>$tvs
							),
					'activeCats' => array(),
					'total' => 0,
					'totalWeight' => 0,
					'totalVol' => 0,
			);
			$response = new \Zend\Http\Response();
			$response->getHeaders()->addHeaderLine('Content-Type', 'application/json; charset=utf-8');
			$response->setContent(json_encode($inventory));
			return $response;
			//echo json_encode($inventory);
		}
		exit;
	}
	
	public function updateInventoryAction() {
		
		$request= $this->getRequest();
		$returnArr = array();
		if($request->isPost()) {
			$post = $request->getPost();
			$session = $this->getSession();
			$session_id = $session->getId();
			
			$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
			
			if($InventoryObj) {
				$data = array();
				if(isset($post->select_categories)) 
					$data['select_categories'] = $post->select_categories;
				if(isset($post->large_items))
					$data['large_items'] = $post->large_items;
				if(isset($post->add_boxes))
					$data['add_boxes'] = $post->add_boxes;
				if(isset($post->review_inventory))
					$data['review_inventory'] = $post->review_inventory;
				if(isset($post->completed)) 
					$data['completed'] = $post->completed;
				if(isset($post->inventory_obj)) {
					$inventory = array('categories' => $post->inventory_obj,
										'activeCats' => !empty($post->activeCats) ? $post->activeCats : array() ,
										'total' => !empty($post->total) ? $post->total : 0,
										'totalWeight' => !empty($post->totalWeight) ? $post->totalWeight : 0,
										'totalVol' => !empty($post->totalVol) ? $post->totalVol : 0
									);
					$data['inventory_obj'] = json_encode($inventory);
					$data['completed'] = 1;
				}
				if(isset($post->email_address))
					$data['email_address'] = $post->email_address;
				if(isset($post->inventory)) { 
					//$this->getLeadTable()->update(array('inventory' => json_encode($post->inventory)),array('session_id'=> $session_id));
					$this->getLeadsSubmissionsTable()->update(array('inventory_data' => json_encode($post->inventory),'inventory' => 3),array('session_id'=> $session_id,'matrix_lead_id IS NULL'));
					// if user has done with inventory
					//$this->getLeadsSubmissionsTable()->update(array('inventory' => 3 ),array('session_id' => $session_id));
				} else {
					// if user is modifying or adding the inventory
					$this->getLeadsSubmissionsTable()->update(array('inventory' => 1 ),array('session_id' => $session_id , 'matrix_lead_id IS NULL'));
				}
				
				if(!empty($data)) {
					$this->getInventory()->update($data,$session_id);
				}
// 				if(isset($post->email_address) && !empty($post->email_address))
// 						$this->send_inventory_email($post->email_address);
				echo "success";
			}
		} else {
			echo "failed";
		}
		exit;
	}
	
	public function downloadAction() {
		
		$session = $this->getSession();
		$session_id = $session->getId();
		
		$rowset = $this->getLeadsSubmissionsTable()->select(array('session_id'=> $this->session->getId(),'inventory' => 3));
		
		$lead = $rowset->current();
		$inventory = json_decode($lead->inventory_data);
// 		$this->send_inventory_email('bhavesh@equatemedia.com');
// 		exit;
	    header('Content-type: text/csv');
	    header('Content-Disposition: attachment; filename="inventory.csv"');
		
		$fp = fopen('php://output', 'w');
		foreach($inventory as $key => $value) {
			fputcsv($fp, array('Your '.$key));
			fputcsv($fp, array('Name','Quantity'));
			foreach($value->items as $item) {
				fputcsv($fp, array($item->name,$item->qty));
			}
			fputcsv($fp,array());
		}
		$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
		$obj = json_decode($InventoryObj->inventory_obj);
		fputcsv($fp,array());
		fputcsv($fp, array('Total Items',$obj->total));
		fputcsv($fp, array('APRX. Vol',$obj->totalVol .' CF'));
		fputcsv($fp, array('APRX. LBS',$obj->totalWeight . ' LBS'));
		fclose($fp);
	    exit;
		
	}
	
	public function sendInventoryEmailAction(){
		$request= $this->getRequest();
		$returnArr = array();
		if($request->isPost()) {
			$email = $request->getPost('email_address');
			$this->send_inventory_email($email);
			echo 'success';
		} else {
			echo 'failed';
		}
		exit;
	}
	
	private function send_inventory_email($email_address) {
		
		if(!empty($email_address) && !filter_var($email_address, FILTER_VALIDATE_EMAIL) === false) {
				$session = $this->getSession();
				$session_id = $session->getId();
				
				$rowset = $this->getLeadsSubmissionsTable()->select(array('session_id'=> $this->session->getId(),'inventory' => 3));
				$lead = $rowset->current();
				if(empty($lead->inventory_data))
					return false;
				$inventory = json_decode($lead->inventory_data);
				
				$fp = fopen('php://temp', 'w+');
				foreach($inventory as $key => $value) {
					fputcsv($fp, array('Your '.$key));
					fputcsv($fp, array('Name','Quantity'));
					foreach($value->items as $item) {
						fputcsv($fp, array($item->name,$item->qty));
					}
					fputcsv($fp,array());
				}
				$InventoryObj = $this->getInventory()->getInventoryBySession($session_id)->current();
				
				if(empty($InventoryObj->inventory_obj))
					return false;
				 
				$obj = json_decode($InventoryObj->inventory_obj);
				fputcsv($fp,array());
				fputcsv($fp, array('Total Items',$obj->total));
				fputcsv($fp, array('APRX. Vol',$obj->totalVol .' CF'));
				fputcsv($fp, array('APRX. LBS',$obj->totalWeight . ' LBS'));
				rewind($fp);
				$attachment = stream_get_contents($fp);
				fclose($fp);
				
				$this->renderer = $this->getServiceLocator()->get('ViewRenderer');
				$emailTemplate = '/inventory/index/inventory-email-template.phtml';
				$viewContent = new \Zend\View\Model\ViewModel(
						array(
								'name'    => ucwords($lead->first_name),
						));
				$viewContent->setTemplate($emailTemplate); // set in module.config.php
				$content = $this->renderer->render($viewContent, $view);
// 				$content = "Hi , <br />";
// 				$content .= "Please find the attachment for Inventory.";
				$postmark = new Postmark($this->postmark_key, $this->from_email);
				$postmark->to($email_address);
				$postmark->subject("GotMovers Inventory");
				$postmark->attachment('inventory.csv',base64_encode($attachment),'text/csv');
				$postmark->html_message($content);
				$send = $postmark->send();
				return true;
		}
		return false;
		
	}

}
