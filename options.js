
// Options

// Saves options to chrome.storage
function save_options() {
  
  var date = document.getElementById('startDate').value;

  var timeUnits = document.getElementsByName('interval');

  for(var i = 0; i < timeUnits.length; i++) {
     if(timeUnits[i].checked == true) {
         var selectedUnit = timeUnits[i].value;
     }
   }

  chrome.storage.sync.set({
    'interval': selectedUnit,
    'startDate': date
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
    'startDate': '1996-11-01'
  }, function(items) {

    var timeUnits = document.getElementsByName('interval');
    for(var i = 0; i < timeUnits.length; i++) {
       if(timeUnits[i].value == items.interval) {
           timeUnits[i].checked = true;
       }
     }

    document.getElementById('startDate').value = items.startDate;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

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