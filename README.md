Twitolu
=======

### Organize, visualize and socialize your Twitter feed.
### PLEASE NOTE: These docs are in-progress and will be finished shortly.


I've used Twitter for years. I prefer the medium of microblogging to quickly create snippets of the cool things I see online every day and share them easily.However, there aren't many tools that allow me to look back through my tweet history to remind me what I tweeted last week or last month.

I use a period-delimited format to organize my tweets into categories.
Twitolu takes advantage of this format and creates an interactive word cloud that creates links based on these categories.
I can click on a category in the word cloud and see only the tweets that match those categories.
I can also group tweets into lists of Favorites and share those Favorites via email.
This is valuable to me as a means of recalling important links as well as sharing those links with collegues.

## Basic Functionality
* Retrieve my most recent tweets (maximum of 200) from Twitter
* Organize those tweets into categories
* Transform each tweet into a tile with controls for sharing its content
* Allow text searching of my most recent tweets 

## Setup and Dependencies
Twitolu uses PHP to authorize a connection to Twitter and retrieve your most recent tweets in JSON format. I'm using [thmOAuth](https://github.com/themattharris/tmhOAuth), an OAuth library written in PHP by @themattharris.

## Main Functions
These functions represent the major aspects of the app. 

* buildTweets()
* searchByTag()
* createWordCloud()
* emailTweets()
* toggleFavorites()
* shareFavorites()

## Helper Functions
I use helper functions to give me more flexibility in the UI by allowing me to invoke functionality more granularly.

* appInit()
* cloudInit()
* searchInit()
* clearSearch()
* showWordCloud()
* hideWordCloud()
* toggleWordCloud()
* countCloudItems()
* buildTweetList()
* showOnlyFavoirties()
* NEWchangeMeToRandomColor()

## Descriptions

#### buildTweets()

Twitolu uses JSON to create a set of "tiles". Tiles allow me to manipulate each tweet seperately or in groups. Each tile contains:
* a tweet
* its category (or `tag`)
* a link to mark it as a Favorite
* a Send link to share it as an email
* the URL contained in the tweet
* a link that takes the user back to the top of the page (for mobile users)

This function performs the following operations:
* Transform each tweet into a tile
* Group several tiles as Favorites
* Send the content of each tile as an email
* Send a group of Favorites as a single email 
* Create category links that will search for all tweets that match that category

```
buildTweets = function(tweetLink, tweetText, tweetTag){	
	var tweet = tweetText.replace(tweetLink,'');
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
```

#### searchInit(elem)

Twitolu's search functionality is based on a DOM search. This function takes `elem` as an argument representing the wrapped set of DOM elements on which to perform the search.

* Create an event handler for hitting the RETURN/ENTER button
* Create an event handler for the "search" button
* Read the value of the seach field
* Run a case-insensitive regular expression on each tweet for that value 
* Toggle the visibility on tweets that match the regex
* Show the number of tweets that match the search
* Create an event handler to clear the search results


```
searchInit = function (elem) {
	$('input').keypress(function (evt) {
		var charCode = evt.charCode || evt.keyCode;
		if (charCode == 13) { 
			$('.searchNow').click();
		}
	});	
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
		var numberItems = count;
		$('#filter-count').text(count).show();
		return false;
	});	
	$('.clearSearch').click(function(){	
		clearSearch();
	});
};
```


#### searchByTag(tag)

This is a helper function that takes the category, or `tag`, as an argument by which to filter the search results.

* Search all tweets for an instance of `tag`
* Toggle "active" and "inactive" states on tweets that contain `tag`

```
searchByTag = function(tag){ 
	var count = 0;
	$('.content li:not(:contains(' + tag + '))').each(function(){
		$(this).hide();
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
```

#### createWordCloud()

This is a helper function involved in creating the word cloud. THIS WILL PROBABLY BE DEPRICATED IN THE NEXT VERSION. 

```
createWordCloud = function(){
	var cloud = [],
		cloud2 = [];
	$('.tweetItem p').each(function(){
		var x = $(this).text().split('.')[0];
		cloud.push(x);
	});
	cloud.sort();
	var last = cloud[0];
	for (var i=1; i<cloud.length; i++) {
	   if (cloud[i] == last) {
	   	cloud2.push(last);
	   	};
	   last = cloud[i];
	}
	countCloudItems(cloud2);
};
```

#### emailTweets(shareContent)

This function takes the argument `shareContent`, which contains the tweets you wish to share via email.

* Encode the URLs in `shareContent` for email 
* Open the user's default email program
* Create the email 

```
emailTweets = function(shareContent){	
	var content = encodeURIComponent(shareContent);
	window.location = 'mailto:' 
		+ ' ' 
		+ '?subject=' + 'Cool Stuff from Twitolu'
		+ '&body=Twitolu says:' 
		+ '%0D%0A%0D%0A-----%0D%0A%0D%0A'
		+ content
		+ '%0D%0A%0D%0A-----%0D%0A%0D%0A' 
}
```

#### toggleFavorites()


```
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
```


#### shareFavorites()

```
shareFavorites = function($_this){
	
	var tweetsToSend = [],
  		tweetContent = $_this.closest('.tweetItem').text().replace('%20%E2%86%91%E2%99%A5Send','');
		
	function closeMe(){
		$('#zerostate').fadeOut(function(){
			$('#zerostate').remove();
		});
	}
	
	if ($('.favorite, #zerostate').length <= 0){		
		var shareContent = tweetContent;
		emailTweets(shareContent);
		$('.close').click(function(){closeMe()});
		
	} else {
		$('.favorite').each(function(){
			var	tweetContent = $(this).find('p').text();
			var	tweetContentLink = $(this).find('.openTweet').attr('href');	
			tweetsToSend.push([tweetContent + tweetContentLink]);			
		});	
		var x = tweetsToSend.join('\n\n').toString();		
		emailTweets(x);
	}
		
}
```

#### appInit()

```
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
```


#### cloudInit()


```
cloudInit = function(){
  $('.cloud').click(function(){
    $('#filter').val($(this).text());
    $('.searchNow').click();
    $('html, body').animate({ scrollTop: 0 }, "slow");	
    hideWordCloud('.cloud');
  });	
}
```



#### clearSearch()


```
clearSearch = function() {
	$('#filter').val('');
	$('.tags .content').empty();
	$('#filter-count').hide();	
	$('.shareLink').html('Send');
};
```



#### showWordCloud()


```
showWordCloud = function(cloudLinks) {
  $(cloudLinks).addClass('visible');
}
```



#### hideWordCloud()


```
hideWordCloud = function(cloudLinks) {
  $(cloudLinks).removeClass('visible');
}
```



#### toggleWordCloud()


```
toggleWordCloud = function(cloudLinks){
	if ($(cloudLinks).hasClass('visible')==true) {
		hideWordCloud(cloudLinks);	
	} else {
		showWordCloud(cloudLinks);
	}
}
```



#### countCloudItems()


```
toggleWordCloud = function(cloudLinks){
	if ($(cloudLinks).hasClass('visible')==true) {
		hideWordCloud(cloudLinks);	
	} else {
		showWordCloud(cloudLinks);
	}
}
```



#### buildTweetList()


```
buildTweetList = function() {
	$.ajax({
		url: "/LINKTOYOURPROJECTROOT/twitolu/tmhOAuth-master/tweets_json.php?count=200",
		type: "GET",
		dataType: "json",
		success: function(result){
			for (i in result) {
				var tweetId = i,
					tweetText = result[i].text,
					tweetTag = result[i].text.split('. ')[0],
					tweetURLS = result[i].entities.urls;
				for (x in tweetURLS) {
					var tweetLink = tweetURLS[x].url;
					buildTweets(tweetLink, tweetText, tweetTag);				
				}	
			}			
			appInit();
			createWordCloud();
			$('.loading').fadeOut(function(){
				$(this).remove();
				$('#tweets .container').show();
			});
		},
		error: function(err){
			alert("Error with JSON");
		}
	});
};
```



#### showOnlyFavoirties()


```
showOnlyFavoirties = function(){
	$('.tweetItem').not('.favorite').hide();	
}
```



#### NEWchangeMeToRandomColor()
The original code for this function can be found here:
[http://paulirish.com/2009/random-hex-color-code-snippets/]	


```
NEWchangeMeToRandomColor = function(elem){
	var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16); 
	var bgcolor = (!bgcolor) ? randomColor : bgcolor ;
	$(elem).css({'background-color': bgcolor});		
};
```




