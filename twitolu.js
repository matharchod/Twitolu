//Use PHP to get a list of tweets in JSON format
//Use the first word or phrase from the tweet as the category for that tweet
//Use the URL from the tweet as the link for its tile 
var Twitolu = (function () {

	//Create persistent storage for Favorites in a closure
	var Faves = [];

	//Create persistent storage for Tweets in a closure
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
	
	//Make a synchronous call to get Tweets
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
	
	//Create a word cloud from the tags extracted from the Tweet text						
	var WordCloud = function () {
		
		var wordCloud = [],
			Tweets = Twitolu.Tweets();
							
		var cloud = [],
			duplicate = cloud[0];
							
		for (i in Tweets) {
			
			var x = Tweets[i].text.split('. ')[0];
			
			//console.log(x.length);
			
			if (x.length >= 22 || x == 'undefined') {
				//return an empty string
				console.log('too long: ' + x);
			} else {
				//correct special characters
				//and return the tag
				cloud.push((x).replace(/&amp;/g,"&"));
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
	
	
	//Use the Tweets to create tiles	
	var TileFactory = function () {
				
		//Create place to collect tiles for future reference
		var TilesCollection = [],
			result = Tweets();
		
		for (i in result) {
			
			var fixSpecials = function(txt) {
				return (txt).replace(/&amp;/g,"&");//corrects ampersands
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
					ID: result[i].id_str,
					date: result[i].created_at,
					media: result[i].entities.media,
					popularity: result[i].favorite_count,
					fave: null
	            
	            } 
			
			TilesCollection.push(tile);
					 
			//console.log( tilesCollection );

		}
		
		Tweets(TilesCollection);
		return Tweets();
						
		//console.log( "TilesCollection: ", TilesCollection ); 
		
	}
	
	
	
	var RecipientFactory = function () {
		
		
	} 
	
	var Search = (function () {
		
		var elem = '.tweetItem';
		
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
		
	})();
		 
	 	
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
		Faves: Faves,
		Search: Search,
		Archive: Archive,
		TileFactory: TileFactory,
		RecipientFactory: RecipientFactory,
		WordCloud: WordCloud
	
	}
	
})();


NEWchangeMeToRandomColor = function(elem){
	//http://paulirish.com/2009/random-hex-color-code-snippets/	
	var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var bgcolor = (!bgcolor) ? randomColor : bgcolor ;
	$(elem).css({'background-color': bgcolor});		
};

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
		$('.card:not(:contains(' + tag + '))').each(function(){
		$(this).hide();
		//console.log($(this));
	});
	$('.card:contains(' + tag + ')').each(function(){
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
	console.log(tag);
};

addFavorite = function(tileID) {
    
    var Tiles = Twitolu.Tweets();
    
    Tiles.forEach(function(tile){
	            
        if ( tile.ID == tileID ) {
            //console.log(tile);
			tile.fave = 'active';
			console.log('add Fave:',tile);
        }

    });
    
}

removeFavorite = function(tileID) {
    
    var Tiles = Twitolu.Tweets();
    
    Tiles.forEach(function(tile){
	            
        if ( tile.ID == tileID ) {
	        
	        var tileIndex = Tiles.indexOf(tile);
	        
            console.log('remove Fave tileIndex:',tileIndex);
            
	        tile.fave = null;
	        
        }

    });
            
}






