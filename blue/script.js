let clipURL = 'test'
let sourcePre = 'https://clips.twitch.tv/embed?clip='
let sourceSuff = '&parent=www.blueexabyte.github.io&parent=blueexabyte.github.io&autoplay=true'
let brodcasterID = '58115189'; //186745142

/* ----------------------------------------- COMFY JS ------------------------------------------------------------*/
const twitchTvHandle = "BlueExabyte"; //"sooomoza"
const PAUSE_DURATION = 30 * 1000; // 30 seconds
const DISPLAY_DURATION = 10 * 1000; // 10 seconds

ComfyJS.Init(twitchTvHandle);
ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if((command == "reload") && (flags.mod)) {
      initialPostFunction();
  }
};
/* ----------------------------------------- COMFY JS END----------------------------------------------------------*/

const options = {
    url: 'https://id.twitch.tv/oauth2/token',
    json:true,
    body: {
    client_id: '4z8jrmlca65cyeio9vvrsc99xe5c70',
    client_secret: '5cdgh9tavfxzllf6h5rophgi580uo1',
    grant_type: 'client_credentials'
    }
};

let postInitialURL = 'https://id.twitch.tv/oauth2/token?client_id=4z8jrmlca65cyeio9vvrsc99xe5c70&client_secret=5cdgh9tavfxzllf6h5rophgi580uo1&grant_type=client_credentials'
initialPostFunction();

function initialPostFunction() {
    let initialPostCall  = httpPostAsync(null, postInitialURL, function(responseText) {
        let access_token = JSON.parse(responseText)['access_token'];
        
        const clipOptions = {
            //'https://api.twitch.tv/helix/users?login=blueexabyte',
            url: 'https://api.twitch.tv/helix/clips?broadcaster_id=' + brodcasterID + '&first=100',
            method: 'GET',
            headers:{
                'Client-ID': '4z8jrmlca65cyeio9vvrsc99xe5c70',
                'Authorization': 'Bearer ' + access_token
            }
        }

        let strResponseHttpRequest = httpGetAsync(clipOptions.headers, clipOptions.url, function(responseText) {
            //console.log("get call", responseText);
            
            let apiResult = JSON.parse(responseText);
            let clipsArray = [];
            for (let i = 0; i < (apiResult['data'].length); i++) {
                clipsArray.push(apiResult['data'][i]['id']);
            }

            let randomClip = String(clipsArray[Math.floor(Math.random() * clipsArray.length)]);
            clipURL = sourcePre + randomClip + sourceSuff;
            console.log(clipURL);
            document.getElementById('displayFrame').src = clipURL;

            let durationAPI = httpGetAsyncKraken(clipOptions.headers, 'https://api.twitch.tv/kraken/clips/' + randomClip, function(krakenResponse) {
                console.log("debug kraken stuff --------------------------");
                console.log('https://api.twitch.tv/kraken/clips/' + randomClip);
                console.log(krakenResponse);
                console.log("the clip durations is:\t" + krakenResponse["duration"]);
            });
        });
    });
}

// POST CALL
function httpPostAsync(data, url, callback) {
  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() { 
      if (xhr.readyState == 4 && xhr.status == 200)
          callback(xhr.responseText);
    }
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
    return xhr.responseText;
}

// GET HELIX CALL
function httpGetAsync(headers, url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Client-ID', headers['Client-ID']);
    xmlHttp.setRequestHeader('Authorization', headers['Authorization']);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// GET KRAKEN CALL
function httpGetAsyncKraken(headers, url, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader('Client-ID', headers['Client-ID']);
    xmlHttp.setRequestHeader('Authorization', headers['Authorization']);
    xmlHttp.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
    xmlHttp.send(null);
    return xmlHttp.responseText;
}