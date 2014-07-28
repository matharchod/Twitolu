# Twitolu

### Organize, visualize and socialize your Twitter feed.
=======


I have used Twitter since it first became available to the public. 
I like the medium of microblogging to quickly create snippets of the cool things I see online every day.
However, there aren't many tools that allow me to look back through my tweet history to remind me what I was doing last week.

I use a period-delimited format to organize my tweets into categories.
Twitolu takes advantage of this format and creates an interactive word cloud that creates links based on these categories.
I can click on a category in the word cloud and see only the tweets that match those categories.
I can also group tweets into lists (Favorites) and share those lists via email.
This is valuable to me as a means of recalling important links as well as sharing those links with collegues.

## Functionality
* Retrieve my most recent tweets (maximum of 200) from Twitter
* Organize those tweets into categories
* Transform each tweet into a tile with controls for sharing its content
* Allow text searching of my most recent tweets 

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

* Each tweet is transformed into a tile
* Tiles allow me to manipulate each tweet seperately or in groups
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

#### searchInit()

The search functionality is based on a DOM search.

* Create an event handler for the "search" button
* Read the value of the seach field
* Run a case-insensitive regular expression on each tweet for that value 
* Toggle the visibility on tweets that match the regex
* Show the number of tweets that match the search

```
searchInit = function (elem) {
	$('input').keypress(function (evt) {
		var charCode = evt.charCode || evt.keyCode;
		if (charCode == 13) { //Enter key's keycode
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
		$('#filter').val('');
		$(elem).show();
		$('#filter-count').hide();	
		$('.tweetItem').removeClass('favorite');	
		$('.shareLink').html('Send');
	});
};
```


#### searchByTag()

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

createWordCloud()
emailTweets()
toggleFavorites()
shareFavorites()

