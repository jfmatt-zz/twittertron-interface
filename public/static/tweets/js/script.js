$(document).ready(function() {

    //Predefine our functions
    var updateStatus, ajaxLoaded, getMoreData;


    var lastTweetId = tweetData.lastid || -1;

    // standard gmaps initialization
    var myLatlng = new google.maps.LatLng(39.309332, -76.614876);

    // define map properties
    var myOptions = {
      zoom: 11,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      scrollwheel: true,
      draggable: true,
      navigationControl: true,
      mapTypeControl: false,
      scaleControl: true,
      disableDoubleClickZoom: false
    };
    // we'll use the heatmapArea 
    var map = new google.maps.Map($("#heatmapArea")[0], myOptions);

    // let's create a heatmap-overlay
    // with heatmap config properties
    var heatmap = new HeatmapOverlay(map, {
        "radius":20,
        "visible":true, 
        "opacity":60
    });
  
    // now we can set the data
    google.maps.event.addListenerOnce(map, "idle", function(){
        heatmap.setDataSet(tweetData);
        console.log(heatmap);
    });

    var updateStatus = function() {
      if (typeof tweetData.total == "undefined") {
        tweetData.total = 0;
        for (var i = 0, j = tweetData.data.length; i < j; i++)
          tweetData.total += tweetData.data[i].count;
      }
      var t = tweetData.total == 1 ? "tweet" : "tweets"
      var m = lastTweetId == 0 ? " [all loaded]" : ""

      $('#status').text(tweetData.total + " " + t + " loaded" + m);
    }
    updateStatus();

    //{lastid: int, data: [tweetObjects]}
    var ajaxLoaded = function(moredata) {

      //update lastid
      lastTweetId = moredata['lastid'];

      //add the new data
      if (moredata['data'].length > 0) {
        tweetData.data = tweetData.data.concat(moredata['data']);
        heatmap.setDataSet(tweetData);

        //update total number of tweets
        for (var i = 0, j = moredata['data'].length; i < j; i++) {
          tweetData['total'] += moredata['data'][i]['count'];
        }
      }
      else {
      }

      updateStatus();
      if (lastTweetId != 0)
        getMoreData();
    }

    var getMoreData = function() {
      $('#status').text("Loading...");

      query['start'] = lastTweetId;

      //Feed the same query back so that all the filtering happens on the second pass
      $.ajax("ajax",
      {
        data: query,
        dataType: 'json',
      }).done(ajaxLoaded);
    };
    getMoreData();

 
});