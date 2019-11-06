window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1653294536-eZrDQ80x";   // change the default LIFF value if you are not using a node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    let urlType = new URLSearchParams(window.location.search);
    type = urlType.toString();
    registerButtonHandlers(type);
}

/**
* Register event handlers for the buttons displayed in the app
*/
function registerButtonHandlers(type) {

    // closeWindow call
    var close_e = document.getElementById('closeWindowButton');
    document.getElementById('closeWindowButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            liff.closeWindow();
        }
    });

    // sendMessages call
    document.getElementById('sendMessageButton').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            q_type = ''
            if (type === 'type=one-side') {
                q_type = '單戀';
            } else if (type === 'type=divorce') {
                q_type = '離婚';
            } else if (type === 'type=single') {
                q_type = '單身';
            } else if (type === 'type=cheat') {
                q_type = '劈腿';
            } else if (type === 'type=ambiguous') {
                q_type = '曖昧';
            } else if (type === 'type=marry') {
                q_type = '結婚';
            } else if (type === 'type=make-up') {
                q_type = '復合';
            }
            liff.sendMessages([{
                'type': 'text',
                'text': '我想問關於'+q_type+' 過去抽到愚人 現在抽到寶劍皇后 未來抽到聖杯國王'
            }]).then(function() {
                if (close_e.style.display === 'none') {
                    close_e.style.display = 'block';
                }
            }).catch(function(error) {
                window.alert('Error sending message: ' + error);
            });
        }
    });
}

/**
* Alert the user if LIFF is opened in an external browser and unavailable buttons are tapped
*/
function sendAlertIfNotInClient() {
    alert('This button is unavailable as LIFF is currently being opened in an external browser.');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}
