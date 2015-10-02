
function init(settings) {
    testing_googlePageId = settings.pageId;
    testing_googleSpreadsheetToken = settings.token;
    /*ACCESS START DATE AND END DATE. YOU CAN CHANGE IT BUT FORMAT SHOULD BE YYYY-MM-DD*/
    date_begin = settings.date_begin;
    date_end = settings.date_end;
    /*DO NOT CHANGE ANYTHING BELOW*/
    address = settings.address;
    testing_action_pointer = 0;
    accessGroupID = settings.accessGroupID;
    delay = settings.delay;
   settings.email == null ? testing_getLastEmail() : doAfterEmailIsReceived(settings.email);
}

function doAfterEmailIsReceived(email) {

    email = email.replace("+", "%2B");
    email = email.replace("@", "%40");
    var oReq = new XMLHttpRequest();

    oReq.onload = reqListener;
    oReq.open("get", address + "filter.jsp?new_constraint=HandleService%3A%3Aemail&filter_type=any&HandleService%3A%3Aemail%3A%3Aoption=starts+with&HandleService%3A%3Aemail%3A%3Avalue=" + email + "&source_type=EBP&task=Quick+Search", true);
    oReq.setRequestHeader("Content-Type", "text/html; charset=ISO-8859-1");
    oReq.send();
}

function reqListener() {
    var expr = /\d{6}/;
    var EBPnumber = expr.exec(this.responseText);
    console.log(EBPnumber[0]);


    testing_pressButtonInARow = setTimeout(function () {
        setAccess(EBPnumber[0], accessGroupID[testing_action_pointer]);
        testing_pressButtonInARow = setTimeout(arguments.callee, delay);
        if (testing_action_pointer == accessGroupID.length) {
            clearTimeout(testing_pressButtonInARow);

        }
    }, delay)


}


function setAccess(EBPnumber, id) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function () {
        if (xmlHttpRequest.readyState == 4) {
            console.log(id + " has been included");
        }


    };
    xmlHttpRequest.open("get", address + "edit_user.jsp?view=accesscontrolpv5&letter=L&ebp_handle=" + EBPnumber + "&accessGroupID=" + id + "&accessGroupIDInstructor=-1&date_begin=" + date_begin + "&date_end=" + date_end + "&task=Add+Access", true);
    xmlHttpRequest.setRequestHeader("Content-Type", "text/html; charset=ISO-8859-1");
    xmlHttpRequest.send();

    testing_action_pointer++;
}


function testing_getLastEmail() {


    $.getJSON('https://spreadsheets.google.com/feeds/list/'
        + testing_googleSpreadsheetToken + '/' + testing_googlePageId + '/public/values?alt=json'
        , function (data) {
            var len = data.feed.entry.length;
            email = data.feed.entry[len - 1].gsx$email.$t;
            doAfterEmailIsReceived(email);
        });

}
