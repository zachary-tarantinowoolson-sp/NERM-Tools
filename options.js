document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('save').addEventListener('click', save_options)
document.getElementById('defaults').addEventListener('click', set_default)

// Saves options to chrome.storage
function save_options() {
    var btncolor = document.getElementById('btnclrpick').value
    var bgcolor = document.getElementById('bgclrpick').value
    chrome.storage.sync.set({
    btncolor: btncolor,
    bgcolor: bgcolor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status')
        status.textContent = 'Options saved.'
        setTimeout(function() {
            status.textContent = ''
            }, 750)
    });
}
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use defaults
    chrome.storage.sync.get({
    btncolor: '#6AAF3F',
    bgcolor: '#FAEBD4'
    }, function(items) {
        document.getElementById('btnclrpick').value = items.btncolor
        document.getElementById('bgclrpick').value = items.bgcolor
    });
}

function set_default() {
    var btncolor = '#6AAF3F'
    var bgcolor = '#FAEBD4'
    chrome.storage.sync.set({
    btncolor: btncolor,
    bgcolor: bgcolor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('defaultStatus')
        status.textContent = 'Defaults set.'
        setTimeout(function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url})
            });
            }, 750)        
    });
}
