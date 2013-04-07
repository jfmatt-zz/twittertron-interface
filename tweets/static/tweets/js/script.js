var heatmap;
$(document).ready(function() {

    /////////////////
    //
    //  FORM
    //
    /////////////////

    $.fn.tagcloud.defaults = {
      size: {start: 14, end: 24, unit: 'pt'},
      color: {start: '#777', end: '#DF4601'}
    };
    $('#hashcloud a').tagcloud();
    $('#hashcloud a').click(function(evt) {
      evt.preventDefault();
      $this = $(this);
      $hashinput = $('#hashinput');
      var comma = $hashinput.val().length > 0 ? ',' : '';
      $hashinput.val($hashinput.val() + comma + $this.text());
    });

    $('#formsubmit').click(function() {
      console.log("editing form")
      var hashes = $('#hashinput').val().split(',');
      console.log(hashes);
      $('#hashinput').remove();
      var $form = $('#theform');
      for (var i = 0; i < hashes.length; i++) {
        if (hashes[i].length > 0)
          $form.append($('<input type="hidden" name="hashtags" value="' + hashes[i] + '"></input>'));
      }
      $form.submit();
    });
   

    /////////////////
    //
    //  HEATMAP
    //
    /////////////////

    //Predefine our functions
    var updateStatus, ajaxLoaded, getMoreData;


    var lastTweetId = tweetData.lastid || -1;
    var readyToLoadData = false;

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
    heatmap = new HeatmapOverlay(map, {
        "radius":10,
        "visible":true, 
        "opacity":60
    });

    // now we can set the data
    google.maps.event.addListenerOnce(map, "idle", function(){
        readyToLoadData = true;
        console.log("Adding data.");
        heatmap.setDataSet(tweetData);
        console.log(heatmap);
    });
    google.maps.event.addListener(map, 'bounds_changed', function() {
        console.log("bounds_changed")
        if (readyToLoadData)
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

      $('#status').text(tweetData.data.length + " " + t + " loaded" + m);
    }
    updateStatus();

    //{lastid: int, data: [tweetObjects]}
    var ajaxLoaded = function(moredata) {

      console.log(lastTweetId);
      console.log(moredata);
      console.log("New lastid: " + moredata['lastid'])
      //update lastid
      lastTweetId = moredata['lastid'];

      console.log("ajaxLoaded");
      //add the new data
      if (moredata['data'].length > 0) {
        tweetData.data = tweetData.data.concat(moredata['data']);
        tweetData.max = Math.max(Math.min(tweetData.data.length / 3, 5), 1);
        if (readyToLoadData)
          heatmap.setDataSet(tweetData);
        //update total number of tweets
        for (var i = 0, j = moredata['data'].length; i < j; i++) {
          tweetData['total'] += moredata['data'][i]['count'];
        }
      }
      else {
      }

      console.log("done ajaxLoaded");
      updateStatus();
      if (lastTweetId != 0)
        setTimeout(getMoreData, 10);
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