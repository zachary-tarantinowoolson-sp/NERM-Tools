// always waits the document to be loaded when shown
document.addEventListener('DOMContentLoaded', function() {

    // variables for html buttons
    var btnProfileDash= document.getElementById("profiledash");
    var btnProfileAdmin= document.getElementById("profileadmin");
    var btnSAASTRIAGEJira= document.getElementById("triageJira");
    var btnSAASTRIAGEPortal= document.getElementById("triagePortal");
    var btnSessionDash= document.getElementById("sessiondash");
    var btnSessionAdmin= document.getElementById("sessionadmin");
    var btnshowNav= document.getElementById("showNav");
    var btnhideNav= document.getElementById("hideNav");

    /* --- listeners for button presses --- */
    // profile - Dashboard
    btnProfileDash.addEventListener("click", function(){
        goToProfileDash();
    });
    // profile - Admin
    btnProfileAdmin.addEventListener("click", function(){
        goToProfileAdmin();
    });
    // SaaSTriage - Jira
    btnSAASTRIAGEJira.addEventListener("click", function(){
        goToTriageJira();
    });
    // SaaSTriage - Portal
    btnSAASTRIAGEPortal.addEventListener("click", function(){
        goToTriagePortal();
    });
    // session - Dashboard
    btnSessionDash.addEventListener("click", function(){
        goToSessionDash();
    });
    // session - Admin
    btnSessionAdmin.addEventListener("click", function(){
        goToSessionAdmin();
    });
    // Show the left Navigation panel
    btnshowNav.addEventListener("click", function(){
        showNavBar();
    });
    // Hide the left Navigation panel
    btnhideNav.addEventListener("click", function(){
        hideNavBar();
    });


    /* --- Profile functions --- */

    // profile - Dashboard
    function goToProfileDash()
    {
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {  
            // set current tab to variable
            var tab = tabs[0];

            // only works if the tab is in the Admin side. Does nothing if on dashboard already
            if (tab.url.includes('neprofile_admin/profiles')){

                // if the profile is on the "all attributes" tab, go to the "info" tab on dashboard
                if (tab.url.includes('attributes'))
                    chrome.tabs.update({url:tab.url.split("attributes")[0].replace(/neprofile_admin/,"neprofile_dashboard")})
                else // otherwise, go to the dashboard side of current page
                    chrome.tabs.update({url:tab.url.replace(/neprofile_admin/,"neprofile_dashboard")})
            }            
        });
    }

    // profile - Admin
    function goToProfileAdmin()
    {
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {
            // set current tab to variable
            var tab = tabs[0];
            
            // only works if the tab is in the Dashboard side. Does nothing if on admin already
            if (tab.url.includes('neprofile_dashboard/profiles')){

                // check if its on the info, contributors, or history profile pages
                // goes to admin side of current page
                if (tab.url.split('/').length <= 7)
                    chrome.tabs.update({url:tab.url.replace(/neprofile_dashboard/,"neprofile_admin")})
                else // otherwise, go to the info page in admin
                    chrome.tabs.update({url:tab.url.split("parent")[0].replace(/neprofile_dashboard/,"neprofile_admin")})
            }
        });
    }

    /* --- SAASTRIAGE functions --- */

    // SaaSTriage - Jira
    function goToTriageJira()
    {
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {  
            // set current tab to variable
            var tab = tabs[0];
            if (tab.url.includes('servicedesk/customer/portal/3')){
                chrome.tabs.update({url:tab.url.replace(/servicedesk\/customer\/portal\/3/,"browse")})
            }            
        });
    }

    // SaaSTriage - Portal
    function goToTriagePortal()
    {
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {
            // set current tab to variable
            var tab = tabs[0];
            if (tab.url.includes('browse')){
                chrome.tabs.update({url:tab.url.replace(/browse/,"servicedesk/customer/portal/3")})
            }
        });
    }


    /* --- Workflow Session functions --- */
    // using sessionStorage here because I didnt want to deal with chrome.storage.sync 
    // nor did I want to worry about clear the memory. sesstionStorage wipes when the window/popup closes

    // session - Dashboard
    function goToSessionDash()
    {
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {
            // set current tab to variable
            var tab = tabs[0];

            // only works if the tab is in the Admin side. Does nothing if on dashboard already
            if (tab.url.includes('neprofile_admin/requests')){

                // split url up for manipulation later
                var splitURL= tab.url.split('/')

                // gets the workflow ID and session ID from the sessionStorage
                // if sessionStorage is empty, returns null
                var workflowID=sessionStorage.getItem("workflowID"+tab.id)
                var sessionID=sessionStorage.getItem("sessionID"+tab.id)

                // as log as both have values, go to workflow activity page in dashboard
                if(workflowID != null && sessionID != null)
                    chrome.tabs.update({url:splitURL[0]+'//'+splitURL[2]+"/neprofile_dashboard/workflows/"+workflowID+"/workflow_sessions/"+sessionID})
                else // otherwise, go to the generic requests table
                    chrome.tabs.update({url:splitURL[0]+'//'+splitURL[2]+"/neprofile_dashboard/requests"})
                
                // remove IDs from storage
                sessionStorage.removeItem("workflowID"+tab.id)
                sessionStorage.removeItem("sessionID"+tab.id)
            }
        });
    }

    // session - Admin
    function goToSessionAdmin()
    {   
        // grabs active tab
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) 
        {
            // set current tab to variable
            var tab = tabs[0];

            // only works if the tab is in the Dashboard side. Does nothing if on admin already
            if (tab.url.includes('neprofile_dashboard/requests')){
                
                // split url up for manipulation later
                var splitURL= tab.url.split('/')
                
                // records workflow and session id into variables
                var workflowID = splitURL[5]
                var sessionID = splitURL[7] 

                // save the IDs into session storage
                sessionStorage.setItem("workflowID"+tab.id,workflowID)
                sessionStorage.setItem("sessionID"+tab.id,sessionID)

                // go to Admin side of the workflow session
                chrome.tabs.update({url:splitURL[0]+'//'+splitURL[2]+"/neprofile_admin/requests/"+sessionID})
            }
        });
    }

    // Show Nav Bar
    function showNavBar(){
        // grab active tab
        chrome.tabs.query({active:true,lastFocusedWindow:true},function(tabs){
            // set current tab to var
            var tab = tabs[0];

            chrome.scripting.removeCSS({
                target: {tabId:tab.id},
                files:["hideNav.css"]
            });

            // remove ids from storage
            sessionStorage.removeItem("cssInjected"+tab.id)
        });
    }

    // Hide Nav Bar
    function hideNavBar(){
        // grab active tab
        chrome.tabs.query({active:true,lastFocusedWindow:true},function(tabs){
            // set current tab to var
            var tab = tabs[0];
            var isHidden=sessionStorage.getItem("cssInjected"+tab.id)

            if(isHidden==null){
                chrome.scripting.insertCSS({
                    target: {tabId:tab.id, allFrames:true},
                    files:["hideNav.css"]
                });

                var cssInjected="NavIsHidden"

                // save item to session storage
                sessionStorage.setItem("cssInjected"+tab.id,cssInjected)
            }
        });
    }

    // adds a listener to tab change
    chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab)=>{

        // check for a URL in the changeInfo parameter (url is only added when it is changed)
        if(changeInfo.url){
            // remove IDs from storage
            sessionStorage.removeItem("cssInjected"+tab.id)
        }
    });

});