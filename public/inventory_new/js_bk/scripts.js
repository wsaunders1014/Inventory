var items = false;
var animating = false;
var emailChecked;
var currentStep = 0;
var selected = {
	"categories":{
		"Appliances":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Kitchen', 'Laundry', 'Other'],
			"total":0
		},
		"Beds":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Mattress Only',"Mattress & Box Spring","Bed Frames", "Futons", "Nursery", "Other"],
			"total":0
		},
		"Cabinets":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Dining', 'Office', 'Bedroom','Entertainment'],
			"total":0
		},
		"Sofas & Couches":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Tables & Desks":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Dining','Coffee & End Tables', 'Desks', 'Patio', 'Other'],
			"total":0
		},
		"Chairs":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Living Room','Dining','Office','Patio'],
			"total":0
		},
		"Bookcases":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Boxes":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Electronics":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Stereos', 'TVs', 'TV Stands'],
			"total":0
		},
		"Lamps":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Mirrors":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Children's Items":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Hobbies":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Sporting Equipment', 'Musical Instruments & Equipment'],
			"total":0
		},
		"Tools":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":[],
			"total":0
		},
		"Odds & Ends":{
			"items":[],
			"itemCount":[],
			"isActive":false,
			"sub_categories":['Decor','Kitchen','Patio',"Nursery/Kid's Room", "Safes", "Garage",'Other'],
			"total":0
		}
	},
	"activeCats":[],
	"total": 0,
	"totalWeight":0,
	"totalVol":0,
	updateTotals:function(count,lbs,cf){
		selected.total += count;
		selected.totalWeight += lbs;
		selected.totalVol += cf;
		$('#total-items').html(selected.total);
		$('#item-weight').find('span').html(selected.totalWeight+' lbs');
		$('#item-vol').find('span').html(selected.totalVol+' CF');
		$('#item-count').html(selected.total+' <sup>ITM</sup>');
		$('#total-vol').html(selected.totalVol+' <sup>CF</sup>');
		$('#total-weight').html(selected.totalWeight+' <sup>LBS</sup>');
	},
	addItem:function(id,cat,lbs,cf,parentID){
		var index = selected.categories[cat].items.indexOf(id);
		if(typeof parentID=='undefined'){
			parentID = id;
		}
		if(index === -1){
			index = selected.categories[cat].items.length;
			if(cat=="Boxes"){
				$('#box-holder').find('ul').append('<li><div class="cat" id="added-'+items[id].item_name.split(' ').join('_')+'">'+items[id].item_name+'</div><div class="number" style="display:block;">1</div></li>').find('li:last').addClass('animate-in');
				checkHeight('#box-holder');
				setTimeout(function(){
					$('li').removeClass('animate-in');
					animating = false;
				},500);
			}
			selected.categories[cat].items.push(parseInt(id));
			selected.categories[cat].itemCount.push(1);
			selected.categories[cat].total++;
		}else{
			selected.categories[cat].itemCount[index]++;
			selected.categories[cat].total++;
			if(cat=='Boxes'){
				$(document.getElementById('added-'+items[id].item_name)).siblings('.number').html(selected.categories[cat].itemCount[index]);
			}
		}
		selected.updateTotals(1,lbs,cf);
		$(document.getElementById('added-'+cat.split(' ').join('_'))).siblings('.number').html(selected.categories[cat].total);
		if(items[id].hasChildren.length > 0){
			//current item is a PARENT ITEM

			//First get the current group number, or set it to 0
			if($('#item-'+id).find('.img').find('.number').html() !=""){
				var currNum = parseInt($('#item-'+id).find('.img').find('.number').html());
			}else{
				var currNum = 0;
			}
			currNum++;
			//set Parent number and Item Number
			$('#item-'+id).find('.img').find('.number').html(currNum);
			$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html(selected.categories[cat].itemCount[index]);
			$('#item-'+id).find('.menu').find('li').eq(0).find('.multi-minus').show();
		}else{
			//current item is not parent
			if(items[id].isChild === true){
				//but current item IS child
				if($('#item-'+parentID).find('.img').find('.number').html() !=""){
					var currNum = parseInt($('#item-'+parentID).find('.img').find('.number').html());
				}else{
					var currNum = 0;
				}
				currNum ++;
				$('#item-'+parentID).find('.img').find('.number').html(currNum);
				$('#item-'+id).find('.number').html(selected.categories[cat].itemCount[index]);
				$('#item-'+id).find('.multi-minus').show();
			}else{
				//current item is neither parent, nor child, therefore it's a singular item.
				$('#item-'+id).find('.number').addClass('flash').html(selected.categories[cat].itemCount[index]);
			}
		}
		setTimeout(function(){$('#item-'+id).find('.number').removeClass('flash')},500);

	},
	removeItem: function(id,cat,lbs,cf,parentID){
		var index = selected.categories[cat].items.indexOf(id);
		selected.categories[cat].itemCount[index]--;
		selected.categories[cat].total--;
		selected.updateTotals(-1,-lbs,-cf);
		if(typeof parentID=='undefined'){
			parentID = id;
		}
		if(items[id].hasChildren.length > 0){
			//current item is a PARENT ITEM
			//First get the current group number
			
			var currNum = parseInt($('#item-'+id).find('.img').find('.number').html());
			currNum--;
			//set Parent number and Item Number, if number = 0, then hide it
			if(selected.categories[cat].itemCount[index]==0){
				selected.categories[cat].itemCount.splice(index,1);
				selected.categories[cat].items.splice(index,1);

				$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html('');
				$('#item-'+id).find('.menu').find('li').eq(0).find('.multi-minus').hide();
				if(currNum ==0){
					$('#item-'+id).removeClass('owned').find('.img').find('.number').html("");
				}else{
					$('#item-'+id).find('.img').find('.number').html(currNum);
				}
			}else{
				$('#item-'+id).find('.img').find('.number').html(currNum);
				$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html(selected.categories[cat].itemCount[index]);
			}
		}else{
			if(items[id].isChild === true){
				//Current item IS child
				var currNum = parseInt($('#item-'+parentID).find('.img').find('.number').html());
				currNum --;
				if(selected.categories[cat].itemCount[index]==0){
					selected.categories[cat].itemCount.splice(index,1);
					selected.categories[cat].items.splice(index,1);
					
					$('#item-'+id).find('.number').html('');
					$('#item-'+id).find('.multi-minus').hide();
					if(currNum==0){
						$('#item-'+parentID).find('.img').find('.number').html('');
					}else{
						$('#item-'+parentID).find('.img').find('.number').html(currNum);
					}
				}else{
					$('#item-'+parentID).find('.img').find('.number').html(currNum);
					$('#item-'+id).find('.number').html(selected.categories[cat].itemCount[index]);
				}
			}else{
				//current item is neither parent, nor child, therefore it's a singular item.
				if(selected.categories[cat].itemCount[index]==0){
					selected.categories[cat].itemCount.splice(index,1);
					selected.categories[cat].items.splice(index,1);
					if(cat=='Boxes'){
						$(document.getElementById('added-'+items[id].item_name)).parent().remove();
					}
					$('#item-'+id).removeClass('owned').find('.number').html('');
					$('#item-'+id).find('.controls').stop(true).animate({top:'100%'},200);
				}else{
					$('#item-'+id).find('.number').addClass('flash').html(selected.categories[cat].itemCount[index]);
					if(cat=='Boxes'){
						$(document.getElementById('added-'+items[id].item_name)).siblings('.number').html(selected.categories[cat].itemCount[index]);
					}
				}
			}
		}
		
		$('#added-'+cat).siblings('.number').html(selected.categories[cat].total);
		setTimeout(function(){$('#item-'+id).find('.number').removeClass('flash')},800);
	},
	addCat: function(catName){
		selected.activeCats.unshift(catName);
		selected.categories[catName].isActive = true;
		$('#ul-holder').find('ul').prepend('<li><div class="cat" id="added-'+catName.split(' ').join('_')+'">'+catName+'</div><div class="close-btn">+</div><div class="number">0</div></li>').find('li:first').addClass('animate-in');
		checkHeight('#ul-holder');
		setTimeout(function(){
			$('li').removeClass('animate-in');
			animating = false;
			checkHeight('#cat-holder');
		},500);
	},
	loadCats: function(array){
		// Loads categories on pageload.
		$('#cat-holder').html('');
		var array = [];
		$.each(selected.categories, function(key){
			if(key !== 'Boxes')
				array.push(key);
		});
		for(var i=0;i < array.length; i++){
			var x = 0 - (133*(i%4));
			var y = 0 - (133* Math.floor(i/4));
			$('#cat-holder').append('<div class="item"><div class="img" id="'+array[i].split(' ').join('_')+'" style="background-position: '+x+'px '+y+'px"></div><div class="bottom"><h4 class="cancelSelect">'+array[i]+'</h4></div></div>');
		}
		checkHeight($('#cat-holder'));
	},
	loadBoxes: function(){
		var category = 'Boxes';
		var array = [];
		$.each(items, function(index,obj){
			if(obj.category=='Boxes'){
				array.push(obj);
			}
		});

		var counter = 0;
		for(var i=0;i<array.length;i++){
			var imageURL = 'img/items/'+array[i].item_name.split(' ').join('_').toLowerCase() + '.png';

			//If Item is not a child
			if(array[i].isChild !==true){
				var index = selected.categories[category].items.indexOf(array[i].item_id);
				var owned = (selected.categories[category].items.indexOf(array[i].item_id) !== -1) ? ' owned':'';
				//var side = ((Math.floor(counter/2)%2) == 1) ? ' right':' left';

				var html = '<div class="item'+owned+''+((array[i].hasChildren.length>0) ? " isParent":"")+'" id="item-'+array[i].item_id+'" data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'"><div class="img" style="background:url('+imageURL+') no-repeat 50%;" id="'+array[i].item_name+'"><div class="number">'+((index !== -1) ? selected.categories[category].itemCount[index]:'')+'</div></div><div class="bottom"><h4 class="cancelSelect">'+((array[i].hasChildren.length>0) ? array[i].item_name:array[i].size+' '+array[i].item_name)+'</h4><div class="controls clearfix"><div class="minus">&ndash;</div><div class="plus">+</div></div></div></div>';
				
				$(document.getElementById('main-holder')).append(html);
			}
			
		}
		setTimeout(checkHeight,100,'#main-holder');
		//checkHeight('#main-holder');
	},
	loadItems:function(category){
		currentCat = category;
		var activeCatIndex = selected.activeCats.indexOf(category);
		$('#items').find('.heading').find('span').html(selected.activeCats[activeCatIndex]);
		//Adds the next category link in the status bar.
		if(typeof selected.activeCats[activeCatIndex+1] !== 'undefined'){
			$('.next').show();
			$('#next-cat').html(selected.activeCats[activeCatIndex+1]+' >').attr('data-cat',selected.activeCats[activeCatIndex+1]);
		}else{
			$('.next').hide();
		}
		$('#items-holder').html('');
		var array= [];
		$.each(items, function(index,obj){
			if(obj.category==category){
				array.push(obj);
			}
		});
		//If Category has Subcategories
		var holder;
		if(selected.categories[category].sub_categories.length > 0){
			//Add subcategory divs
			for(var i=0;i < selected.categories[category].sub_categories.length; i++){
				var subcat = selected.categories[category].sub_categories[i];
				subcat = subcat.split(' ').join('_');
					$('#items-holder').append('<div class="sub-cat" id="subcat-'+subcat+'"><div class="sub-heading">'+subcat.split('_').join(' ')+'</div><div class="items-container clearfix"></div>');
			}
		}
		var counter = 0;
		for(var i=0;i<array.length;i++){
			var imageURL = 'img/items/'+array[i].item_name.split(' ').join('_').toLowerCase() + '.png';

			//If Item is not a child
			if(array[i].isChild !==true){
				var index = selected.categories[category].items.indexOf(array[i].item_id);
				var owned = (selected.categories[category].items.indexOf(array[i].item_id) !== -1) ? ' owned':'';
				//var side = ((Math.floor(counter/2)%2) == 1) ? ' right':' left';

				var html = '<div class="item'+owned+''+((array[i].hasChildren.length>0) ? " isParent":"")+'" id="item-'+array[i].item_id+'" data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'"><div class="img" style="background:url('+imageURL+') no-repeat 50%;" id="'+array[i].item_name+'"><div class="number">'+((index !== -1) ? selected.categories[category].itemCount[index]:'')+'</div></div><div class="bottom"><h4 class="cancelSelect">'+((array[i].hasChildren.length>0) ? array[i].item_name:array[i].size+' '+array[i].item_name)+'</h4><div class="controls clearfix"><div class="minus">&ndash;</div><div class="plus">+</div></div></div>'+((array[i].hasChildren.length>0) ? "<div class='menu'><ul></ul></div>":"")+'</div>';
				if(selected.categories[category].sub_categories.length > 0){
					var subcat = array[i].sub_category;
					subcat = subcat.split(' ').join('_');
					if(subcat=="")
						subcat="Other";

					$(document.getElementById('subcat-'+subcat)).find('.items-container').append(html);
				}else{
					$(document.getElementById('items-holder')).append(html);
				}

				if(array[i].hasChildren.length>0){
					$('#item-'+array[i].item_id).find('.menu ul').append('<li data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'" data-parentID="'+array[i].item_id+'" class="clearfix"><div class="item-name">Size: '+array[i].size+'</div><div class="multi-controls"><div class="multi-minus">&ndash;</div></div><div class="number"></div></li>');
					for(var x=0; x < array[i].hasChildren.length; x++){
						var item = items[array[i].hasChildren[x]];
						$('#item-'+array[i].item_id).find('.menu ul').append('<li id="item-'+item.item_id+'" data-id="'+item.item_id+'" data-cf="'+item.cf+'" data-lbs="'+item.lbs+'" data-parentID="'+array[i].item_id+'" class="clearfix"><div class="item-name">Size: '+item.size+'</div><div class="multi-controls"><div class="multi-minus">&ndash;</div></div><div class="number"></div></li>');
					}
				}
				counter++;
			}
			
		}
		checkHeight('#items-holder');
	},
	loadReview:function(){
		var review = $('#review-holder');
		var counter = 0;
		review.html('');
		$.each(selected.categories, function(index, obj){
			//console.log(index, obj);
			if(obj.total > 0){
				for(var i=0;i<obj.items.length;i++){
					 ;
					review.append('<div class="item clearfix '+(((Math.floor(counter/2)%2) == 0) ? 'dark-grey':'')+'"><div class="item-name">'+items[obj.items[i]].size+' '+items[obj.items[i]].item_name+'</div><div class="item-count">'+obj.itemCount[i]+'</div></div>');
					counter++;
				}
			}
		});
	}
}
var currentCat = '';
$(document).ready(function(){
	/****************** ON LOAD *****************/
	selected.loadCats();
	$.getJSON('js/items.json').done(function(data){
		items = data;
	});
	$.get('response.php').done(function(data){
		var obj = $.parseJSON(data);
		jQuery.extend(selected,obj);
		console.log(selected);
	})
	emailChecked = $('#user-email').val();
	$('#user-email').trigger('keyup');
	/******************* GLOBAL EVENTS *******************/
	//SAVE BUTTON CLICK
	$('#save-button').on('click', function(){
		//Changes progress bar
		if($(this).hasClass('to-items')){
			if(selected.activeCats.length > 0){
				$(this).removeClass('to-items').addClass('to-boxes');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				//Moves Categories offsreen and hides
				$('#categories').css({position:'absolute'}).animate({left:'-100%',opacity:0},400,function(){
					$(this).hide();
				});
				/// Moves sidebar, hides close button, shows status bar, shows number, and makes it selectable.
				$('#sidebar').delay(100).animate({left:'-3.51063829787234%'},500).find('.status-bar').animate({bottom:0},500);
				$('#sidebar').find('.overflow').css({height:362});
				checkHeight('#ul-holder');
				$('#ul-holder').find('ul').addClass('selectable').find('li').eq(0).addClass('current');
				//show Items box, changes heading to first category.
				$('#items').show().css({left:'28.096217493089833%',opacity:1}).addClass('animate-in2').find('.heading > span').html(selected.activeCats[0]);
				setTimeout(function(){
					$('#items').removeClass('animate-in2');
				},500);
				selected.loadItems(selected.activeCats[0]);
				currentStep++;
			}
		}else if($(this).hasClass('to-boxes')){
			if(selected.total > 0){
				$(this).removeClass('to-boxes').addClass('to-review');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				selected.loadBoxes();
				// HIDE OLD ELEMENTS
				$('#sidebar').animate({left:'-103%', opacity:0},500, function(){
					$(this).hide();
				});
				$('#items').css({position:'absolute'}).animate({left:'100%', opacity:0},500, function(){
					$(this).hide();
				});
				//ANIMATE NEW ELEMENTS
				$('#boxes-main').css({left:0,opacity:1, display:'block'}).addClass('animate-in2');
				$('#boxes-sidebar').css({left:'71.789362%', display:'block'}).addClass('animate-in2');
				setTimeout(function(){
					$('.animate-in2').removeClass('animate-in2');
				},500);
				currentStep++;
			}
			///////////////////
		}else if($(this).hasClass('to-review')){
			
				selected.loadReview();
				$(this).removeClass('to-review').addClass('to-completed');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				/* HIDE OLD ELEMENTS */
				$('.email').hide();
				$('#boxes-main').css({position:'absolute'}).animate({left:'-100%',opacity:0}, 400,function(){
					$(this).hide();
				});
				$('#boxes-sidebar').animate({left:'+=100%'}, 500, function(){
					$(this).hide();
				});
				/* SHOW NEW ELEMENTS */
				$('#review-main').css({display:'block',left:0,opacity:1}).addClass('animate-in2');
				$('#review-sidebar').css({display:'block',left:'75.389362%',opacity:1}).addClass('animate-in2');
				setTimeout(function(){
					$('.animate-in2').removeClass('animate-in2');
				},500);
				currentStep++;
		}else if($(this).hasClass('to-completed')){
			//IS EMAIL CHECKED?
			if(emailChecked){
				sendEmail(emailChecked);
				$('.user-email').html(emailChecked);
			}else{
				$('#email-text').html('SEND<br/>EMAIL?');
			}
			$('.active').addClass('completed').removeClass('active').next().addClass('active');
			$(this).hide();
			$('#review-main').css({position:'absolute'}).animate({left:'-100%', opacity:0}, 500, function(){
				$(this).hide();
			});
			$('#review-sidebar').animate({left:'+=100%', opacity:0}, 500, function(){
				$(this).hide();
			});
			$('.done').show();
			$('#completed-heading').animate({marginLeft:'0%'},500);
			$('#completed-subheading').animate({marginLeft:'0%'},500);
			$('#completed-box').find('.big').html(selected.total);
			currentStep++;
		}
	});
	
	//PROGRESS BAR CLICK
	$('.step').on('click', function(){
		var index = $(this).index();
		console.log(currentStep, index);
		if($(this).hasClass('completed')){
			$('.active').removeClass('active');
			for(var i = index; i < 4;i++){
				$('.step').eq(i).removeClass('completed');
			}
			$(this).removeClass('completed').addClass('active');
			//HIDE CURRENT STEP
			if(currentStep == 1){
				$('#items').css({position:'absolute'}).addClass('animate-out');
				setTimeout(function(){
					$('#items').hide().removeClass('animate-out');
					$('#items-holder').css({top:0});
				},500);
			}else if(currentStep == 2){
				$('#boxes-main').addClass('animate-out');
				$('#boxes-sidebar').addClass('animate-out');
				setTimeout(function(){
					$('.animate-out').hide().removeClass('animate-out');
				},700);
			}else if(currentStep == 3){
				$('#review-main').addClass('animate-out');
				$('#review-sidebar').addClass('animate-out');
				setTimeout(function(){
					$('.animate-out').hide().removeClass('animate-out');
				},700);
			}else if(currentStep == 4){
				$('#completed-heading').animate({marginLeft:'-100%'},500);
				$('#completed-subheading').animate({marginLeft:'100%'},500, function(){
					$('.done').hide();
					$('#save-button').show();
				});
			}
			//SHOW OLD STEP
			if(index==0){ // Select Categories
				
				$('#categories').delay(400).show().animate({left:'0%',opacity:1},400, function(){
					$(this).removeAttr('style')
				});
				$('#sidebar').delay(200).show().animate({left:'71.789362%',opacity:1});
				$('#ul-holder').find('ul').removeClass('selectable').find('li').removeClass('current');
				$('#save-button').removeClass('to-boxes').addClass('to-items');
				
				
			}else if(index==1){ // Large Items
				$('#save-button').removeClass('to-review').addClass('to-boxes');
				$('#items').show().delay(200).animate({left:'28.096217493089833%',opacity:1},500, function(){
					$(this).css({position:'relative'});
				});
				$('#sidebar').show().delay(200).animate({left:'-3.51064%',opacity:1},500);
				
			}else if(index==2){ //Add Boxes
				$('#save-button').removeClass('to-completed').addClass('to-review');
				//HIDE CURRENT ELEMENTS
				
				//ANIMATE NEW ELEMENTS
				$('#boxes-main').show().delay(200).animate({left:'0',opacity:1},500, function(){
					$(this).css({position:'relative'});
				});
				$('#boxes-sidebar').show().delay(200).animate({left:'71.789362%',opacity:1},500);
				
			}else if(index==3){//Review Inventory
				$('#review-main').show().animate({left:'0%', opacity:1}, 500);
				$('#review-sidebar').show().animate({left:'-=100%', opacity:1}, 500);
			}
			currentStep = index;
		}
	});
	//RESIZE EMAIL INPUT
	$('#user-email').on('keyup', function(){
		$('#email-counter').html($(this).val());
		var width = $('#email-counter').outerWidth();
		$(this).css({width:width});
	});
	/****************** STEP 1 EVENTS *******************/
	//CATEGORIES SELECT
	$('#categories').on('click', '.item', function(){
		if(!animating){
			animating = true;
			var id = $(this).find('.img').attr("id").split('_').join(' ');
			selected.addCat(id);
			$(this).addClass('animate-out').delay(450).fadeOut(0, function(){$(this).removeClass('animate-out')});
		}
	});
	//SIDE BAR CLOSE BTN
	$('#ul-holder').on('click','.close-btn',function(){
		$(this).parent().addClass('animate-out');
		
		var id = $(this).prev().html();
		selected.activeCats.splice(selected.activeCats.indexOf(id),1);
		$('#'+id).parent().fadeIn(0,function(){$(this).addClass('animate-in')});
		checkHeight('#cat-holder');
		//Removes category from sidebar.
		var that=this;
		setTimeout(function(){
			$(that).parent().remove();
			$('#'+id).parent().removeClass('animate-in');
			checkHeight('#ul-holder');
		},500);
	});
	//EMAIL CHECKBOX EVENT
	$('#terms').on('change', function(e){
		if($(this).is(":checked"))
			emailChecked = $('#user-email').val();
		else
			emailChecked = false;
	});
	/******************************************/
	/*************** STEP 2 EVENTS *******************/
	//SELECT CURRENT CATEGORY
	$('#sidebar').on('click','.selectable li', function(){
		$('.current').removeClass('current');
		$(this).addClass('current');
		var cat = $(this).find('.cat').attr('id').split('_').join(' ').split('added-')[1];
		selected.loadItems(cat);
		$('#items-holder').css({top:0});
	});
	//ADD NON PARENT ITEM
	$('#items-holder').on('click', '.item', function(){
		var id = parseInt($(this).attr('data-id'));
		if($(this).hasClass('isParent') !== true){
			$(this).addClass('owned');
			selected.addItem(id,currentCat,parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')));
			$(this).find('.controls').stop(true).animate({top:'0%'},200);
		}
	});
	//ADD CHILD ITEM
	$('#items-holder').on('click', 'li', function(e){
		e.stopPropagation();
		var id = parseInt($(this).attr('data-id'));
		var parentID = parseInt($(this).attr('data-parentID'));

		$(this).parents('.item').addClass('owned');
		selected.addItem(id, currentCat, parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')), parentID);
	});

	//REMOVE ITEM
	$('#items-holder').on('click', '.minus', function(e){
		e.stopPropagation();
		var id = parseInt($(this).parents('.item').attr('data-id'));
		selected.removeItem(id,currentCat,parseInt($(this).parents('.item').attr('data-lbs')),parseInt($(this).parents('.item').attr('data-cf')));
	});
	//REMOVE CHILD ITEM
	$('#items-holder').on('click', '.multi-minus', function(e){
		e.stopPropagation();
		var id = parseInt($(this).parents('li').attr('data-id'));
		var parentID = parseInt($(this).parents('li').attr('data-parentID'));
		selected.removeItem(id,currentCat,parseInt($(this).parents('.item').attr('data-lbs')),parseInt($(this).parents('.item').attr('data-cf')),parentID);
	});
	//CONTROL HOVER
	$('#items-holder').on('mouseenter', '.owned', function(){
		if($(this).hasClass('isParent')!== true){
			$(this).find('.controls').stop(true).animate({top:'0%'}, 200);
		}
	}).on('mouseleave', '.owned', function(){
		if($(this).hasClass('isParent')!== true){
			$(this).find('.controls').stop(true).animate({top:'100%'},200);
		}
	});
	//BTN PRESS ANIMATION
	$('#items-holder').on('click', '.plus, .minus', function(){
		$(this).addClass('pressed');
		setTimeout(function(){
			$('.pressed').removeClass('pressed');
		},200);
	});
	$('#next-cat').on('click', function(){
		var cat = $(this).attr('data-cat');
		$('#added-'+cat.split(' ').join('_')).trigger('click');
	});
	//SEARCH BAR
	$('#search').on('keyup', function(e){
		var value = $(this).val().toLowerCase();
		if(value.length >= 2){
			var re = new RegExp(value, "g");
			var array = [];
			$.each(items, function(index, obj){
				if(re.test(obj.item_name.toLowerCase()))
					array.push(obj);
			});
			//console.log(array);
			if(array.length > 0){
				$('#search-results').find('ul').html('');
				$('#search-image').removeAttr('style');
				for(var i = 0; i < array.length; i++){
					$('.search').show().find('ul').append('<li data-id="'+array[i].item_id+'" data-cat="'+array[i].category+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'">'+((array[i].sub_category !== "") ? array[i].sub_category+', ':'')+array[i].item_name+((array[i].size !== "") ? ' - '+array[i].size:'')+'</li>');
				}
			}else{
				$('.search').hide();
			}
		}else{
			$('.search').hide().find('ul').html('');
		}
	})// .on('blur', function(){
	// 	$('#search-results').hide();
	// 	$('#search-image').hide()
	// }).on('focus', function(){
	// 	$('#search-results').show();
	// 	if($(this).val() != ''){
	// 		$('#search-image').show();
	// 	}
	// });
	//Stop body from scrolling.
	$('#search-results').on('mousewheel', function(e){
		e.stopPropagation();
	})
	$('#search-results').on('click', 'li', function(){
		var category = $(this).attr('data-cat');
		
		var imageOffset = $('#search-image').offset();
		if(selected.activeCats.indexOf(category) === -1) {
			selected.addCat(category);
		}
		var numOffset = $('#added-'+category).siblings('.number').offset(); //510;
		selected.addItem($(this).attr('data-id'),category,parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')));

		$('#search-image').addClass('scaleDown').animate({right:'+='+(imageOffset.left-numOffset.left),top:'+='+(numOffset.top-imageOffset.top)},500, function(){
			$(this).removeAttr('style').hide().removeClass('scaleDown');
		});
		$('#search').val('');
		$('#search-results').hide().find('ul').html('');
	});
	/************************ END STEP 2 EVENTS *************************/
	/************************* STEP 3 EVENTS **********************/
	//ADD ITEM
	$('#main-holder').on('click', '.item', function(){
		var id = parseInt($(this).attr('data-id'));
			$(this).addClass('owned');
			selected.addItem(id,'Boxes',parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')));
			$(this).find('.controls').stop(true).animate({top:'0%'},200);
		
	});
	//REMOVE ITEM
	$('#main-holder').on('click', '.minus', function(e){
		e.stopPropagation();
		var id = parseInt($(this).parents('.item').attr('data-id'));
		selected.removeItem(id,'Boxes',parseInt($(this).parents('.item').attr('data-lbs')),parseInt($(this).parents('.item').attr('data-cf')));
	});
	//CONTROL HOVER
	$('#main-holder').on('mouseenter', '.owned', function(){
		//if($(this).hasClass('isParent')!== true){
			$(this).find('.controls').stop(true).animate({top:'0%'}, 200);
		//}
	}).on('mouseleave', '.owned', function(){
		//if($(this).hasClass('isParent')!== true){
			$(this).find('.controls').stop(true).animate({top:'100%'},200);
		//}
	});
	//BTN PRESS ANIMATION
	$('#main-holder').on('click', '.plus, .minus', function(){
		$(this).addClass('pressed');
		setTimeout(function(){
			$('.pressed').removeClass('pressed');
		},200);
	});
	/***************** STEP 5 EVENTS ******************/
	$('#email-btn').on('click', function(){
		if(!emailChecked){

		}
	});
});

//////////////////// FUNCTIONS ////////////////////
//Checks content height against container height and applies scrolling if necessary.
function checkHeight(elem){
	//checks height of .holder divs and applies scrolling if the content is taller than container
	var elem = $(elem);
	var currTop = 0;
	var parent = elem.parent();
	var catH = parent.outerHeight();
	var elemH = elem.outerHeight();
	var bottomLimit = catH - elemH;
	if(elem.outerHeight() > catH){
		//if(parent.hasClass('scroll')== false){
			parent.addClass('scroll');
			//Click and Drag
			// parent.on('mousedown', function(e){
			// 	var startY = e.pageY;
			// 	$(this).on('mousemove', function(e){
			// 		var moveY = (e.pageY - startY)/20;
			// 		currTop += moveY;
			// 		if(currTop > 0)
			// 			currTop = 0;
			// 		else if(currTop < bottomLimit)
			// 			currTop = currTop - (currTop - bottomLimit);
			// 		elem.css({top:currTop});
			// 	});
			// }).on('mouseup mouseleave', function(){
			// 	$(this).off('mousemove');
			// });
			//Scroll Wheel Event
			parent.on('mousewheel', function(e){
				if(e.originalEvent.deltaY > 0){
					currTop -=30;
					if(currTop < bottomLimit)
						currTop = bottomLimit;
				}else if(e.originalEvent.deltaY < 0){
					currTop +=30;
					if(currTop > 0)
						currTop = 0;
				}
				elem.css({top:currTop});
			});
		//}
	}else{
		parent.removeClass('scroll');
		elem.css({top:0});
		parent.off('mousedown mousemove mousewheel');
	}
}
function sendEmail(email){

}