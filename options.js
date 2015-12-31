// Bookmarks------------
var num_icons = 53;
var selected_img = '01';
var last_UID;

// Bookmark Constructor
// function new_bookmark(imgNum, link) {
    
//     link_url = (typeof link_url === 'undefined') ? "#" : link_url;
    
//     this.imgNum = imgNum;
//     this.link_url = link_url;
// }

function save_reminder() {
    document.getElementById("reminder").setAttribute('class', 'centered');
}

function delete_bookmark(bkmk) {
    bkmk.target.parentNode.remove();
}

function add_bookmark(image_num, url, UID) {
    image_num = typeof image_num !== 'object' ?  image_num : selected_img;
    UID = typeof UID !== 'undefined' ?  UID : last_UID+1;
    last_UID = UID + 1;

    if (document.getElementById('url_textfield').value.length > 0){
       url = document.getElementById('url_textfield').value;
    } else if (typeof url == 'undefined'){
      url = '/options.html';
    }

    if (url.indexOf('://') == -1 && url.indexOf('/options.html') == -1) {
      url = 'https://'+url
    }

    var bookmark_card = document.createElement('div');
    bookmark_card.setAttribute('class','bookmark pad-top');
    bookmark_card.setAttribute('id', UID);

    var link_img = document.createElement('img');
    link_img.setAttribute('name', image_num);
    link_img.src = './images/icons/'+image_num+'.png';
    link_img.setAttribute('target', '_blank');

    var link_url = document.createElement('a');
    link_url.setAttribute('href', url);
    link_url.setAttribute('target', '_blank');
    if (url != '/options.html'){
      link_url.innerHTML = url.slice(url.indexOf('://')+3);
    } else {
      link_url.innerHTML = url;
    }

    var delete_btn = document.createElement('input');
    delete_btn.setAttribute('class', 'btn btn-alert btn-sm right');
    delete_btn.type = 'button';
    delete_btn.value = 'X';

    bookmark_card.appendChild(link_img);
    bookmark_card.appendChild(link_url);
    bookmark_card.appendChild(delete_btn);
    delete_btn.addEventListener('click', delete_bookmark);
    delete_btn.addEventListener('click', save_reminder);

    document.getElementById('bookmark_container').appendChild(bookmark_card);
    document.getElementById('url_textfield').value = "";
}

function select_icon(img) {
    var target_id = img.target.id;
    document.getElementById("icon"+selected_img).className = "icon";
    document.getElementById(target_id).className = "icon highlight";
    selected_img = target_id.slice(-2);
}

//---------------------

// Saves options to chrome.storage
function save_options() {
  
  var date = new Date(document.getElementById('startDate').value);
  var timeUnits = document.getElementsByName('interval');
  var count_what = document.getElementById("count_what").value;

  var bookmarks = document.getElementById("bookmark_container").children
  var bookmark_list = {};

  // save the links on screen
  for (var i = 0; i < bookmarks.length; i++) {
    last_UID = Math.max(last_UID, parseInt(bookmarks[i].getAttribute('id')));
    bookmark_list[bookmarks[i].getAttribute('id')] = {
      'img':bookmarks[i].children[0].getAttribute('name'),
      'url_link':bookmarks[i].children[1].getAttribute('href')
    };
  };

  console.log("list after save");
  console.log(bookmark_list);

  console.log("date after save");
  console.log(date);

  console.log("count_what");
  console.log(count_what);

  // Finds whether seconds, days or years is checked
  for(var i = 0; i < timeUnits.length; i++) {
     if(timeUnits[i].checked == true) {
         var selectedUnit = timeUnits[i].value;
     }
  }

  document.getElementById("reminder").setAttribute('class', 'centered hidden');

  chrome.storage.sync.set({
    'interval': selectedUnit,
    'startDate': date,
    'bookmark_list': bookmark_list,
    'last_UID': last_UID,
    'count_what': count_what

  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('save');
    status.textContent = 'Options saved';
    status.className = 'btn btn-success centered';
    setTimeout(function() {
      status.textContent = 'Save';
      status.className = 'btn btn-default centered';
    }, 800);
  });
}

// Restores options stored in chrome.storage.
function restore_options() {
  // Use default value 
  chrome.storage.sync.get({
    'interval': 'years',
    'startDate': '2000-01-01',
    'bookmark_list': {},
    'last_UID': 101,
    'count_what': ''
  }, function(items) {

    // checks off the selected time units
    var timeUnits = document.getElementsByName('interval');
    for(var i = 0; i < timeUnits.length; i++) {
       if(timeUnits[i].value == items.interval) {
           timeUnits[i].checked = true;
       }
     }

    // populates bookmarks
    for (var key in items.bookmark_list) {
        if (items.bookmark_list.hasOwnProperty(key)) {
            add_bookmark(items.bookmark_list[key].img, items.bookmark_list[key].url_link, key);
        }
    }

    document.getElementById('count_what').value = items.count_what;

    var now = new Date();
    var target_time = new Date(items.startDate);

    document.getElementById('startDate').value = items.startDate;
    if(target_time.getTime() > now.getTime() && document.getElementById('count_what').value == '') {
      document.getElementById('count_what').setAttribute('placeholder', 'Counting down to what?');
    } else if (document.getElementById('count_what').value == '') {
      document.getElementById('count_what').setAttribute('placeholder', 'Counting up from what?');
    }

    var bookmark_list = items.bookmark_list;


    // Get last_UID
    last_UID = items.last_UID;

    console.log(bookmark_list);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add_bookmark').addEventListener('click', add_bookmark);
document.getElementById('add_bookmark').addEventListener('click', save_reminder);

window.onload = function() {
  for (var i = 1; i < num_icons+1; i++){
    if (i < 10) {
      i = '0'+i
    }
    var option_icon = document.createElement('img');
    option_icon.setAttribute('class', 'icon');
    option_icon.src = './images/icons/'+i+'.png';
    option_icon.setAttribute('id', 'icon'+i);
    document.getElementById('icon_select').appendChild(option_icon);
  }
  for (var i = 1; i < num_icons+1; i++) {
    if (i < 10) {
      i = '0'+i
    }
    document.getElementById('icon'+i).addEventListener("click", select_icon);  
  }
  document.getElementById("icon"+selected_img).className = "icon highlight";
}


chrome.storage.sync.get(null, function(items) {
    try {
        if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
        } else {
            console.log(Object.getOwnPropertyNames(items));
            console.log(JSON.stringify(items));
        }
    } catch (exception) {
        window.alert('exception.stack: ' + exception.stack);
        console.error((new Date()).toJSON(), "exception.stack:", exception.stack);
    }
});