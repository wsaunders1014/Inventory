<?php

return array(
		'session' => array (
				'use_cookies' => true,
				'use_only_cookies' => true,
				'cookie_httponly' => true,
				'name' => 'ZF2_SESSION',
				'remember_me_seconds' => 1800
		),
	'router' => array(
		'routes' => array(
			'inventory' => array(
				'type' => 'literal',
				'options' => array(
					'route' => '/inventory',
					'defaults' => array(
						'controller' => 'Inventory\Controller\Index',
						'action' => 'inventory',
					)
				)
			),
			'sub-order' => array(
					'type' => 'literal',
					'options' => array(
							'route' => '/sub-order',
							'defaults' => array(
									'controller' => 'Inventory\Controller\Index',
									'action' => 'subOrder',
							)
					)
			),
			'confirmation' => array(
					'type' => 'literal',
					'options' => array(
							'route' => '/confirmation',
							'defaults' => array(
									'controller' => 'Inventory\Controller\Index',
									'action' => 'confirmation',
							)
					)
			),
			'items' => array(
					'type' => 'literal',
					'options' => array(
							'route' => '/items',
							'defaults' => array(
									'controller' => 'Inventory\Controller\Index',
									'action' => 'items',
							)
					)
			),
			'search' => array(
					'type' => 'literal',
					'options' => array(
							'route' => '/search',
							'defaults' => array(
									'controller' => 'Inventory\Controller\Index',
									'action' => 'search',
							)
					)
			),
			'sub-items' => array(
					'type' => 'literal',
					'options' => array(
							'route' => '/sub-items',
							'defaults' => array(
									'controller' => 'Inventory\Controller\Index',
									'action' => 'subItems',
							)
					)
			),

				'ajax-add-room' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/ajax-add-room',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'ajaxAddRoom',
								)
						)
				),
				'ajax-delete-room' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/ajax-delete-room',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'ajaxDeleteRoom',
								)
						)
				),
				'ajax-add-item' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/ajax-add-item',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'ajaxAddItem',
								)
						)
				),
				'ajax-delete-item' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/ajax-delete-item',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'ajaxDeleteItem',
								)
						)
				),
				'ajax-add-unlisted-item' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/ajax-add-unlisted-item',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'ajaxAddUnlistedItem',
								)
						)
				),
				'feedback' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/feedback',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'feedback',
								)
						)
				),
				'set-invenotry' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/set-inventory',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'setInventory',
								)
						)
				),
				'keep-alive' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/keep-alive',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'keepAlive',
								)
						)
				),
				'cron-inventory-status' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/cron-inventory-status',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'cronChangeInventoryStatus',
								)
						)
				),
				'get-inventory' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/get-inventory',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'getInventory',
								)
						)
				),
				'update-inventory' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/update-inventory',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'updateInventory',
								)
						)
				),
				'download' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/download',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'download',
								)
						)
				),
				'send-inventory-email' => array(
						'type' => 'literal',
						'options' => array(
								'route' => '/send-inventory-email',
								'defaults' => array(
										'controller' => 'Inventory\Controller\Index',
										'action' => 'sendInventoryEmail',
								)
						)
				),
				
			'add' => array(
				'type' => 'literal',
				'options' => array(
					'route' => '/add',
					'defaults' => array(
						'controller' => 'Inventory\Controller\Inventory',
						'action' => 'add',
					)
				)
			),
			'edit' => array(
				'type' => 'literal',
				'options' => array(
					'route' => '/edit',
					'defaults' => array(
						'controller' => 'Inventory\Controller\Inventory',
						'action' => 'edit',
					)
				)
			),
			'delete' => array(
				'type' => 'literal',
				'options' => array(
					'route' => '/delete',
					'defaults' => array(
						'controller' => 'Inventory\Controller\Inventory',
						'action' => 'delete',
					)
				)
			)
		) 
	),

	'controllers' => array(
		'invokables' => array(
			'Inventory\Controller\Inventory' => 'Inventory\Controller\InventoryController',
			'Inventory\Controller\Index' => 'Inventory\Controller\IndexController'
		)
	),

	'view_manager' => array(
		'template_path_stack' => array(
			__DIR__ . '/../view',
		),
// 		'template_map' => array(
//             //'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
//         ),
	),

);
