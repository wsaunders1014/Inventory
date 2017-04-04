<?php ?>
<!DOCTYPE html>
	<head>
		<meta http-equiv="Content-Type" content="text/html" charset="utf-8">
		<title>Inventory - Powered By iMover </title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
		<link rel="stylesheet" type="text/css" href="css/style.css">
	</head>
	<body>
		<header>
			<div id="logo" class="clearfix">
				<h1>
					<span class="imover">INVENTORY</span>
				</h1>
				<div class="slash"></div>
				<div id="powered-by">Powered by iMover&trade;</div>
			</div>
			<div id="call-now">
				<div class="call-text">CALL NOW</div>
				<div class="number">
					<span class="imover">(310) 807-6300</span>
				</div>
			</div>
		</header> 
		<div style="min-height:calc(100% - 145px);overflow:visible;width:100%">
			<div id="wrapper">
				<div id="progress-bar" class="clearfix">
					<div class="step active"><div class="select-bg"></div><span>SELECT CATEGORIES</span><img src="img/checkmark.svg"></div>
					<div class="step two"><div class="select-bg"></div><span>LARGE ITEMS</span><img src="img/checkmark.svg"></div>
					<div class="step two"><div class="select-bg"></div><span>ADD BOXES</span><img src="img/checkmark.svg"></div>
					<div class="step three"><div class="select-bg"></div><span>REVIEW INVENTORY</span><img src="img/checkmark.svg"></div>
					<div class="step"><div class="select-bg"></div><span>COMPLETED</span><img src="img/checkmark.svg"></div>
				</div>
				<!-- <h3>Please <bold>select</bold> the categories that apply to your move.</h3> -->
				<div id="content" class="clearfix">
					<div id="categories" class="main">
						<div class="heading cancelSelect">Please <bold>select</bold> the categories that apply to your move.</div>
						<div class="overflow">
							<div id="cat-holder" class="holder clearfix">
								
							</div>
						</div>
					</div>
					<div id="sidebar" class="sidebar">
						<div class="wrapper">
							<div class="heading cancelSelect">Your Categories</div>
							<div class="overflow">
								<div id="ul-holder" class="holder">
									<ul>
										
									</ul>
								</div>
							</div>
							<div class="status-bar" style="bottom: -47px">
								<span>TOTAL ITEMS:</span><span id="total-items" class="bolded">0</span>
							</div>
						</div>
						<div class="back-btn"></div>
					</div>
					<div id="items" class="main">
						<div class="heading cancelSelect"><span>All Items</span>
							<div class="search-bar">
								<input type="text" id="search" placeholder="Search for Item..." />
								<div id="search-image" class="search"></div>
								<div id="search-results" class="search">
									<ul>
										
									</ul>
								</div>
							</div>
						</div>
						<div class="overflow">
							<div id="items-holder" class="holder">
							</div>
						</div>
						<div class="status-bar">
							<div id="item-weight">APPROX WEIGHT: <span class="bolded">0 lbs.</span></div>
							<div id="item-vol">APPROX VOL.: <span class="bolded">0 CF</span></div>
							<div class="next">Next Category: <span id="next-cat"> Sofas ></span></div>
						</div>
					</div>
					<div id="boxes-main" class="main">
						<div class="heading cancelSelect">Please <bold>select</bold> the boxes that apply to your move.</div>
						<div class="overflow">
							<div id="main-holder" class="holder clearfix">
								
							</div>
						</div>
					</div>
					<div id="boxes-sidebar" class="sidebar">
						<div class="wrapper">
							<div class="heading cancelSelect">Added Boxes</div>
							<div class="overflow">
								<div id="box-holder" class="holder">
									<ul>
										
									</ul>
								</div>
							</div>
						</div>
					</div>
					<div id="review-main" class="main">
						<div class="heading">Your Inventory</div>
						<div id="review-holder" class="clearfix">
							
						</div>
					</div>
					<div id="review-sidebar" class="sidebar">
						<div class="heading">Your Stats</div>
						<div class="dark-grey">
							<span class="title">TOTAL ITEMS</span>
							<span class="info" id="item-count">35<sup>ITM</sup></span>
						</div>
						<div>
							<span class="title">APRX. VOL</span>
							<span class="info" id="total-vol">150<sup>CF</sup></span>
						</div>
						<div class="dark-grey">
							<span class="title">APRX. LBS</span>
							<span class="info" id="total-weight">1100<sup>LBS</sup></span>
						</div>
						<div>
							<div class="quote-title">QUOTE RANGE ESTIMATES</div>
							<div id="quote-range">$2150 - $4560</div>
						</div>
					</div>
					<div id="completed-heading" class="done">
						<h2>Thanks for submitting your inventory.</h2>
					</div>
					<div id="completed-subheading" class="done">
						<h4>Remember, you can always come back and update your list.</h4>
					</div>
					<div id="completed-box" class="done clearfix">
						<div class="subbox"><div class="big">178</div><div class="small"> ITEMS</div></div>
						<div class="subbox clickable" id="download-btn"><img src="img/download.svg"><div class="small">DOWNLOAD<br/>INVENTORY</div></div>
						<div class="subbox" id="email-btn"><img src="img/email-sent.svg"><div class="small" id="email-text">EMAIL<br/>SENT</div></div>
					</div>
					<div id="email-confirm" class="done">
						<div id="email-preface">YOUR INVENTORY WAS SENT TO:</div>
						<span class="email-counter"></span>
						<div id="user-email2"></div>
					</div>
					<div id="comments" class="done">
						How was your experience? Was this site easy to use?<br/>
						<form>
							<textarea placeholder="Enter feedback..."></textarea>
							<button class="cta" type="submit">SUBMIT FEEDBACK</button>
						</form>
					</div>
					<div id="back-btn"></div>
				</div>
				<div class="clearfix">
					<div class="email-container">
						<span class="email-counter"></span>
						<input type="text" id="user-email" class="user-email" placeholder="ENTER EMAIL" maxlength="40" name="user-email" value="test@test.com"><br/>
						<div class="checkbox">
							<div class="squaredTwo">
								<input type="checkbox" id="terms" name="terms" value="agree" checked/><label for="terms"></label> 
							</div>
						</div>
						<div class="label">Save and email me a copy of my inventory list.</div>
					</div>
					<div id="save-button" class="to-items cta">SAVE + CONTINUE</div>
				</div>
			</div>
			<!-- <div id="modal">
				<div id="popup" class="link">
					<div id="call-out" class="clearfix">
						<div class="imover-logo"></div>
						<h4>Download iMover</h4>
						<p>Text me the app download link:</p>
						<form id="link-send" class="clearfix">
							<input type="tel" name="phone" id="user-phone" placeholder="(XXX) XXX - XXXX" />
							<div id="submit-btn">TEXT ME A LINK</div>
						</form>
					</div>
					<div class="close-btn"></div>
				</div>
			</div> -->
		</div>
 		<footer class="clearfix">
			<ul id="links-menu" class="clearfix">
				<li><a href="#">Privacy Policy</a></li>
				<li><a href="#">Terms of Use</a></li>
				<li><a href="#">Contact</a></li>
			</ul>
			<ul id="social-menu" class="clearfix">
				<li><a class="fb" href="#"></a></li>
				<li><a class="twt" href="#"></a></li>
				<li><a class="inst" href="#"></a></li>
			</ul>
			<a href="#" id="imover-link"><span class="icon"></span>Moving? Download the iMover app.</a>
			<div id="copyright">&copy; 2016 iMover</div>
		</footer>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

		<script src="js/will.js"></script>
	</body>
</html>