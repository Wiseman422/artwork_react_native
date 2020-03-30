import { AsyncStorage } from 'react-native';

import Utility from '../config/Utility';
import WebClient from '../config/WebClientOld';
import Settings from '../config/Settings';

// import { AccessToken, LoginManager } from 'react-native-fbsdk';
// import firebase from 'react-native-firebase'
// import { GoogleSignin } from 'react-native-google-signin';

export default class User {
    //authorizeToken
    constructor(userData) {
        if (userData) {
            this.authorizeToken = WebClient.authorizeToken;
            this.user_id = userData.user_id,
                this.role = userData.role,
                this.full_name = userData.full_name,
                this.email = userData.email,
                this.phone = userData.phone,
                this.profile_pic = userData.profile_pic,
                this.profile_pic_thumb = userData.profile_pic_thumb,
                this.device_type = userData.device_type,
                this.device_token = userData.device_token,
                this.social_type = userData.social_type,
                this.social_id = userData.social_id,
                this.user_type = userData.user_type,
                this.push_notification = userData.push_notification,
                this.is_artist_approved = userData.is_artist_approved, //is_artist_approved => 0 – nothing, 1 – verified, 2 – rejected ,3 -requested
                this.is_converted_artist = userData.is_converted_artist,
                this.bio = userData.bio,
                this.address = userData.address,
                this.latitude = userData.latitude,
                this.longitude = userData.longitude,
                this.profile_banner_photo = userData.profile_banner_photo,
                this.profile_banner_photo_thumb = userData.profile_banner_photo_thumb,
                this.preferred_medium_id = userData.preferred_medium_id,
                this.preferred_medium = userData.preferred_medium,
                this.completed_project_list = userData.completed_project_list,
                this.sourceName1 = userData.source_name_1,
                this.sourceName1Url = userData.source_name_1_url,
                this.sourceName2 = userData.source_name_2,
                this.sourceName2Url = userData.source_name_2_url,
                this.sourceName3 = userData.source_name_3,
                this.sourceName3Url = userData.source_name_3_url,
                this.sourceName4 = userData.source_name_4,
                this.sourceName4Url = userData.source_name_4_url,
                this.cart_product_count = userData.cart_product_count,
                this.subscription_type = userData.subscription_type,
                this.expiry_date = userData.expiry_date
        }
    }
}


//Convert response dictionary to User model and save
User.save = function (userData) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
    let user = new User(userData)
    Utility.getUserId = user != undefined ? user.user_id : '0'
    User.saveUserModel(user);
};

//Save user model
User.saveUserModel = function (user) {
    Utility.user = user;
    let userJson = JSON.stringify(user)
    AsyncStorage.setItem("loggedInUser", userJson);
    //AsyncStorage.setItem("loggedInUser", JSON.stringify(userData));

};

User.loggedInUser = function (completion) {
    AsyncStorage.getItem("loggedInUser").then((userData) => {
        //let user = new User(JSON.parse(userData))
        let user = JSON.parse(userData)
        Utility.user = user;
        completion(user)
    }).done();
}

User.delete = function (completion) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
    AsyncStorage.removeItem("loggedInUser", () => {
        // LoginManager.logOut();
        // GoogleSignin.signOut();
        Utility.getUserId = '0';
        completion();
    });
};

User.saveAsyncData = function (key, value) {
    AsyncStorage.setItem(key, value);
};

User.getAsyncData = function (completion, key) {
    AsyncStorage.getItem(key).then((value) => {
        completion(value)
    }).done();
};