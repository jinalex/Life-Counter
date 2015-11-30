  function initClock() {

    //defaults
    chrome.storage.sync.get({
      'interval': 'years',
      'startDate': '1996-11-01'
    }, function(items) {

        var startTime = items.startDate;
        var selectedUnits = items.interval;

    var _MS_PER_SEC = 1000;
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    var _MS_PER_YEAR = 1000 * 3600 * 24 *365;
    
    // var birthTime = 'November 1, 1996 00:00:00';
    var start = new Date(startTime);
    
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

    var settings = {
        'startTime': start,
        'conversion': conversion,
        'decimals': decimals
    }

    updateClock(start, conversion, decimals, selectedUnits);

    });
  }

  function updateClock(startTime, conversion, decimals, message) {
    setInterval(function(){
        var now = new Date() // current date
        var timeDiff = Math.abs(now.getTime() - startTime.getTime());
        document.getElementById('time').innerHTML = (timeDiff/conversion).toFixed(decimals) + "<small> "+message+"</small>";
    }, 100);
  }

initClock();
  