import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert, Platform, NetInfo } from 'react-native';

import Settings from './Settings';
import Utility from './Utility';

var WebClient = module.exports = {};

WebClient.postRequest = function (url, param, onCompletion) {
    //  console.log('URL = ' + url);

            // console.log('param', Object.keys(param));
            let body = new FormData();
            if (param) {
                Object.keys(param).map((key) => {
                    body.append(key, param[key]);
                })
            }

            fetch(url, {
                method: "POST",
                // headers: {
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/x-www-form-urlencoded'
                // },
                body: body
            }).then((response) => response.json()).then((responseData) => {
                if (responseData.status != 1) {
                    onCompletion(null, {
                        'code': responseData.status,
                        'message': responseData.message
                    });
                } else {
                    // console.log('RESPONSE: ' + JSON.stringify(responseData.data))
                    onCompletion(responseData.data, null);
                }

            }).catch((error) => {
                console.error(error);
                onCompletion(null, error);
            }).done();
};

// Get response object from API so replace responseData.data to responseData
// var WebClientForChat = module.exports = {};
// WebClientForChat.postRequest = function (url, param, onCompletion) {
//     console.log('URL = ' + url);

//            console.log('param', Object.keys(param));
//            let body = new FormData();
//            if (param) {
//                Object.keys(param).map((key) => {
//                    body.append(key, param[key]);
//                })
//            }

//            fetch(url, {
//                method: "POST",
//                // headers: {
//                //     'Accept': 'application/json',
//                //     'Content-Type': 'application/x-www-form-urlencoded'
//                // },
//                body: body
//            }).then((response) => response.json()).then((responseData) => {
//                if (responseData.status != 1) {
//                    onCompletion(null, {
//                        'code': responseData.status,
//                        'message': responseData.message
//                    });
//                } else {
//                    console.log('RESPONSE: ' + JSON.stringify(responseData.data))
//                    onCompletion(responseData, null);
//                }

//            }).catch((error) => {
//                console.error(error);
//                onCompletion(null, error);
//            }).done();
   // NetInfo.isConnected.fetch().then(isConnected => {
   //     if (isConnected) {
          
   //     } else {
   //     }
   // })

//};