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
      'interval': 'years',
      'startDate': '2000-01-01',
      'startTime': '',
      'bookmark_list': {},
      'last_UID': 101,
      'count_what': ''
    }, function(items) {

        var startDate = items.startDate;
        var selectedUnits = items.interval;
        var count_what = items.count_what;
        var before_after;

        var _MS_PER_SEC = 1000;
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var _MS_PER_YEAR = 1000 * 3600 * 24 *365;
        
        // var birthTime = 'November 1, 1996 00:00:00';
        
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
        document.getElementById('what').innerHTML = "<small> "+message+"</small>"+"<p> "+count_what+"</p>";
    }, 100);
  }

initClock();
  