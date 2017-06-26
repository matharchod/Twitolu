//Flitter
//I created this app to help me orgnize, visualize and socialize my Twitter feed.
//I have used Twitter since it first became available to the public. 
//I like the medium of microblogging to quickly create snippets of the cool things I see online every day.
//However, there aren't many tools that allow you to look back through history to remind you what you were thinking about last week.
//This app retrieves my last 200 tweets
//seperates them into categories
//transforms each one into a tile with controls for sharing their content
//allows searching 

//Functions:
//appInit
//cloudInit
//searchInit
//toggleWordCloud
//clearSearch
//buildTweets
//showOnlyFavoirties
//createWordCloud
//NEWchangeMeToRandomColor
//shareFavorites
//searchByTag 


//Use PHP to get a list of tweets in JSON format
//Use the first word or phrase from the tweet as the category for that tweet
//Use the URL from the tweet as the link for its tile 
var Twitolu = (function () {

	var Tweets = (function (result) {	
		
		var x;
		
		return function (result) {
			
			if (!result) {
				
				return x;
				
			} else {
				
				x = result;
				return x;
				
			}
			
		}
		
	})();
	
	var getTweets = (function () {
				
		//Use AJAX to get the latest tweets
		$.ajax({
			url: "/Twitolu/tmhOAuth-master/tweets_json.php?count=200",
			type: "GET",
			dataType: "json",
			async: false,
			success: function(result){
			 	Tweets(result);	
			},
			error: function(err){
				console.log(err);
				alert("Error with JSON: " + err);
			}
						
		});
				
	})();
							
	var WordCloud = function () {
		
		var wordCloud = [],
			Tweets = Twitolu.Tweets();
							
		var cloud = [],
			duplicate = cloud[0];
			
		var fixSpecials = function(txt) {
			return (txt).replace(/&amp;/g,"&");
		}
				
		for (i in Tweets) {
			
			var x = Tweets[i].text.split('. ')[0];
			
			if (x >= 20) {
				//return an empty string
				return;
			} else {
				//return the tag
				cloud.push(x);
			}
									
		}
		
		cloud.sort();
				
		for (i in cloud) {
			
			if (cloud[i] !== duplicate) {
				wordCloud.push(duplicate);
				//console.log('Duplicate : ' + duplicate);
			} 
			
			duplicate = cloud[i];
						
		}
		
		wordCloud = wordCloud.splice(1); //remove undefined tags
						
		//console.log('wordCloud', wordCloud);
				
		return wordCloud;
		
	}
		
	var TileFactory = function () {
		
		//getTweets();
		
		//Create place to collect tiles for future reference
		var TilesCollection = [],
			result = Tweets();
		
		for (i in result) {
			
			var fixSpecials = function(txt) {
				return (txt).replace(/&amp;/g,"&");
			}
			
			var Text_obj = fixSpecials(result[i].text);
				URL_obj = result[i].entities.urls[0],
				Tag_obj = fixSpecials(result[i].text.split('. ')[0]), //extract tag from text string using a delimitor
				Media_obj = result[i].entities.media;
				
			
			//REMOVE LINK FROM TEXT
			var Text = function() {
				//use display url to find link in text and remove it
				return Text_obj.split('http')[0];
			}
			
			//IF A URL IS UNDEFINED
			var URL = function() {
				if (URL_obj === undefined) {
					//show the first URL found in the string
					return 'http' + Text_obj.split('http')[1];
				} else {
					//show the display url
					return URL_obj.url;
				}
			}
			
			//IF A TAG IS NOT PRESENT
			var Tag = function() {
				if (Tag_obj.length >= 20) {
					//return an empty string
					return;
				} else {
					//return the tag
					return Tag_obj;
				}
			}
			
			//Use the factory to create each tile
			var tile = {
										
					text: Text(),
					tag: Tag(),
					URL: URL(),
					date: result[i].created_at,
					media: result[i].entities.media,
					popularity: result[i].favorite_count
	            
	            } 
			
			TilesCollection.push(tile);
			 
			//console.log( tilesCollection );

		}
		
		return TilesCollection
						
		//console.log( "TilesCollection: ", TilesCollection ); 
		
	}
	
	
	
	var RecipientFactory = function () {
		
		
	} 
		 
	 	
	var Archive = function (type, item) {
				
		this.addItems = function(type, item) {
			var x = localStorage.setItem('type', JSON.stringify(item));
			console.log('item added', this.viewItems());
		};
		var removeItems = function(type, item) {
			var x = localStorage.setItem('type', JSON.stringify(item));
			console.log('item removed', x);
		};
		var viewItems = function(type, itemId) {
			var x = localStorage.gettItem('type', JSON.stringify(item));
			console.log('item viewed', x);
		};
		
	}
	
	//PUBLIC METHODS
	return {
		
		Tweets: Tweets,
		Archive: Archive,
		TileFactory: TileFactory,
		RecipientFactory: RecipientFactory,
		WordCloud: WordCloud
	
	}
	
})();


appInit = function(){
	searchInit('#tweets li:not(.cloud)');		
	
	$('.favoriteLink').click(function(){
		toggleFavorites($(this),'favorite');
	});	
	
	$('.shareLink').click(function(){
		shareFavorites($(this));
	});	
	
	$('.gotoTop').click(function(){
		$('html, body').animate({ scrollTop: 0 }, "slow");		
	});	
	$('#tweets li').each(function(){
		NEWchangeMeToRandomColor($(this));
	});	
	$('.onlyFaves').click(function(){
		showOnlyFavoirties();
	});	
    $('.tag').click(function(){
	    $('#filter').val($(this).text());
      hideWordCloud('.cloud');
	    $('.searchNow').click();
	    $('html, body').animate({ scrollTop: 0 }, "slow");	
    });	
    $('#toggleWordCloud').click(function(){
	    toggleWordCloud('.cloud');
    });	
}

cloudInit = function(){
  $('.cloud').click(function(){
    $('#filter').val($(this).text());
    $('.searchNow').click();
    $('html, body').animate({ scrollTop: 0 }, "slow");	
    hideWordCloud('.cloud');
  });	
}

toggleWordCloud = function(cloudLinks){
	if ($(cloudLinks).hasClass('visible')==true) {
		hideWordCloud(cloudLinks);	
	} else {
		showWordCloud(cloudLinks);
	}
}

showWordCloud = function(cloudLinks){$(cloudLinks).addClass('visible')}
hideWordCloud = function(cloudLinks){$(cloudLinks).removeClass('visible')}

clearSearch = function() {
	$('#filter').val('');
	$('.tags .content').empty();
	$('#filter-count').hide();	
	$('.shareLink').html('Send');
};

//Each tweet is transformed into a tile
//Tiles allow me to manipulate each tweet seperately or in groups
//Group several tiles as Favorites
//Send the content of each tile as an email
//Send a group of Favorites as a single email 
//Create category links that will search for all tweets that match that category
buildTweets = function(tweetLink, tweetText, tweetTag){	
	var tweet = tweetText.replace(tweetLink,'');
	//console.log('tweetTag.length =', tweetTag.length);
	if (tweetTag.length >= 30) {
		tweetTag = '';
	} else {
		tweetTag = tweetTag;
	}
	$('#tweets .container').append('<li class="tweetItem">' 
		+ '<p>' + tweet + '</p><span>'
		+ '<div class="table">'
		+ '<a class="gotoTop" style="width:0px;">&uarr;</a>'
		+ '<a class="favoriteLink" style="width:0px;">&hearts;</a>'
		+ '<a class="shareLink">Send</a>'
		+ '<a class="tag">' + tweetTag + '</a>'
		+ '<a href="' + tweetLink + '" class="openTweet" style="width:50px;">' + tweetLink + '</a>' 
		+ '</div>'				
		+ '</span><span class="shade"></span></li>');		
}

showOnlyFavoirties = function(){
	$('.tweetItem').not('.favorite').hide();	
}

showAllTweets = function(){
	$('.tweetItem').show();	
}

NEWchangeMeToRandomColor = function(elem){
	//http://paulirish.com/2009/random-hex-color-code-snippets/	
	var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var bgcolor = (!bgcolor) ? randomColor : bgcolor ;
	$(elem).css({'background-color': bgcolor});		
};

shareFavorites = function($_this){
	
	var tweetsToSend = [];
	var	tweetContent = $_this.closest('.tweetItem').text().replace('%20%E2%86%91%E2%99%A5Send','');
		
	function closeMe(){
		$('#zerostate').fadeOut(function(){
			$('#zerostate').remove();
		});
	}
	
	if ($('.favorite, #zerostate').length <= 0){		
		var shareContent = tweetContent;
		
		emailTweets(shareContent);
		
		console.log(shareContent);
		/*
		$_this.parent().prepend('<li id="zerostate">' 
		+ '<a class="close">&times;</a>'
		+ '<p>Click something, fool!</p>'
		+ '</li>');
		*/
		
		$('.close').click(function(){closeMe()});
		
	} else {
		$('.favorite').each(function(){
			var	tweetContent = $(this).find('p').text();
			var	tweetContentLink = $(this).find('.openTweet').attr('href');	
			tweetsToSend.push([tweetContent + tweetContentLink]);			
		});	
		var x = tweetsToSend.join('\n\n').toString();
		//var y = encodeURIComponent(x);
		//var y = x.replace(/&/ig,'&');
		
		emailTweets(x);
		//%0D%0A
		console.log('tweetsToSend = \n', x);
		
	}
		
}

emailTweets = function(shareContent){	
	var content = encodeURIComponent(shareContent);
	window.location = 'mailto:' 
		+ ' ' 
		+ '?subject=' + 'Cool Stuff in Web Development'
		+ '&body=Jani says:' 
		+ '%0D%0A%0D%0A-----%0D%0A%0D%0A'
		+ content
		+ '%0D%0A%0D%0A-----%0D%0A%0D%0A' 
		+ 'Find more cool stuff in the UX diary of Jani Momolu Anderson at http://janianderson.com/#diary';
}

toggleFavorites = function ($_elem, activeClass){
	var $_thisParent = $_elem.closest('.tweetItem');	
	if ($_thisParent.hasClass(activeClass) == false){
		$_thisParent.addClass(activeClass);
	} else {
		$_thisParent.removeClass(activeClass);
	}
	if ($('.favorite').size()==1){
		$('.shareLink').text('');
		$('.favorite .shareLink').html('Send');		
	} 	
	else if ($('.favorite').size()>1){
		$('.shareLink').text('');
		$('.favorite .shareLink').html('Send All &hearts;');
	} else {
		$('.shareLink').text('Send');
	}
}

//SEARCH
searchInit = function (elem) {
  //The search functionality in the Portfolio section is a DOM search.
  //I use the searchInit function to create a jQuery-wrapped set of elements to limit the search.
  //USEAGE: searchInit('#elem');
  
	//prevent default ENTER key
	$('input').keypress(function (evt) {
		//Deterime where our character code is coming from within the event
		var charCode = evt.charCode || evt.keyCode;
		if (charCode == 13) { //Enter key's keycode
			//Simulate a click on the "search" button
			$('.searchNow').click();
		}
	});	
	//Event handler for the "search" button
	//Takes the value of the seach field
	//Runs a case-insensitive regular expression on each tweet for that value 
	//Toggles the visibility on tweets that match the regex
	//Shows the nuber of tweets that match the search
	$('.searchNow').click(function () {
		var filter = $('#filter').val(),
				count = 0;
		$(elem).each(function () {
			if ($(this).text().search(new RegExp(filter, "i")) < 0) {
				$(this).hide();
			} else {
				$(this).show();
				count++;
			}
		});	
		// Update the tweet count for matched items
		var numberItems = count;
		$('#filter-count').text(count).show();
		return false;
	});	
	//Clears the search box
	//shows all tweets 
	//resets the tile controls
	$('.clearSearch').click(function(){	
		$('#filter').val('');
		$(elem).show();
		$('#filter-count').hide();	
		$('.tweetItem').removeClass('favorite');	
		$('.shareLink').html('Send');
	});
};


searchByTag = function(tag){ //searchTags
	var count = 0;
	$('.content li:not(:contains(' + tag + '))').each(function(){
		$(this).hide();
		//console.log($(this));
	});
	$('.content li:contains(' + tag + ')').each(function(){
		count++;
		$(this).show();
		$('#filter-count').text(count).show();
	});
	$('.tags a').each(function(){
		if ( $(this).attr('rel') !== tag && $(this).hasClass('active') === false){
			$(this).addClass('inactive');
		} else {
			$(this).addClass('active').removeClass('inactive');	
		}
	});	
};


