var WebClient = module.exports = {};

import { create, ApisauceInstance } from 'apisauce'
// import RS from 'ramdasauce'
// define the api
//var https = require(https);
var POST = 'POST';
var GET = 'GET';
// WebClient.SERVER_BASE_URL = 'http://52.25.140.200:5011/api/';//STAGGING
WebClient.SERVER_BASE_URL = 'https://locartconsole.com/api/';//LIVE
// WebClient.SERVER_BASE_URL = 'http://192.168.10.215:5011/api/';//LOCAL
const api = create({
    baseURL: WebClient.SERVER_BASE_URL,
    // headers: { 'Accept': 'application/json' },
    timeout: 50000,
})

WebClient.postRequest = function (name, param, onCompletion, isConsole) {
    WebClient.sendRequest(name, param, onCompletion, POST, isConsole);
};
WebClient.getRequest = function (name, param, onCompletion, isConsole) {
    WebClient.sendRequest(name, param, onCompletion, GET, isConsole);
};
WebClient.getPlaces = function (name, param, onCompletion, isConsole) {
    // api.setBaseURL(GOOGLE_BASE_URL);
    WebClient.sendRequest(name, param, onCompletion, GET, isConsole);
};
WebClient.uploadMedia = function (name, param, onCompletion, isConsole) {
    let bodyData = undefined;
    let body = new FormData();
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    if (param) {
        Object.keys(param).map((key) => {
            let value = param[key]
            if (Array.isArray(value)) {
                value.forEach(element => {
                    body.append(key, element);
                });
            } else {
                body.append(key, param[key]);
            }
            // console.log(key, ' ===>>>> ', param[key]);
        })
    }
    bodyData = body;
    WebClient.sendRequest(name, bodyData, onCompletion, POST, isConsole, headers);
};

WebClient.sendRequest = function (name, param, onCompletion, methodType, isConsole, headers) {
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START>> ' + 'API ' + name + ' =============>>>>>>')
        console.log(`<<<<<<<<<<URL>>>>>>>>>>  ${api.getBaseURL()}` + name)
        // console.log('param', Object.keys(param));
        Object.keys(param).map((key) => {
            console.log(key, ':', param[key]);
        })
        console.log('<<<<<<=============' + '  <<END>> ' + 'API ' + name + ' =============>>>>>>')
    }

    switch (methodType) {
        case POST:
            if (headers != undefined) {
                api.post(name, param, { headers })
                    .then((response) => WebClient.getResponse(response, onCompletion, isConsole, name))
                // .then(R.props(['ok', 'status', 'problem','data']))
                // .then(console.log)
            } else {
                api.post(name, param)
                    .then((response) => WebClient.getResponse(response, onCompletion, isConsole, name))
                // .then(R.props(['ok', 'status', 'problem','data']))
                // .then(console.log)
            }
            break;
        case GET:
            api.get(name)
                .then((response) => WebClient.getResponse(response, onCompletion, isConsole, name))
            // .then(R.props(['ok', 'status', 'problem']))
            // .then((response) => console.log(response))
            // .then(console.log)
            break;
        default:
            break;
    }
};

WebClient.getResponse = function (response, onCompletion, isConsole, name) {
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START RESPONSE>> ' + 'of API ' + name + ' =============>>>>>>')
        console.log(response)
        console.log('<<<<<<=============' + '  <<END RESPONSE>> ' + 'of API ' + name + ' =============>>>>>>')
    }

    if (response.status == 200) {
        // console.log('\nRESPONSE SUCCESSSS : ', response.data.data)
        // if (response.data.status == 1) {
        //     onCompletion(true, response.data);
        // } else {
        //     onCompletion(false, {
        //         'status': response.data.status,
        //         'message': response.data.message
        //     });
        // }
        if (response.data.status != 1) {
            onCompletion(null, {
                'code': response.data.status,
                'message': response.data.message
            });
        } else {
            onCompletion(response.data.data, null);
        }
    } else {
        if (response.status == 404) {
            onCompletion(null, {
                'code': response.status,
                'message': "URL NOT FOUND"
            });
        } else if (response.status == 401) {
            onCompletion(null, {
                'code': response.status,
                'message': "Unauthorized"
            });
        } else {
            if (response.problem == 'NETWORK_ERROR') {
                onCompletion(null, {
                    'code': 0,
                    'message': response.problem
                });
            } else {
                onCompletion(null, {
                    'code': 0,
                    'message': response.problem
                });
            }
        }
    }
}