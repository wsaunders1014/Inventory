<?php

namespace Inventory;

use Inventory\Model\Customer;
use Inventory\Model\CustomerTable;
use Inventory\Model\Item;
use Inventory\Model\ItemTable;
use Inventory\Model\SelectItem;
use Inventory\Model\SelectItemTable;
use Inventory\Model\UnlistedItem;
use Inventory\Model\UnlistedItemTable;
use Inventory\Model\Feedback;
use Inventory\Model\FeedbackTable;
use Inventory\Model\SessionOnline;
use Inventory\Model\SessionOnlineTable;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\Mvc\MvcEvent;
use Zend\Session\Config\SessionConfig;
use Zend\Session\SessionManager;
use Zend\Session\Container;
use Inventory\Model\Inventory;
use Inventory\Model\InventoryTable;
use Zend\Db\Sql\Sql;

class Module implements ConfigProviderInterface , AutoloaderProviderInterface {
	
	
	public function onBootstrap(MvcEvent $e) {
		$sm = $e->getApplication ()->getServiceManager ();
		$config = $e->getApplication ()->getServiceManager ()->get ( 'Configuration' );
		
// 		$sessionManager = $sm->get('session_manager');
// 		Container::setDefaultManager($sessionManager);
		
// 		$plptoken = isset($_REQUEST['plp_token'])? $_REQUEST['plp_token'] : '';
// 		if(isset($plptoken) && $plptoken != ''){
// 			$sessionManager->setId($plptoken);
// 		}
		
// 		$sessionManager->start();
		
// 		$sessionConfig = new SessionConfig ();
// 		$sessionConfig->setOptions ( $config ['session'] );
// 		$sessionManager = new SessionManager ( $sessionConfig );
		
// 		Container::setDefaultManager ( $sessionManager );
// 		$plptoken = isset($_REQUEST['plp_token'])? $_REQUEST['plp_token'] : '';
// 		if(isset($plptoken) && $plptoken != ''){
// 			$sessionManager->setId($plptoken);
// 		}
		
// 		$sessionManager->start ();
	
			
	}
    
    public function getAutoloaderConfig() {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                )
            )
        );
    }

    public function getConfig(){
         return include __DIR__ . '/config/module.config.php';
    }

    public function getServiceConfig() {
        return array(
            'factories' => array(
                 'Inventory\Model\CustomerTable' =>  function($sm) {
                    $tableGateway = $sm->get('CustomerTableGateway');
                   // echo __LINE__;exit;
                    $table = new CustomerTable($tableGateway);
                    return $table;
                },
                'CustomerTableGateway' => function ($sm) {
                	
                    $dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Customer());
                    return new TableGateway('customer_table', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\ItemTable' =>  function($sm) {
                    $tableGateway = $sm->get('ItemTableGateway');
                    $table = new ItemTable($tableGateway);
                    return $table;
                },
                
                'ItemTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Item());
                    return new TableGateway('item_table', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\SelectItemTable' =>  function($sm) {
                    $tableGateway = $sm->get('SelectItemTableGateway');
                    $table = new SelectItemTable($tableGateway);
                    return $table;
                },
                'SelectItemTableGateway' => function ($sm) {
                    $dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new SelectItem());
                    return new TableGateway('select_item_table', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\UnlistedItemTable' =>  function($sm) {
                	$tableGateway = $sm->get('UnlistedItemTableGateway');
                	$table = new UnlistedItemTable($tableGateway);
                	return $table;
                },
                'UnlistedItemTableGateway' => function ($sm) {
                	$dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                	$resultSetPrototype = new ResultSet();
                	$resultSetPrototype->setArrayObjectPrototype(new UnlistedItem());
                	return new TableGateway('unlisted_items', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\FeedbackTable' =>  function($sm) {
                	$tableGateway = $sm->get('FeedbackTableGateway');
                	$table = new FeedbackTable($tableGateway);
                	return $table;
                },
                'FeedbackTableGateway' => function ($sm) {
                	$dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                	$resultSetPrototype = new ResultSet();
                	$resultSetPrototype->setArrayObjectPrototype(new Feedback());
                	return new TableGateway('feedback', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\SessionOnlineTable' =>  function($sm) {
                	$tableGateway = $sm->get('SessionOnlineTableGateway');
                	$table = new SessionOnlineTable($tableGateway);
                	return $table;
                },
                'SessionOnlineTableGateway' => function ($sm) {
                	$dbAdapter = $sm->get('Zend\Db\Adapter\InventoryAdapter');
                	$resultSetPrototype = new ResultSet();
                	$resultSetPrototype->setArrayObjectPrototype(new SessionOnline());
                	return new TableGateway('session_online', $dbAdapter, null, $resultSetPrototype);
                },
                'Inventory\Model\InventoryTable' =>  function($sm) {
                	$tableGateway = $sm->get('InventoryTableGateway');
                	$table = new InventoryTable($tableGateway);
                	return $table;
                },
                'InventoryTableGateway' => function ($sm) {
                	$dbAdapter = $sm->get('Zend\Db\Adapter\OptimizedAdapter');
                	$resultSetPrototype = new ResultSet();
                	$resultSetPrototype->setArrayObjectPrototype(new Inventory());
                	return new TableGateway('inventory', $dbAdapter, null, $resultSetPrototype);
                },
//                 'inventory_table' => function ($sm) {
//                 	return new InventoryTable($sm->get('sql_inventory'));
//                 },
                'sql_inventory' => function ($sm) {
                	return new Sql($sm->get('Zend\Db\Adapter\InventoryAdapter'));
                },
                'session_manager' => function ($sm) {
                	$config = $sm->get ( 'session_config' );
                		
                	$storage = null;
                	if ($sm->canCreate ( 'session_storage', false )) {
                		$storage = $sm->get ( 'session_storage' );
                	}
                		
                	$saveHandler = null;
                	if ($sm->canCreate ( 'session_save_handler', false )) {
                		$saveHandler = $sm->get ( 'session_save_handler' );
                	}
                	return new SessionManager ( $config, $storage, $saveHandler );
                },
                'session_config' => function ($sm) {
                	$config = $sm->get ( 'Config' );
                		
                	$sessionConfig = new SessionConfig ();
                	if (isset ( $config ['session'] )) {
                		$sessionConfig->setOptions ( $config ['session'] );
                	}
                		
                	return $sessionConfig;
                },
            ),
        );
    }

}