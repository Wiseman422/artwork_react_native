import React, { Component } from 'react'

import {
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  DeviceEventEmitter,
  PermissionsAndroid,
  PixelRatio,
  Keyboard
} from 'react-native';

import Colors from './Colors';
import Fonts from './Fonts';
import WebClient from './WebClient';
import Settings from './Settings';
import SnackBar from '../component/SnackBar';
import User from '../models/User';
// import Amplify from 'aws-amplify';

import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
// import firebaseClient from  "./FirebaseClient";

//FCM.on(FCMEvent.Notification, async (notif_artwork) => {
FCM.on(FCMEvent.Notification, (notif_artwork) => {
  // if (Platform.OS === 'android' && notif_artwork.fcm.title != undefined) {
  //   body = {
  //     "to": Utility.token,
  //     "data": {
  //       "custom_notification": {
  //         "title": notif_artwork.fcm.title,
  //         "body": notif_artwork.fcm.body,
  //         "sound": "default",
  //         "priority": "high",
  //         "icon": "ic_notification_white",
  //         "large_icon": "ic_notification",
  //         "show_in_foreground": true,
  //         targetScreen: 'notification'
  //       }
  //     },
  //     "priority": 10
  //   }
  //   firebaseClient.send(JSON.stringify(body), "notification");
  // }
  if (Utility.user != undefined) {
    // console.log('in condition', notif_artwork)
    // if (notif_artwork) {
    //   Utility.navigator.push({
    //     screen: 'Artwork.NotificationsController',
    //     animated: true
    //   });
    // }
  }
  if (Platform.OS === 'ios') {
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch (notif_artwork._notificationType) {
      case NotificationType.Remote:
        notif_artwork.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif_artwork.finish();
        break;
      case NotificationType.WillPresent:
        notif_artwork.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});
FCM.getInitialNotification(FCMEvent.Notification, (notif_artwork) => {
  // console.log('in condition', notif_artwork)
  User.loggedInUser((user) => {
    // console.log('FCM user ', user)
    if (user != undefined) {
      Utility.navigator.push({
        screen: 'Artwork.NotificationsController',
        animated: true
      });
    }
  });
  if (Platform.OS === 'ios') {
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch (notif_artwork._notificationType) {
      case NotificationType.Remote:
        notif_artwork.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif_artwork.finish();
        break;
      case NotificationType.WillPresent:
        notif_artwork.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});
var Utility = module.exports = {};

FCM.on(FCMEvent.RefreshToken, (token) => {
  // console.log("FCM>>>Utilitytoken", token)
  User.saveAsyncData('fcm_token', token);
  if (Utility.user != undefined) {
    Utility.saveToken(token);
  }
  // fcm token may not be available on first load, catch it here
});

Utility.saveToken = function (token) {
  WebClient.postRequest(Settings.URL.SAVE_TOKEN, {
    'user_id': Utility.user.user_id + '',
    'device_type': Utility.device_type + '',
    'device_token': token + '',
  }, (response, error) => {
    if (error == null) {
    }
  });
}

Utility.showLoginAlert = function (complition) {
  Alert.alert(
    'Login',
    'Please login or sign up to continue.',
    [
      { text: 'Later', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Login', onPress: () => {
          complition();
        }
      },
    ],
    { cancelable: true }
  )
}



Utility.user = undefined;
Utility.deviceId = '';
Utility.getUserId = Utility.user != undefined ? Utility.user.user_id + '' : '0';
Utility.currentLATITUDE = undefined;
Utility.currentLONGITUDE = undefined;


Utility.screenWidth = Dimensions.get('window').width;
Utility.screenHeight = Dimensions.get('window').height;
Utility.DOLLOR = '$';

Utility.isPlatformAndroid = Platform.OS !== 'ios';


Utility.isiPhoneX = (
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (Utility.screenHeight === 812 || Utility.screenWidth === 812)
);

Utility.toggleSideMenu = function () {
  Utility.navigator.toggleDrawer({
    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
    //to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
  });
  DeviceEventEmitter.emit('sideMenuViewWillToggleNotification', { isVisible: false });
}
Utility.closeSideMenu = function () {
  Utility.navigator.toggleDrawer({
    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
    to: 'closed' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
  });
  DeviceEventEmitter.emit('sideMenuViewWillToggleNotification', { isVisible: false });
}
Utility.resetTo = function (screenName, passProps) {
  Utility.navigator.resetTo({
    screen: 'Artwork.' + screenName,
    passProps: passProps,
    animated: true,
    animationType: 'fade',
  });
}


Utility.push = function (screenName, passProps) {
  Utility.navigator.push({
    screen: 'Artwork.' + screenName,
    passProps: passProps,
    animated: true,
    // animationType: 'fade',
  });
}



Utility.NormalizeFontSize = function (size) {
  //console.log(PixelRatio.get());
  if (Platform.OS === 'ios') {
    return size + 1;
  } else {
    var font_size = size
    if (PixelRatio.get() == 1) {
      // font_size = size - 5;
      font_size = size - 4;
    } else if (PixelRatio.get() == 1.5) {
      // font_size = size - 4;
      font_size = size - 3;
    } else if (PixelRatio.get() == 2) {
      // font_size = size - 2;
      font_size = size - 1;
    } else if (PixelRatio.get() == 3) {
      font_size = size + 1;
    }
    return font_size;
  }

}

Utility.parseFloat = function (string) {
  return parseFloat(string).toFixed(2);
}

Utility.hideKeyboard = function () {
  Keyboard.dismiss()
}

Utility.showToast = function (msg) {
  SnackBar.dismiss()
  SnackBar.show(msg, {
    style: {
      marginHorizontal: 10,
      marginTop: 30,
      width: Utility.screenWidth - 20,
      borderRadius: 5,
      overflow: 'hidden',
      position: 'absolute'
    },
    duration: 2000,
    backgroundColor: Colors.themeColor,
    buttonColor: 'blue',
    textColor: Colors.white,
    position: 'top',
    id: '123456'
  })
}

Utility.showAlert = function (title, message, onTap) {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {
        onTap()
      }
    }
  ], { cancelable: false })
}

Utility.showConfirmationAlert = function (yes, no, title, message, onYesTap) {
  Alert.alert(title, message, [
    {
      text: no
    }, {
      text: yes,
      onPress: () => {
        onYesTap()
      }
    }
  ], { cancelable: false })
}

Utility.hideLoader = function () {
  DeviceEventEmitter.emit('changeLoadingEffect', { isVisible: false });
}
Utility.showLoader = function (title) {
  DeviceEventEmitter.emit('changeLoadingEffect', { title, isVisible: true });
}
Utility.validateEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// Utility.showPopupToast = function (msg) {
//   DeviceEventEmitter.emit('showToast', { msg });
// }

Utility.getDateMMMdd = function prettyDate(mili) {
  var date = new Date(mili);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getUTCMonth()] + ' ' + date.getUTCDate();//MMM dd
  //return months[date.getUTCMonth()] + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear(); //MMM dd,yyyy
  //return date.toLocaleString()     // 7/25/2016, 1:35:07 PM
  //return date.toLocaleDateString() // 7/25/2016
  //return date.toDateString()       // Mon Jul 25 2016
  //return date.toTimeString()       // 13:35:07 GMT+0530 (India Standard Time)
  //return date.toLocaleTimeString() // 1:35:07 PM
}
Utility.getEventFormatDate = function eventFormatDate(mili, isOnlyTime) {
  var date = new Date(Number(mili));
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dayName = days[date.getDay()];

  var monthFullName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthName = monthFullName[date.getMonth()];

  var dd = date.getDate();
  //For time
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  if (isOnlyTime) {
    return strTime
  } else {
    return dayName + ", " + monthName + " " + dd + " " + strTime
  }
}

Utility.getEventDateYYYYMMDD = function eventFormatDateYYYYMMDD(mili) {
  var date = new Date(Number(mili));
  //2018-06-11
  var month = date.getUTCMonth() + 1;
  return date.getFullYear() + "-" + (month.toString().length == 1 ? ("0" + month) : month) + "-" + date.getDate()
}

Utility.getDatehhmma = function formatAMPM(mili) {
  var date = new Date(Number(mili));
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

Utility.getFormatedDate = function formatYYMMDD(mili) {
  var date = new Date(Number(mili));
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var formattedDate = yyyy + '-' + mm + '-' + dd;
  return formattedDate
}

Utility.isToday = function checkIsToday(mili) {
  var messageDate = new Date(Number(mili));
  var currentDate = new Date();
  var isToday = (currentDate.toDateString() == messageDate.toDateString()) ? true : false;
  return isToday;
}

Utility.calendarCurrentDate = function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  var today = yyyy + '-' + mm + '-' + dd;
  return today
}

Utility.getCurrentMonthNumber = function getCurrentMonthNumber() {
  var month = new Date().getMonth() + 1;
  return month
}

Utility.getCurrentYear = function getCurrentYear() {
  var year = new Date().getFullYear();
  return year
}

Utility.cmsType = {
  TermsOfUse: 'terms',
  PrivacyPolicy: 'privacy',
  FAQ: 'faq',
}

Utility.unique = function (arr) {
  return arr.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

Utility.device_type = Platform.OS;

Utility.USER_TYPE = {
  USER: 1,
  ARTIST: 2,
}
Utility.SUBSCRIPTION_TYPE = {
  NOT_SUBSCRIBE: 0,
  FREE_TRIAL: 1,
  SUBSCRIBED: 2,
}
Utility.ShippingType = {
  SHIPPING: 0,
  DELIVERY: 1,
  PICKUP: 2,
}
Utility.ArtworkType = {
  UNIQUE: 0,
  REPEATABLE: 1,
}
Utility.OrderStatus = {
  NONE: 0,
  INPROGRESS: 1,
  PACKED: 2,
  SHIPPED: 3,
  COMPLETED: 4,
  CANCELLED: 5,//Cancel by artist
}
Utility.MESSAGES = {
  //Sign In
  please_enter_phone: "Please enter phone number",
  please_enter_valid_phone: "Please enter valid phone number",
  please_enter_password: "Please enter password",
  login_cancelled: "Login cancelled",
  //Home
  location_alert: "Please enable your location for you to browse nearby Artists and Artworks.",
  could_not_fetch_current_location: "Could not fetch current location",
  removed_from_cart: "Removed from cart",
  //ArtDetailView
  added_to_cart: "Added to cart!!",
  report_added: "Report added successfully",
  already_in_cart: "Artwork already added in cart.",
  please_enter_des: "Please enter description.",
  //Artist Portal View
  please_enter_access_code: "Please enter approval code",
  please_select_preffered_medium: "Please select preferred medium",
  please_add_your_artwork_project: "Please add you artwork project",
  please_describe_your_artwork: "Please describe your artwork",
  please_enter_your_name: "Please enter your name",
  please_enter_your_address: "Please enter your address",
  artist_request_successfully: "Artist request successful.",
  now_you_are_artist: "Congratulations! Now you are Artist.",
  //Artist Profile View
  profile_updated_successfully: "Profile updated successfully.",
  please_add_source_name: "Please add source name.",
  //BankInfo
  please_enter_account: "Please enter account holder name",
  please_enter_account_number: "Please enter account number",
  please_enter_valid_account_number: "Please enter valid account number",
  please_enter_routing_number: "Please enter routing number",
  please_enter_first_name: "Please enter first name",
  please_enter_last_name: "Please enter last name",
  please_enter_email: "Please enter email address",
  please_enter_valid_email: "Please enter valid email",
  please_select_date_of_birth: "Please select date of birth",
  please_enter_address: "Please enter address",
  please_enter_postal_code: "Please enter postal code",
  please_enter_state: "Please enter state",
  please_enter_city: "Please enter city",
  please_enter_ssn: "Please enter ssn last 4 digits",
  please_enter_valid_ssn: "Please enter valid ssn last 4 digits",
  please_enter_identity_proof: "Please upload your ID photo.",
  bank_info_securly_saved_with_stripe: "Bank Info securely saved with stripe.",
  amount_transfer: "The amount will be transfer to your bank account shortly.",
  //Cart View
  please_select_shipping_type: "Please select shipping type",
  //Change Password
  please_enter_current_password: "Please enter current password",
  please_enter_new_password: "Please enter new password",
  password_change_success: "Password changed successfully",
  //Checkout View
  please_enter_name: "Please enter name",
  please_enter_credit_card_number: "Please enter credit card number",
  please_enter_expiry_date: "Please enter expiration date",
  please_enter_cvv: "Please enter cvv",
  place_order: "Place Order",
  are_you_sure_place_order: "Are you sure you want to place order?",
  no: "No",
  yes: "Yes",
  order_placed_success: "Order Placed Successfully",
  //Create Custom Job 
  custom_job_create_success: "Custom job created successfully",
  please_select_client_name: "Please select client name",
  please_enter_project_name: "Please enter project name",
  please_enter_project_details: "Please enter project details",
  please_enter_time_frame: "Please enter time frame",
  please_select_project_type: "Please enter project type",
  please_enter_price: "Please enter price",
  please_select_payment_required: "Please select payment required",
  //Edit Profile
  please_enter_proper_address: "Please enter proper address",
  profile_updated_success: "Profile updated successfully",
  //Forgot Password
  password_reset_email_sent: "Password reset email sent",
  //New Artwork
  please_select_art_image: "Please select Art Image",
  please_enter_project_title: "Please enter Project Title",
  please_select_medium: "Please select Medium",
  please_select_size: "Please enter Size",
  please_enter_art_price: "Please enter Art Price",
  please_select_dispatch_options: "Please select delivery options",
  please_enter_shipping_cost: "Please enter Shipping Cost",
  please_enter_delivery_cost: "Please enter Delivery Cost",
  artwork_added_success: "Artwork added successfully",
  //Request Commission
  request_added_success: "Request added successfully",
  //Signup
  password_should_be: "Password length should be 6-32 Characters",
  password_not_match: "The passwords you entered do not match",
  please_accept_tnc_pp: "Please accept Terms of Use and Privacy Policy",
  //Utility
  please_insert_valid_url: "Please enter valid url",
  //Support View
  thankyou_for_your_feedback: "Thank you for your feedback",
  //EventDetail
  event_added_in_device_calender: "Event added in your device’s calendar",
  book_ticket_url_invalid: "Book Ticket Url not valid.",
  //Subscription
  subscription_expired: "Your free trail/subscription period has been expired. Please get subscription for use this functionality."

}
Utility._checkLocationPermission = function () {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  const rationale = {
    'title': 'Location Permission',
    'message': 'Loc Art needs access to your location.'
  }
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, rationale)
    .then((result) => {
      // console.log('Permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

Utility._checkCameraPermission = function () {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  const rationale = {
    'title': 'Camera Permission',
    'message': 'Loc Art needs access to your camera so you can take picture.'
  }
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, rationale)
    .then((result) => {
      // console.log('Permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

Utility._checkWriteStoragePermission = function () {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  const rationale = {
    'title': 'Access Permission',
    'message': 'Allow Loc Art to access to photos, media and files on your device.'
  }
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, rationale)
    .then((result) => {
      // console.log('Permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

Utility.isTypeURL = function isTypeURL(url) {
  regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  // var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  if (!regexp.test(url)) {
    Utility.showToast(Utility.MESSAGES.please_insert_valid_url)
    return false;
  }
}


Utility.getAWSData = undefined;

Utility.getAWS = function getAWS() {
  WebClient.postRequest(Settings.URL.GET_AWS, {}, (response, error) => {
    // console.log('AWS DATA ', response)
    if (error == null) {
      if (response) {
        Utility.getAWSData = response;
        //   Amplify.configure({
        //     Auth: {
        //         // REQUIRED - Amazon Cognito Identity Pool ID
        //         identityPoolId: response.pool_id, 
        //         // REQUIRED - Amazon Cognito Region
        //         region: response.region, 
        //         // OPTIONAL - Amazon Cognito User Pool ID
        //         // userPoolId: 'XX-XXXX-X_abcd1234',
        //         // OPTIONAL - Amazon Cognito Web Client ID
        //         // userPoolWebClientId: 'XX-XXXX-X_abcd1234', 
        //     }
        // });
      }
    }
  });
}
