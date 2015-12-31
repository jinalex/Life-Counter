function hyperlink(elem) {
    window.location.href = elem.target.getAttribute('href');
}

function add_bookmark(image_num, url) {
    var bookmark_card = document.createElement('div');
    bookmark_card.setAttribute('class','bookmark pad-top');

    var link_img = document.createElement('img');
    link_img.setAttribute('name', image_num);
    link_img.src = './images/icons/'+image_num+'.png';
    link_img.addEventListener('click', hyperlink);
    link_img.setAttribute('href', url);
    link_img.setAttribute('title', url);

    bookmark_card.appendChild(link_img);

    document.getElementById('bookmark_bar').appendChild(bookmark_card);
}

function initClock() {

    //defaults
    chrome.storage.sync.get({
      'interval': 'seconds',
      'startDate': '2016-01-01',
      'bookmark_list': {"999":{"img":"53","url_link":"/options.html"}},
      // 'bookmark_list': {"102":{"img":"02","url_link":"https://www.facebook.com/"},"104":{"img":"08","url_link":"https://mail.google.com/"},"110":{"img":"20","url_link":"https://maps.google.ca/maps"},"112":{"img":"09","url_link":"https://drive.google.com/"},"114":{"img":"24","url_link":"https://calendar.google.com/calendar"},"116":{"img":"47","url_link":"https://www.youtube.com/"},"118":{"img":"31","url_link":"https://play.spotify.com/"}},
      'last_UID': 101,
      'count_what': "new year's day 2016",
      'timezone': '-5'
    }, function(items) {

        //TODO v3 Add timezone functionality 
        //Note: you must first convert the date back into UTC then apply the timezone offset
        var startDate = new Date(items.startDate);
        startDate.setHours(startDate.getHours() + startDate.getTimezoneOffset()/60);
        // startDate.setHours(startDate.getHours() + parseInt(items.timezone));
        var timezone = items.timezone;
        var selectedUnits = items.interval;
        var count_what = items.count_what;
        var before_after;

        var _MS_PER_SEC = 1000;
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var _MS_PER_YEAR = 1000 * 3600 * 24 *365;

        var conversion;
        var decimals;

        // seconds
        if (selectedUnits == 'seconds') {
            conversion = _MS_PER_SEC;    
            decimals = 1;
        }

        // days
        else if (selectedUnits == 'days') {
            conversion = _MS_PER_DAY;
            decimals = 7;
        }

        // years
        else if (selectedUnits == 'years') {
            conversion = _MS_PER_YEAR;
            decimals = 9;
        }

        var now = new Date()
        if (startDate.getTime() > now.getTime()){
            before_after = "until ";
        } else {
            before_after = "since ";
        }

        if (count_what.length > 0){
            count_what = before_after+count_what;
        }

        updateClock(startDate, conversion, decimals, selectedUnits, count_what);

        // populates bookmarks
        for (var key in items.bookmark_list) {
            if (items.bookmark_list.hasOwnProperty(key)) {
                add_bookmark(items.bookmark_list[key].img, items.bookmark_list[key].url_link, key);
            }
        }
    });
  }

  function updateClock(startTime, conversion, decimals, message, count_what) {
    setInterval(function(){
        var now = new Date() // current date
        var timeDiff = Math.abs(now.getTime() - startTime.getTime());
        document.getElementById('time').innerHTML = (timeDiff/conversion).toFixed(decimals);
        document.getElementById('what').innerHTML = "<small>"+message+"</small>"+"<p>"+count_what+"</p>";
    }, 100);
  }

initClock();
  