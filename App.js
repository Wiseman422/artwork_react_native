import React, { Component } from 'react';
import {
  Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import FCM, { NotificationActionType } from "react-native-fcm";
import SyncStorage from 'sync-storage';
import User from './app/models/User';
import Utility from './app/config/Utility';
//Milestone 1
import SigninController from "./app/routes/SigninController"
import SignupController from "./app/routes/SignupController"
import CMSViewController from "./app/routes/CMSViewController"
import SideMenuViewController from "./app/routes/SideMenuViewController"
import TourViewController from "./app/routes/TourViewController"
import HomeViewController from "./app/routes/HomeViewController"
import EditProfileViewController from "./app/routes/EditProfileViewController"
import ArtistPortalViewController from "./app/routes/ArtistPortalViewController"
import NewArtworkViewController from "./app/routes/NewArtworkViewController"
import ArtistHomeViewController from "./app/routes/ArtistHomeViewController"
import ForgotPasswordViewController from "./app/routes/ForgotPasswordViewController"
import ArtistDetailViewController from "./app/routes/ArtistDetailViewController"
import ArtDetailViewController from "./app/routes/ArtDetailViewController"
import ArtistProfileViewController from "./app/routes/ArtistProfileViewController"

//Milestone 2
import CartViewController from "./app/routes/CartViewController"
import MessagesViewController from "./app/routes/MessagesViewController"
import MessageInsideViewController from "./app/routes/MessageInsideViewController"
import OrderDetailViewController from "./app/routes/OrderDetailViewController"
import SavedArtworkViewController from "./app/routes/SavedArtworkViewController"
import FollowedArtistsViewController from "./app/routes/FollowedArtistsViewController"
import CreateNewJobViewController from "./app/routes/CreateNewJobViewController"
import CheckoutViewController from "./app/routes/CheckoutViewController"
import RequestCommissionViewController from "./app/routes/RequestCommissionViewController"
import PaymentaArtistViewController from "./app/routes/PaymentaArtistViewController"
import InventoryViewController from "./app/routes/InventoryViewController"
import CommisionsViewController from "./app/routes/CommisionsViewController"

// Milestone 3
import ChangePasswordController from "./app/routes/ChangePasswordController"
import SupportViewController from "./app/routes/SupportViewController"
import EventDetailViewController from "./app/routes/EventDetailViewController"
import EventViewController from "./app/routes/EventViewController"
import SettingController from "./app/routes/SettingController"
import NotificationsController from "./app/routes/NotificationsController"
import BankInfoViewController from "./app/routes/BankInfoViewController"
import ImageFullScreenViewController from "./app/routes/ImageFullScreenViewController"
import JobDetailViewController from "./app/routes/JobDetailViewController"

import SubscriptionViewController from "./app/routes/SubscriptionViewController"

console.disableYellowBox = true;

import DeviceInfo from 'react-native-device-info';

const defaultNavigatorStyles = {
  navBarHidden: true
}

const registerScreen = (name, component, styles) => {
  component.navigatorStyle = {
    ...defaultNavigatorStyles,
    ...styles
  };
  Navigation.registerComponent(name, () => component)
}

function registerAllScreens() {
  registerScreen('Artwork.SigninController', SigninController, {});
  registerScreen('Artwork.SignupController', SignupController, {});
  registerScreen('Artwork.CMSViewController', CMSViewController, {});
  registerScreen('Artwork.SideMenuViewController', SideMenuViewController, {});
  registerScreen('Artwork.TourViewController', TourViewController, {});
  registerScreen('Artwork.HomeViewController', HomeViewController, {});
  registerScreen('Artwork.EditProfileViewController', EditProfileViewController, {});
  registerScreen('Artwork.ArtistPortalViewController', ArtistPortalViewController, {});
  registerScreen('Artwork.NewArtworkViewController', NewArtworkViewController, {});
  registerScreen('Artwork.ArtistHomeViewController', ArtistHomeViewController, {});
  registerScreen('Artwork.ForgotPasswordViewController', ForgotPasswordViewController, {});
  registerScreen('Artwork.ArtistDetailViewController', ArtistDetailViewController, {});
  registerScreen('Artwork.ArtDetailViewController', ArtDetailViewController, {});
  registerScreen('Artwork.ArtistProfileViewController', ArtistProfileViewController, {});
  registerScreen('Artwork.MessagesViewController', MessagesViewController, {});
  registerScreen('Artwork.MessageInsideViewController', MessageInsideViewController, {});
  registerScreen('Artwork.CartViewController', CartViewController, {});
  registerScreen('Artwork.OrderDetailViewController', OrderDetailViewController, {});
  registerScreen('Artwork.SavedArtworkViewController', SavedArtworkViewController, {});
  registerScreen('Artwork.FollowedArtistsViewController', FollowedArtistsViewController, {});
  registerScreen('Artwork.CreateNewJobViewController', CreateNewJobViewController, {});
  registerScreen('Artwork.CheckoutViewController', CheckoutViewController, {});
  registerScreen('Artwork.RequestCommissionViewController', RequestCommissionViewController, {});
  registerScreen('Artwork.PaymentaArtistViewController', PaymentaArtistViewController, {});
  registerScreen('Artwork.InventoryViewController', InventoryViewController, {});
  registerScreen('Artwork.CommisionsViewController', CommisionsViewController, {});
  registerScreen('Artwork.ChangePasswordController', ChangePasswordController, {});
  registerScreen('Artwork.SupportViewController', SupportViewController, {});
  registerScreen('Artwork.EventViewController', EventViewController, {});
  registerScreen('Artwork.EventDetailViewController', EventDetailViewController, {});
  registerScreen('Artwork.SettingController', SettingController, {});
  registerScreen('Artwork.NotificationsController', NotificationsController, {});
  registerScreen('Artwork.BankInfoViewController', BankInfoViewController, {});
  registerScreen('Artwork.ImageFullScreenViewController', ImageFullScreenViewController, {});
  registerScreen('Artwork.JobDetailViewController', JobDetailViewController, {});
  registerScreen('Artwork.SubscriptionViewController', SubscriptionViewController, {});
}
// var screenName = 'Artwork.TourViewController'
// const manageTourScreen = async () => {
//    screenName = 'Artwork.TourViewController';
//   let isTourscreenShown = await AsyncStorage.getItem("isTourscreenShown").then((value) => {
//     console.log("Get Value >> ", value);
//     isTourscreenShown = JSON.parse(value)
//     if (isTourscreenShown === true) {
//       screenName = 'Artwork.SigninController';
//     } else {
//       await AsyncStorage.setItem('isTourscreenShown', JSON.stringify(true));
//       screenName = 'Artwork.TourViewController';
//     }
//   }).done();
// }

registerAllScreens();

User.loggedInUser((user) => {

  //  var screenName = 'Artwork.TourViewController';

  //   const result = SyncStorage.get('isToursScreenShown');
  //   console.log("before ",SyncStorage.get('isToursScreenShown'))
  //  if(result == undefined){
  // //    screenName = 'Artwork.TourViewController';
  //     SyncStorage.set('isToursScreenShown', 'shown');
  //     console.log("inside",SyncStorage.get('isToursScreenShown'))
  //  }else{
  //   //  screenName = 'Artwork.SigninController';    
  //  }
  //manageTourScreen();

  Utility.getAWS();

  console.log('AAAAAuniqueId', DeviceInfo.getUniqueID())
  Utility.deviceId = DeviceInfo.getUniqueID();
  var screenName = 'Artwork.TourViewController';
  if (user) {
    if (user.user_id != 0 && user.user_id != undefined) {
      screenName = 'Artwork.HomeViewController';
    }
    setUpNavigation(screenName);
  } else {
    User.getAsyncData((isTempLogin) => {
      if (isTempLogin != undefined) {
        if (isTempLogin == 'true') {
          screenName = 'Artwork.HomeViewController';
        }
      }
      setUpNavigation(screenName);
    }, 'isTempLogin');
  }
});

function setUpNavigation(screenName) {
  // FCM Token generation code
  FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));

  FCM.getFCMToken().then(token => {
    if (token != undefined) {
      // console.log("FCM Token: " + token)
      User.saveAsyncData('fcm_token', token);
    }
  });

  if (Platform.OS === 'ios') {
    FCM.getAPNSToken().then(token => {
      console.log("APNS TOKEN (getFCMToken)", token);
    });
  }

  FCM.getInitialNotification().then(notif => {
    console.log('in condition in index')
    if (Platform.OS === 'ios') {
      if (notif.user_id != undefined && Utility.user != undefined && notif.user_id == Utility.user.user_id) {
        console.log('in condition in index')
        Utility.navigator.push({
          screen: 'Artwork.NotificationsController',
          animated: true
        });
      }
    }
    // if (notif && notif.opened_from_tray) {
    //   console.log("FCM >>initial", notif.fcm)
    // }
    // console.log("FCM >>>getInitialNotification>>>>>", notif)
  });

  Navigation.startSingleScreenApp({
    screen: {
      screen: screenName, //unique ID registered with Navigation.registerScreen
      //title: 'Welcome', // title of the screen as appears in the nav bar (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
      navigatorStyle: {
        navBarHidden: true
      }
    },

    drawer: { // optional, add this if you want a side menu drawer in your app
      left: { // optional, define if you want a drawer from the left
        screen: 'Artwork.SideMenuViewController', // unique ID registered with Navigation.registerScreen
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        disableOpenGesture: true
      },
      style: { // ( iOS only )
        drawerShadow: false, // optional, add this if you want a side menu drawer shadow
        contentOverlayColor: 'rgba(0,0,0,0)', // optional, add this if you want a overlay color when drawer is open
        leftDrawerWidth: '100', // optional, add this if you want a define left drawer width (50=percent)
        //rightDrawerWidth: 10 // optional, add this if you want a define right drawer width (50=percent)
      },
      type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
      animationType: 'slide', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
      // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
      disableOpenGesture: true, // optional, can the drawer be opened with a swipe instead of button            
    },

    appStyle: {
      orientation: 'portrait' // Sets a specific orientation to the entire app. Default: 'auto'. Supported values: 'auto', 'landscape', 'portrait'
    },

    passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
    animationType: 'none' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'

  });
}
//def DEFAULT_GOOGLE_PLAY_SERVICES_VERSION    = "11.6.2"
//compile "com.google.android.gms:play-services-base:$googlePlayServicesVersion"
//compile "com.google.android.gms:play-services-places:$googlePlayServicesVersion"
//compile "com.google.android.gms:play-services-location:$googlePlayServicesVersion"
//implementation 'com.google.android.gms:play-services-auth:15.0.0' // should be at least 9.0.0

// For tours sync functionality
//https://medium.com/technoetics/creating-first-time-user-welcome-screen-in-react-native-42f08cb0ebbe