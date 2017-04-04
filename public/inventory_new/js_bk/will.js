var items = false;
var animating = false;
var emailChecked;
var currentStep = 0;
var t;
var t2;

var selected = {
	updateTotals:function(count,lbs,cf){
		selected.total = parseInt(selected.total) + count;
		selected.totalWeight =parseInt(selected.totalWeight) +  lbs;
		selected.totalVol = parseInt(selected.totalVol) + cf;
		$('#total-items').html(selected.total);
		$('#item-weight').find('span').html(selected.totalWeight+' lbs');
		$('#item-vol').find('span').html(selected.totalVol+' CF');
		$('#item-count').html(selected.total+' <sup>ITM</sup>');
		$('#total-vol').html(selected.totalVol+' <sup>CF</sup>');
		$('#total-weight').html(selected.totalWeight+' <sup>LBS</sup>');

	},
	addItem:function(id,cat,lbs,cf,parentID){
		var index = selected.categories[cat].items.indexOf(String(id));
		if(typeof parentID=='undefined'){
			parentID = id;
		}
		if(index === -1){ // Item hasn't been selected
			index = selected.categories[cat].items.length;
			if(cat=="Boxes"){
				$('#box-holder').find('ul').append('<li><div class="cat" id="box-'+id+'">'+items[id].item_name+'</div><div class="number" style="display:block;">1</div></li>').find('li:last').addClass('animate-in');
				checkHeight('#box-holder');
				setTimeout(function(){
					$('li').removeClass('animate-in');
					animating = false;
				},500);
			}
			//Add item to arrays and update category total
			selected.categories[cat].items.push(String(id));
			selected.categories[cat].itemCount.push('1');
			selected.categories[cat].total = parseInt(selected.categories[cat].total) + 1;
		}else{
			selected.categories[cat].itemCount[index] = parseInt(selected.categories[cat].itemCount[index])+1;
			selected.categories[cat].total = parseInt(selected.categories[cat].total) +1;
			if(cat=='Boxes'){
				$(document.getElementById('item-'+id)).siblings('.number').html(selected.categories[cat].itemCount[index]);
			}
		}
		selected.updateTotals(1,lbs,cf);
		//Updates Sidebar category total.
		$(document.getElementById('added-'+cat.split(' ').join('_'))).siblings('.number').html(selected.categories[cat].total);
		//First get the current group number, or set it to 0
		var currNum = ($(document.getElementById('item-'+parentID)).find('.img').find('.number').html() !="") ? parseInt($('#item-'+parentID).find('.img').find('.number').html()):0;
		currNum ++;
		if(items[id].hasChildren.length > 0){
			//current item is a PARENT ITEM

			//set Parent number and Item Number
			$('#item-'+id).find('.img').find('.number').html(currNum);
			//UPDATE NUMBER IN MENU FOR PARENT ITEM AND SHOW MINUS
			$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html(selected.categories[cat].itemCount[index]);
			$('#item-'+id).find('.menu').find('li').eq(0).find('.multi-minus').show();
		}else{
			//current item is not parent
			if(items[id].isChild !== ''){
				///but current item IS child
				//console.log(currNum)
				$(document.getElementById('item-'+parentID)).find('.img').find('.number').html(currNum);
				$('#subitem-'+id).find('.number').html(selected.categories[cat].itemCount[index]);
				$('#subitem-'+id).find('.multi-minus').show();
			}else{
				//current item is neither parent, nor child, therefore it's a singular item.
				if(cat == 'Boxes'){
					$('#box-'+id).siblings('.number').addClass('flash').html(selected.categories[cat].itemCount[index]);
				}
				$('#item-'+id).find('.number').addClass('flash').html(selected.categories[cat].itemCount[index]);
				
			}
		}
		setTimeout(function(){$('#item-'+id).find('.number').removeClass('flash')},500);
	},
	removeItem: function(id,cat,lbs,cf,parentID){
		var index = selected.categories[cat].items.indexOf(String(id));
		selected.categories[cat].itemCount[index] = parseInt(selected.categories[cat].itemCount[index])-1;
		selected.categories[cat].total = parseInt(selected.categories[cat].total) -1;
		selected.updateTotals(-1,-lbs,-cf);
		if(typeof parentID=='undefined'){
			parentID = id;
		}
		var currNum = $(document.getElementById('item-'+parentID)).find('.img').find('.number').html();
		currNum--;
		//current item is a PARENT ITEM
		if(items[id].hasChildren.length > 0){
			
			//First get the current group number
			//console.log('changed: '+currNum)
			//set Parent number and Item Number, if number = 0, then hide it
			if(selected.categories[cat].itemCount[index]==0){
				selected.categories[cat].itemCount.splice(index,1);
				selected.categories[cat].items.splice(index,1);

				$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html('');
				$('#item-'+id).find('.menu').find('li').eq(0).find('.multi-minus').hide();
				if(currNum ==0){
					$('#item-'+id).removeClass('owned').find('.img').find('.number').html("");
					if(cat=='Boxes'){
						$(document.getElementById('item-'+id)).addClass('animate-out');
						setTimeout(function(){
							$('.animate-out').removeClass('animate-out');
							$(document.getElementById('item-'+id)).remove();
						},500)
					}
				}else{
					$('#item-'+id).find('.img').find('.number').html(currNum);
				}
			}else{
				$('#item-'+id).find('.img').find('.number').html(currNum);
				$('#item-'+id).find('.menu').find('li').eq(0).find('.number').html(selected.categories[cat].itemCount[index]);
			}
		}else{
			if(items[id].isChild != ''){
				//Current item IS child
				//console.log('changed: '+currNum)
				if(selected.categories[cat].itemCount[index]==0){
					selected.categories[cat].itemCount.splice(index,1);
					selected.categories[cat].items.splice(index,1);
					
					$('#subitem-'+id).find('.number').html('');
					$('#subitem-'+id).find('.multi-minus').hide();
					if(currNum==0){
						$('#item-'+parentID).removeClass('owned').find('.img').find('.number').html('');
					}else{
						$('#item-'+parentID).find('.img').find('.number').html(currNum);
					}
				}else{
					$('#item-'+parentID).find('.img').find('.number').html(currNum);
					$('#subitem-'+id).find('.number').html(selected.categories[cat].itemCount[index]);
				}
			}else{
				//current item is neither parent, nor child, therefore it's a singular item.
				if(selected.categories[cat].itemCount[index]==0){
					selected.categories[cat].itemCount.splice(index,1);
					selected.categories[cat].items.splice(index,1);

					if(cat=='Boxes'){
						$('#box-'+id).parent().addClass('animate-out');
						setTimeout(function(){
							$('.animate-out').removeClass('animate-out');
							$(document.getElementById('box-'+id)).parent().remove();
						},500)
					}
					$('#item-'+id).removeClass('owned').find('.number').html('');
					$('#item-'+id).find('.controls').stop(true).animate({top:'100%'},200);
				}else{
					$('#item-'+id).find('.number').addClass('flash').html(selected.categories[cat].itemCount[index]);
					if(cat=='Boxes'){
						$(document.getElementById('box-'+id)).siblings('.number').html(selected.categories[cat].itemCount[index]);
					}
				}
			}
		}
		
		$(document.getElementById('added-'+cat.split(' ').join('_'))).siblings('.number').html(selected.categories[cat].total);
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
			$('#cat-holder').append('<div class="item'+(((selected.activeCats.indexOf(array[i]) != -1)) ? " selected":'')+'"><div class="img" id="'+array[i].split(' ').join('_')+'" style="background-position: '+x+'px '+y+'px"></div><div class="bottom"><h4 class="cancelSelect">'+array[i]+'</h4></div></div>');
		}
		for(var i=0;i<selected.activeCats.length;i++){
			$('#ul-holder').find('ul').append('<li><div class="cat" id="added-'+selected.activeCats[i].split(' ').join('_')+'">'+selected.activeCats[i]+'</div><div class="close-btn">+</div><div class="number">'+selected.categories[selected.activeCats[i]].total+'</div></li>').find('li').addClass('animate-in');
		}
		setTimeout(function(){$('.animate-in').removeClass('animate-in')},500)
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
		$('#box-holder').find('ul').html('');
		var counter = 0;
		for(var i=0;i<array.length;i++){
			if(array[i].image === true){
				imageURL = '/inventory_new/img/items/'+array[i].item_name.split(' ').join('_').toLowerCase() + '.png';
			}else if(array[i].image ===''){
				imageURL = '/inventory_new/img/coming-soon.png';
			}else{
				imageURL = '/inventory_new/img/items/'+array[i].image;
			}
			//If Item is not a child
			if(array[i].isChild !==true){
				var index = selected.categories[category].items.indexOf(String(array[i].item_id));
				var owned = (index !== -1) ? ' owned':'';
				//var side = ((Math.floor(counter/2)%2) == 1) ? ' right':' left';
				//POPULATE MAIN CONTAINER
				var html = '<div class="item'+owned+''+((array[i].hasChildren.length>0) ? " isParent":"")+'" id="item-'+array[i].item_id+'" data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'"><div class="img" style="background:url('+imageURL+') no-repeat 50%" id="'+array[i].item_name+'"><div class="number">'+((index !== -1) ? selected.categories[category].itemCount[index]:'')+'</div></div><div class="bottom"><h4 class="cancelSelect">'+((array[i].hasChildren.length>0) ? array[i].item_name:array[i].size+' '+array[i].item_name)+'</h4><div class="controls clearfix"><div class="minus">&ndash;</div><div class="plus">+</div></div></div></div>';
				
				$(document.getElementById('main-holder')).append(html);
				//POPULATE SIDEBAR
				if(owned){
					$('#box-holder').find('ul').append('<li><div class="cat" id="box-'+array[i].item_id+'">'+array[i].item_name+'</div><div class="number" style="display:block">'+selected.categories[category].itemCount[index]+'</div>');
				}
				
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
		//var holder;
		if(selected.categories[category].sub_categories.length > 1){
			//Add subcategory divs
			for(var i=1;i < selected.categories[category].sub_categories.length; i++){
				var subcat = selected.categories[category].sub_categories[i];
				subcat = subcat.split(' ').join('_');
					$('#items-holder').append('<div class="sub-cat" id="subcat-'+subcat+'"><div class="sub-heading">'+subcat.split('_').join(' ')+'</div><div class="items-container clearfix"></div>');
			}
		}
		for(var i=1;i<array.length;i++){
			var total = 0;
			var imageURL;
			if(array[i].image === true){
				imageURL = '/inventory_new/img/items/'+array[i].item_name.split(' ').join('_').toLowerCase() + '.png';
			}else if(array[i].image ===''){
				imageURL = '/inventory_new/img/coming-soon.png';
			}else{
				imageURL = '/inventory_new/img/items/'+array[i].image;
			}
			//If Item is not a child
			if(!array[i].isChild){
				var index = selected.categories[category].items.indexOf(String(array[i].item_id));
				var owned = (index !== -1) ? ' owned':'';
				if(owned){
					total = total + parseInt(selected.categories[category].itemCount[index]);
				}
				//console.log(array[i].item_name, total);
				var html = '<div class="item'+owned+''+((array[i].hasChildren.length>0) ? " isParent":"")+'" id="item-'+array[i].item_id+'" data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'"><div class="img" style="background:url('+imageURL+') no-repeat 50%" id="'+array[i].item_name+'"><div class="number">'+((total > 0) ? total:'')+'</div></div><div class="bottom"><h4 class="cancelSelect">'+((array[i].hasChildren.length>0) ? array[i].item_name:array[i].size+' '+array[i].item_name)+'</h4><div class="controls clearfix"><div class="minus">&ndash;</div><div class="plus">+</div></div></div>'+((array[i].hasChildren.length>0) ? "<div class='menu'><ul></ul></div>":"")+'</div>';
				if(selected.categories[category].sub_categories.length > 1){
					var subcat = array[i].sub_category;
					subcat = subcat.split(' ').join('_');
					if(subcat=="")
						subcat="Other";
					//PUT IT IN SUBCAT
					$(document.getElementById('subcat-'+subcat)).find('.items-container').append(html);
				}else{
					//OR PUT IT IN MAIN ELEMENT
					$(document.getElementById('items-holder')).append(html);
				}
				//ITEM IS NOT A CHILD, BUT IS A PARENT
				if(array[i].hasChildren.length>0){
					//ADD PARENT ITEM AS FIRST LIST ITEM
					$('#item-'+array[i].item_id).find('.menu ul').append('<li data-id="'+array[i].item_id+'" data-cf="'+array[i].cf+'" data-lbs="'+array[i].lbs+'" data-parentID="'+array[i].item_id+'" class="clearfix"><div class="item-name">Size: '+array[i].size+'</div><div class="multi-controls"><div class="multi-minus" style="'+((parseInt(selected.categories[category].itemCount[index]) > 0) ? 'display:block;':'')+'">&ndash;</div></div><div class="number">'+((total > 0) ? total:'')+'</div></li>');
					//LOOP THROUGH THE CHILD ITEMS AND ADD THEM TO LIST
					for(var x=0; x < array[i].hasChildren.length; x++){
						var item = items[array[i].hasChildren[x]];
						//ADDS OWNED TO PARENT ELEMNT IF CHILD IS SELECTED
						var subIndex = selected.categories[category].items.indexOf(String(array[i].hasChildren[x]));
						if(subIndex !== -1)
							total = total + parseInt(selected.categories[category].itemCount[subIndex]);
						
						$('#item-'+array[i].item_id).find('.menu ul').append('<li id="subitem-'+item.item_id+'" data-id="'+item.item_id+'" data-cf="'+item.cf+'" data-lbs="'+item.lbs+'" data-parentID="'+array[i].item_id+'" class="clearfix"><div class="item-name">Size: '+item.size+'</div><div class="multi-controls"><div class="multi-minus" style="'+((parseInt(selected.categories[category].itemCount[subIndex]) > 0) ? 'display:block;':'')+'">&ndash;</div></div><div class="number">'+((subIndex !== -1) ? selected.categories[category].itemCount[subIndex]:'')+'</div></li>');
					}
					if(total > 0)
						$(document.getElementById('item-'+array[i].item_id)).addClass('owned').find('.number').eq(0).html(total);
				}
				
			}
			
		}
		checkHeight('#items-holder');
	},
	loadReview:function(){
		var review = $('#review-holder');
		review.html('');
		$.each(selected.categories, function(key, obj){

			if(obj.total > 0){
				review.append('<div class="category clearfix"><div class="cat-title">Your '+key+'</div></div>');
				var counter = 2;
				for(var i=1;i<obj.items.length;i++){
					review.find('.category:last').append('<div class="item clearfix"><div class="item-name">'+items[obj.items[i]].size+' '+items[obj.items[i]].item_name+'</div><div class="item-count"><input type="number" data-id="'+items[obj.items[i]].item_id+'" data-parentid="'+items[obj.items[i]].isChild+'" data-count="'+obj.itemCount[i]+'" data-cat="'+items[obj.items[i]].category+'" data-cf="'+items[obj.items[i]].cf+'" data-lbs="'+items[obj.items[i]].lbs+'" min="1" max="99" value="'+obj.itemCount[i]+'"> <span class="delete">+</span></div></div>');
					counter++;
				}
				if(review.find('.item').length%2 == 1){
					review.find('.category:last').append('<div class="item clearfix"></div>');
				}
			}
		});
		$('#item-count').html(selected.total+' <sup>ITM</sup>');
		$('#total-vol').html(selected.totalVol+' <sup>CF</sup>');
		$('#total-weight').html(selected.totalWeight+' <sup>LBS</sup>');
		setTimeout(function(){checkHeight('#review-holder')},100);
	}
} 
var currentCat = '';
var done = false;
$(document).ready(function(){
	/****************** ON LOAD *****************/
	var preload = new Image();
	preload.src = '/inventory_new/img/coming-soon.png';
	$.getJSON('/inventory_new/js/items.json').done(function(data){
		items = data;
		if(data !== false){
			done = true;
		}
	});
	$.getJSON('http://gotmovers.eqm.bz/get-inventory').done(function(data){
		//console.log(data);
		$.extend(selected, data);
		selected.loadCats();
		$('#item-weight').find('span').html(selected.totalWeight+' lbs');
		$('#item-vol').find('span').html(selected.totalVol+' CF');
		$('#total-items').html(selected.total);
	});
	if($('#user-email').val().length > 0 && $('#user-email').val() !== 'false'){
		emailChecked = $('#user-email').val();
		$('#user-email').trigger('keyup');
	}else{
		emailChecked = false;
		$('#user-email').val('');
		$('#terms').attr('checked',false)
	}
	
	/******************* GLOBAL EVENTS *******************/
	//SAVE BUTTON CLICK
	$('#save-button').on('click', function(){
		//Changes progress bar
		if($(this).hasClass('to-items') && done === true){
			if(selected.activeCats.length > 0){
				$(this).removeClass('to-items').addClass('to-boxes');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				//Moves Categories offsreen and hides
				$('#categories').css({position:'absolute'}).animate({left:'-100%',opacity:0},800, function(){
					$(this).hide();
				});
				/// Moves sidebar, hides close button, shows status bar, shows number, and makes it selectable.
				$('#sidebar').delay(100).animate({left:'-3.51063829787234%'},500).find('.status-bar').animate({bottom:0},500);
				$('#sidebar').find('.overflow').css({height:362});
				checkHeight('#ul-holder');
				$('#ul-holder').find('ul').addClass('selectable').find('li').eq(0).addClass('current');
				//show Items box, changes heading to first category.
				$('#items').show().css({left:'28.096217493089833%',opacity:1}).addClass('animate-in2').find('.heading > span').html(selected.activeCats[0]);
				$('#back-btn').show().addClass('animate-in2');
				setTimeout(function(){
					$('.animate-in2').removeClass('animate-in2');
				},700);
				selected.loadItems(selected.activeCats[0]);
				currentStep++;
				// ajax to store data
				$.post('/update-inventory',{select_categories : 1,inventory_obj : selected.categories,activeCats : selected.activeCats,total : selected.total,totalWeight: selected.totalWeight, totalVol :  selected.totalVol},function(data){
					//console.log(data);
				});
			}
		}else if($(this).hasClass('to-boxes')){
			if(selected.total > 0){
				$(this).removeClass('to-boxes').addClass('to-review');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				selected.loadBoxes();
				// HIDE OLD ELEMENTS
				$('#sidebar').animate({left:'-103%', opacity:0},700, function(){
					$(this).hide();
				});
				$('#items').css({position:'absolute'}).animate({left:'100%', opacity:0},700, function(){
					$(this).hide();
				});
				//ANIMATE NEW ELEMENTS
				$('#boxes-main').css({left:0,opacity:1, display:'block'}).addClass('animate-in2');
				$('#boxes-sidebar').css({left:'71.789362%', display:'block'}).addClass('animate-in2');
				setTimeout(function(){
					$('.animate-in2').removeClass('animate-in2');
				},500);
				currentStep++;
				$.post('/update-inventory',{large_items : 1,inventory_obj : selected.categories,activeCats : selected.activeCats,total : selected.total,totalWeight: selected.totalWeight, totalVol :  selected.totalVol },function(data){
					//console.log(data);
				});
				
			}
			///////////////////
		}else if($(this).hasClass('to-review')){
				selected.loadReview();
				calculateDistances();
				$('#save-button').animate({marginTop:-100},400);
				$(this).removeClass('to-review').addClass('to-completed');
				$('.active').addClass('completed').removeClass('active').next().addClass('active');
				/* HIDE OLD ELEMENTS */
				
				$('#boxes-main').css({position:'absolute'}).animate({left:'-100%',opacity:0}, 800,function(){
					$(this).hide();
				});
				$('#boxes-sidebar').animate({left:'+=100%'}, 800, function(){
					$(this).hide();
				});
				/* SHOW NEW ELEMENTS */
				$('#review-main').css({display:'block',left:0,opacity:1}).addClass('animate-in2');
				$('#review-sidebar').css({display:'block',left:'75.389362%',opacity:1}).addClass('animate-in2');
				setTimeout(function(){
					$('.animate-in2').removeClass('animate-in2');
				},500);
				currentStep++;
				$.post('/update-inventory',{add_boxes : 1,inventory_obj : selected.categories,activeCats : selected.activeCats,total : selected.total,totalWeight: selected.totalWeight, totalVol :  selected.totalVol},function(data){
					//console.log(data);
				});
		}else if($(this).hasClass('to-completed')){
			//IS EMAIL CHECKED?
			$('.email-container').hide();
			
			$('.active').addClass('completed').removeClass('active').next().addClass('active');
			$(this).hide();
			$('#review-main').css({position:'absolute'}).animate({left:'-100%', opacity:0}, 500, function(){
				$(this).hide();
			});
			$('#review-sidebar').animate({left:'+=100%', opacity:0}, 500, function(){
				$(this).hide();
			});
			$('#back-btn').hide();
			$('.done').show();
			$('#completed-box').find('.big').html(selected.total);
			$('#completed-heading').animate({marginLeft:'0%'},500);
			$('#completed-subheading').animate({marginLeft:'0%'},500);
			$('#completed-box').animate({width:323, height:156},500);
			$('#completed-box').find('.subbox').eq(0).delay(500).fadeIn(500);
			$('#completed-box').find('.subbox').eq(1).delay(700).fadeIn(500);
			$('#completed-box').find('.subbox').eq(2).delay(900).fadeIn(500);
			$('#email-confirm').delay(1000).fadeIn(500);
			$('#comments').animate({width:475, height:255},500);
			currentStep++;
			var Inventory = {};
            $.each(selected.categories, function(key, val) {
            	//console.log(key);
            	//console.log(val);
                if (val.isActive == "true" || key == 'Boxes') {
                    Inventory[key] = {items : []};
                    for ( var i = 1 ; i < val.items.length ; i++) {
                         Inventory[key].items.push({name : items[val.items[i]].item_name , qty :val.itemCount[i] });
                    }
                }
            })
            console.log(Inventory);
            setInventory(3);
			// $.post('/update-inventory',{review_inventory : 1,inventory : Inventory,email_address : $("#user-email").val()},function(data){
			// 	console.log(data);
			// });
			$.post('/update-inventory',{review_inventory  : 1,inventory : Inventory,inventory_obj : selected.categories,activeCats : selected.activeCats,total : selected.total,totalWeight: selected.totalWeight, totalVol :  selected.totalVol, email_address: (emailChecked) ? $("#user-email").val():false  },function(data){
				//console.log(data);
				if(emailChecked){
					sendEmail($("#user-email").val());
					$('.user-email').html(emailChecked);
				}else{
					$('#email-text').html('SEND<br/>EMAIL?');
					$('#email-preface').html('Where do you want your inventory list sent?')
					$('#user-email2').html('<input type="text" class="user-email" placeholder="ENTER EMAIL"><div class="cta" id="email-send"> SEND EMAIL</div>');
					$('#email-btn').addClass('clickable');
				}
			});
		}
	});
	
	//PROGRESS BAR CLICK
	$('.step').on('click', function(){
		var index = $(this).index();
		if($(this).hasClass('completed')){
			$('.active').removeClass('active');
			for(var i = index; i < 4;i++){
				$('.step').eq(i).removeClass('completed');
			}
			$(this).removeClass('completed').addClass('active');
			//HIDE CURRENT STEP
			if(currentStep == 1){
				$('#back-btn').addClass('animate-out');
				$('#items').css({position:'absolute'}).addClass('animate-out');
				$('#sidebar').find('.status-bar').animate({bottom:-47},500);
				setTimeout(function(){
					$('.animate-out').hide().removeClass('animate-out');
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
				$('#completed-heading').delay(800).animate({marginLeft:'-100%'},400);
				$('#completed-subheading').delay(800).animate({marginLeft:'100%'},400);
				$('.email-container').delay(800).fadeIn(400);
				$('#save-button').animate({marginTop:-100},400);
				$('#completed-box').find('.subbox').eq(2).fadeOut(300);
				$('#completed-box').find('.subbox').eq(1).delay(100).fadeOut(300);
				$('#completed-box').find('.subbox').eq(0).delay(200).fadeOut(300);
				$('#completed-box').delay(500).animate({width:0, height:0},500);
				$('#email-confirm').fadeOut(500);
				$('#comments').delay(500).animate({width:0, height:0},400, function(){
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
				$('#save-button').animate({marginTop:35},400);
				
			}else if(index==1){ // Large Items
				$('#save-button').removeClass('to-review').addClass('to-boxes');
				$('#items').show().delay(200).animate({left:'28.096217493089833%',opacity:1},500, function(){
					$(this).css({position:'relative'});
				});
				$('#sidebar').show().delay(200).animate({left:'-3.51064%',opacity:1},500);
				$('#save-button').animate({marginTop:35},400);
			}else if(index==2){ //Add Boxes
				$('#save-button').removeClass('to-completed').addClass('to-review');
				//HIDE CURRENT ELEMENTS
				
				//ANIMATE NEW ELEMENTS
				$('#boxes-main').show().delay(200).animate({left:'0',opacity:1},500, function(){
					$(this).css({position:'relative'});
				});
				$('#boxes-sidebar').show().delay(200).animate({left:'71.789362%',opacity:1},500);
				$('#save-button').animate({marginTop:35},400);
			}else if(index==3){//Review Inventory
				$('#review-main').delay(400).show().animate({left:'0%', opacity:1}, 500);
				$('#review-sidebar').delay(400).show().animate({left:'-=100%', opacity:1}, 500);
				$('#save-button').animate({marginTop:-100},400);
			}
			currentStep = index;
		}
	});
	//RESIZE EMAIL INPUT
	$('#user-email').on('keyup', function(){
		$('.email-counter').eq(1).html($(this).val());
		var width = $('.email-counter').eq(1).outerWidth();
		$(this).css({width:width});
	});
	$('#user-email2').on('keyup', 'input', function(){
		$('.email-counter').eq(0).html($(this).val());
		var width = $('.email-counter').eq(0).outerWidth();
		$(this).css({width:width});
	});
	$('#back-btn').on('click', function(){
		$('.step').eq(currentStep-1).trigger('click');
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
	//REMOVE CATEGORY BTN
	$('#ul-holder').on('click','.close-btn',function(){
		var id = $(this).prev().text();
		var that=this;
		if(selected.categories[id].total == 0){
			$(this).parent().addClass('animate-out');
			
			//console.log(id);
			selected.activeCats.splice(selected.activeCats.indexOf(id),1);
			$(document.getElementById(id.split(' ').join('_'))).parent().fadeIn(0,function(){$(this).addClass('animate-in')});
			checkHeight('#cat-holder');
			//Removes category from sidebar.
			setTimeout(function(){
				$(that).parent().remove();
				$(document.getElementById(id.split(' ').join('_'))).parent().removeClass('animate-in');
				checkHeight('#ul-holder');
			},500);
		}else{
			$('#popup').html('<h4>Warning!</h4><p>The category you are trying to remove has selected items! Removing the category will remove previously selected items. Continue?<br/><br/> <div class="btn" id="continue">CONTINUE</div><div class="btn" id="cancel">CANCEL</div>').show();
			$('#cancel').one('click', function(){
				$('#popup').hide();
			});
			$('#continue').one('click', function(){
				$('#popup').hide();
				$(that).parent().addClass('animate-out');
				selected.activeCats.splice(selected.activeCats.indexOf(id),1);
				$(document.getElementById(id.split(' ').join('_'))).parent().fadeIn(0,function(){
					$(this).addClass('animate-in')
				});
				checkHeight('#cat-holder');
				//Removes category from sidebar.
				setTimeout(function(){
					$(that).parent().remove();
					$(document.getElementById(id.split(' ').join('_'))).parent().removeClass('animate-in');
					checkHeight('#ul-holder');
				},500);
				//Clear categories inventory
				var limit = selected.categories[id].items.length;
				for(var i = 1; i < limit;i++){
				 	selected.updateTotals(-1,(-items[selected.categories[id].items[i]].lbs)*selected.categories[id].itemCount[i],(-items[selected.categories[id].items[i]].cf)*selected.categories[id].itemCount[i]);
				}
				selected.categories[id].isActive = false;
				selected.categories[id].total = 0;
				selected.categories[id].items = [false];
				selected.categories[id].itemCount = [false];
			});
		}	
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
		selected.removeItem(id,currentCat,parseInt($(this).parents('li').attr('data-lbs')),parseInt($(this).parents('li').attr('data-cf')),parentID);
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
		$(document.getElementById('added-'+cat.split(' ').join('_'))).trigger('click');
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
	/************************* STEP 3 EVENTS - ADD BOXES **********************/
	//ADD BOX
	$('#main-holder').on('click', '.item', function(){
		var id = parseInt($(this).attr('data-id'));
			$(this).addClass('owned');
			selected.addItem(id,'Boxes',parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')));
			$(this).find('.controls').stop(true).animate({top:'0%'},200);
		
	});
	//REMOVE BOX
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
	/***************** STEP 4 EVENTS - REVIEW *********************/
	//CHANGE NUMBER OF ITEMS BY CLICK
var initialVal;
	$('#review-main').on('click', 'input', function(){
		//console.log('click')
		//console.log($(this).val());
		//Item Added

		if(parseInt($(this).val()) > parseInt($(this).attr('data-count'))){
			//selected.updateTotals(1,parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')));
			selected.addItem(parseInt($(this).attr('data-id')),$(this).attr('data-cat'),parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')),parseInt($(this).attr('data-parentid')));
		}else if(parseInt($(this).val()) < parseInt($(this).attr('data-count')) && parseInt($(this).attr('data-count')) !== 1){
			//selected.updateTotals(-1,-parseInt($(this).attr('data-lbs')),-parseInt($(this).attr('data-cf')));
			selected.removeItem(parseInt($(this).attr('data-id')),$(this).attr('data-cat'),parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')),parseInt($(this).attr('data-parentid')));
		}
		$(this).attr('data-count',$(this).val());
		initialVal = parseInt($(this).val());
	});
	
	$('#review-main').on('focus', 'input', function(){
		initialVal = parseInt($(this).val());
	}).on('blur','input', function(){
		var finalVal = parseInt($(this).val());
		var diff = finalVal - initialVal;
		for(var i=0;i < Math.abs(diff);i++){
			if( diff <0){//remove items
				selected.removeItem(parseInt($(this).attr('data-id')),$(this).attr('data-cat'),parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')),parseInt($(this).attr('data-parentid')));
			}else if(diff > 0){//add items
				selected.addItem(parseInt($(this).attr('data-id')),$(this).attr('data-cat'),parseInt($(this).attr('data-lbs')),parseInt($(this).attr('data-cf')),parseInt($(this).attr('data-parentid')));
			}
		}
		if(finalVal==0)
			$(this).next().trigger('click');
	});
	$('#review-main').on('click', '.delete', function(){
		var input = $(this).prev();
		var val = input.val();
		for(i=0;i < val;i++){
			selected.removeItem(parseInt(input.attr('data-id')),input.attr('data-cat'),parseInt(input.attr('data-lbs')),parseInt(input.attr('data-cf')),parseInt(input.attr('data-parentid')));
		}
		//input.parents('.item').remove();
		var catLength = input.parents('.category').find('.item').length;
		//console.log(catLength)
		if(catLength%2 == 0){ //even number of items.
			if(input.parents('.category').find('.item').last().is(':empty')){ //last item is empty
				
				if(input.parents('.category').find('.item').length ==2)
					input.parents('.category').remove();
				else{
					input.parents('.category').find('.item').last().remove();
					input.parents('.item').remove();
				}
			}else{
					input.parents('.category').append('<div class="item clearfix"></div>');
					input.parents('.item').remove();
			}
		}
	});
	/***************** STEP 5 EVENTS - COMPLETED ******************/
	var emailRegEx = /[a-zA-Z0-9.!#$%&'*+-\/=?^_`{|}~]+@[a-z0-9-]+\.\w./;
	$('#user-email2').on('click', '#email-send', function(){
		var email = $('#user-email2').find('input').val()
		if(emailRegEx.test(email)) { 
			sendEmail($('#user-email2').find('input').val());
		}
		else{
			$('#user-email2').find('input').addClass('error');
		}
	});
	$('#user-email2').on('focus', 'input', function(){
		$(this).removeClass('error');
	})
	
	$("#btn_feedback").on('click',function(e){
		e.preventDefault();
		var feedback = $("#feedback").val();
		if($.trim(feedback)) {
			//console.log(feedback);
			$.post('/feedback',{feedback : feedback},function(data){
				if(data == "success") {
					$("#comments").html("Thank you for your feedback.");
				}
			});
		} else {
			$("#feedback").focus();
		}
	
	})
	///////// CODE START BY BHAVESH ///////////
	$("#btn_yes").click(function(){
		setInventory(1);
		clearTimeout(t2);
		PageTitleNotification.Off();
		$('section.modal').hide();
	})
	
	$("#btn_no").click(function(){
		setInventory(2);
		PageTitleNotification.Off();
		$('section.modal').hide();
	});
	if(location.host =="gotmovers.com"){
		window.onload = resetTimer;
		// DOM Events
		document.onmousemove = resetTimer;
		document.onkeypress = resetTimer;
		document.onmousedown = resetTimer; // touchscreen presses
		document.onclick = resetTimer;     // touchpad clicks
		document.onscroll = resetTimer;    // scrolling with arrow keys
		document.onkeypress = resetTimer;
	}
	
	var stillAlive = setInterval(function () {
	    $.get("/keep-alive");
	}, 30000);
   ///////// CODE END BY BHAVESH ///////////
	


});
////////FUNCTIONS BY BHAVESH START /////////////////
function setInventory(val) {
	$.post(
		    '/set-inventory',{
				inventory :val
			},
			function(data){
			  
			   var _data = $.parseJSON(data);
			   if(val == 2)
				   window.location = '/thankyou';
//			   else if(val == 3)
//				   window.location.href= '/confirmation';
		});
}

function logout() {
	if(currentStep < 4) {
		$("section.modal").show();
		PageTitleNotification.On("Need more time ?", 2000);
		t2 = setTimeout(function(){
			setInventory(2);
		}, 15000)
	}
}
function resetTimer() {
    clearTimeout(t);
    t = setTimeout(logout, 45000)
    // 1000 milisec = 1 sec
}
var PageTitleNotification = {
    Vars:{
        OriginalTitle: document.title,
        Interval: null
    },    
    On: function(notification, intervalSpeed){
        var _this = this;
        _this.Vars.Interval = setInterval(function(){
             document.title = (_this.Vars.OriginalTitle == document.title)
                                 ? notification
                                 : _this.Vars.OriginalTitle;
        }, (intervalSpeed) ? intervalSpeed : 1000);
    },
    Off: function(){
        clearInterval(this.Vars.Interval);
        document.title = this.Vars.OriginalTitle;   
    }
}
//////// FUNCTIONS BY BHAVESH END /////////////////
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
	$('#email-preface').html('YOUR INVENTORY WAS SENT TO:')
	$('#user-email2').html(email);
	$.post('/send-inventory-email',{email_address: email},function(data){
		//console.log(data);
	});
}
function calculateDistances() {
	var start = '90036';
	var end = '90210';
	if($('#zip_from').val() != ''){
		start = $('#zip_from').val();
	}
	if($('#zip_to').val() != ''){
		end = $('#zip_to').val();
	}
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
	  {
		origins: [start],
		destinations: [end],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		avoidHighways: false,
		avoidTolls: false
	  }, callback);
}

function callback(response, status) {
	if (status != google.maps.DistanceMatrixStatus.OK) {
	  //alert('Error was: ' + status);
	  alert('Error: Please try again at a later time.');
	} else {
	  var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
	  var test = '';
	  var str1 = origins.toString();
	  var str2 = destinations.toString();
	  if( str1.match(/\bUSA\b/) && str2.match(/\bUSA\b/)){
			try{
			  for (var i = 0; i < origins.length; i++) {
				var results = response.rows[i].elements;
				for (var j = 0; j < results.length; j++) {
				   test += results[j].distance.text;
				}
			  }
			  var rooms = 'six bedrooms and more house';
			  if($('#number_of_rooms').val() != ''){
				rooms = $('#number_of_rooms').val()
			  }	  
			  
			  $.post(
					'/validate/calculator/calc',
					{
						rooms: rooms,
						miles: test
					},
					function(data){
						var d = $.parseJSON(data);
						setTimeout(
							function(){
								$('#quote-range').html('$' + d.min + ' - $' + d.max);
//								$('.slide-5-quote div').hide('slide',function(){
//									$(this).next().show('slide',{direction:'right'});
//								});
							}
						, 5 );
					}
				);	  
			  //alert(test);
			}catch(e){
				setTimeout(
					function(){
						$('#quote-range').html('Unable to calculate price range, one or more of your locations may not be accessible by moving trucks');
						$('#range-loader').hide('blind');
						$('#quote-range').show('blind');
					}
				, 5000 );
			}
		}
	  else{
		setTimeout(
			function(){
				$('#quote-range').html('Unable to calculate, Locations may not be in the USA');
				$('#range-loader').hide('blind');
				$('#quote-range').show('blind');
			}
		, 3000 );
	  }
	}
}