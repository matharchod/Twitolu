//Use PHP to get a list of tweets in JSON format
//Use the first word or phrase from the tweet as the category for that tweet
//Use the URL from the tweet as the link for its tile 
var Twitolu = (function () {

	//Create persistent storage for Tweets in a closure
	var Tweets = (function (input) {			
		var x;
		return function (input) {			
			if (!input) {
				return x;
			} else {
				x = input;
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
	
	//Create persistent storage for Recipients
	var Recipients = (function (input) {		
		
		//check for recipients in web storage	
		var x = JSON.parse( localStorage.getItem('TwitoluRecipients') );
		
		//if nothing in web storage, create empty object for storage
		if (x === null) {
			x = []; 
			localStorage.setItem('TwitoluRecipients', JSON.stringify(x) );
		}	
		
		return function (input) {		
			
			if (!input) {
				return x;
			} else {
				x.push(input);
				//set new archive contents
				localStorage.setItem('TwitoluRecipients', JSON.stringify(x) );
				return x;	
			}
		}
		
	})();
	
	//Create persistent storage for Favorites in a closure
	var Favorites = (function (input) {			
		var x = [];
		return function (input) {			
			if (!input) {
				return x;
			} else {
				x.push(input);
				return x;	
			}
		}
		
	})();
	
	var AddFavorites = function(tileID) {
	    //var Tiles = Twitolu.Tweets();
	    Tiles.forEach(function(tile){
	        if ( tile.ID == tileID ) {
	            //console.log(tile);
				tile.faveStatus = 'active';
				console.log('add Fave:',tile);
				Twitolu.Favorites(tile);
	        }
	    });
	
		console.log( 'Twitolu.Favorites:',Twitolu.Favorites() );
	};
	
	var RemoveFavorites = function(tileID) {
	    //var Tiles = Twitolu.Tweets();
	    var Faves = Twitolu.Favorites();
	    Tiles.forEach(function(tile){
	        if ( tile.ID == tileID ) {
		        tile.faveStatus = null;
	        }
	    });
	    Faves.forEach(function(tile){
	        if ( tile.ID == tileID ) {
		        
				var tileIndex = Faves.indexOf(tile);
				
				//console.log('tileIndex:',tileIndex);
				console.log('remove Fave at index: ' + tileIndex , tile.text);
				
				var x = Faves.splice(tileIndex, 1);
				
				tile.faveStatus = 'inactive';
				
				return x;
				
				//console.log( 'splice result:', x );
	        }
	    });
		console.log( 'Twitolu.Favorites:',Twitolu.Favorites() );
	            
	};

	var SearchByTag = function(tag){ //searchTags
		
		var tag = tag.trim(),
			count = 0;
		
		Tiles.forEach(function(tile){
			if (tag == tile.tag) {
				count++;
				tile.tileStatus = 'active'
				console.log(tile.text);
			} else {
				tile.tileStatus = 'inactive'
			}
		});	
		
		console.log(tag);
				
	};
	
	var Reset = function () {
				
		Tiles.forEach(function(tile) {
			tile.tileStatus = 'active'
		});
		
	}	
			
	//Create a word cloud from the tags extracted from the Tweet text						
	var WordCloud = function () {
		
		var wordCloud = [],
			Tweets = Twitolu.Tweets();
							
		var cloud = [],
			duplicate = cloud[0];
							
		for (i in Tweets) {			
			var x = Tweets[i].text.split('. ')[0];			
			//console.log(x.length);			
			if (x.length >= 24 || x == 'undefined') {
				//return an empty string
				//console.log('not a tag: ' + x);
			} else {
				//correct special characters
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
					//return the display url
					return URL_obj.url;
				}
			}
			
			//IF A TAG IS NOT PRESENT
			var Tag = function() {
				if (Tag_obj.length >= 24) {
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
				tileStatus: 'active',
				faveStatus: null,
				sendStatus: null
	            
	        } 
			
			TilesCollection.push(tile);
					 
			//console.log( tilesCollection );

		}
		
		Tweets(TilesCollection);
		return Tweets();
						
		//console.log( "TilesCollection: ", TilesCollection ); 
		
	}
		
	var Search = (function () {
		
		var elem = '.tweetItem';
		
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
		$('.searchNow').click(function () {
			var filter = $('#filter').val(),
					count = 0;
			$(elem).each(function () {
				//Runs a case-insensitive regular expression on each tweet for that value 
				if ($(this).text().search(new RegExp(filter, "i")) < 0) {
					//Toggles visibility
					$(this).hide();
				} else {
					$(this).show();
					count++; //Shows the number of tweets that match the search
				}
			});	
			// Update the tweet count for matched items
			var numberItems = count;
			$('#filter-count').text(count).show();
			return false;
		});	
		
	})();
	
	//PUBLIC METHODS
	return {
		
		Tweets: Tweets,
		Favorites: Favorites,
		AddFavorites: AddFavorites,
		RemoveFavorites: RemoveFavorites,
		Recipients: Recipients,
		Search: Search,
		Reset: Reset,
		SearchByTag: SearchByTag,
		TileFactory: TileFactory,
		WordCloud: WordCloud
	
	}
	
})();


randomColor = function(){
	//http://paulirish.com/2009/random-hex-color-code-snippets/	
	var color = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var bgcolor = (!bgcolor) ? color : bgcolor;
	return bgcolor;		
};

//Recipient form	
addRecipient = function() {
	
	var person = {
		idx: Math.floor(Math.random() * 90000) + 10000,
		FName: $('form input#FName').val(),
		LName: $('form input#LName').val(),
		Email: $('form input#Email').val()
	}
			
	console.log('addRecipient:', person );
	
	return Twitolu.Recipients(person);
}

//Remove Recipient	
removeRecipient = function(idx) {
	
	var Recipients = Twitolu.Recipients();	
	
	Recipients.forEach(function(person,arrIndex){
		
		//console.log('person:', person, person.idx, arrIndex );
		
		if (person.idx == idx) {
			
			Recipients.splice(arrIndex,1);
			
			localStorage.setItem( 'TwitoluRecipients', JSON.stringify(Recipients) );
			
			console.log('person FOUND:', person, person.idx, arrIndex );
			
		}
		
	});
	
	console.log('recipient ready to remove:', idx );
	console.log('new recipients:', Recipients );
	
	
	return Twitolu.Recipients();
}






































          






