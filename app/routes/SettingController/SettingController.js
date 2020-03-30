import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    ScrollView,
    TouchableHighlight,
    Linking,
    Platform,
    NativeModules
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import SafeAreaView from '../../component/SafeAreaView';
import TopbarView from '../../component/TopbarView';
import INTButton from '../../component/INTButton';

import Spinner from 'react-native-loading-spinner-overlay';
import User from '../../models/User';

var UtilityController = NativeModules.UtilityController;

class SettingController extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pushNotificationBtn: true,
        }
    }

    btnPushNotificationPress() {
        if (this.state.pushNotificationBtn == true) {
            this.state.pushNotificationBtn = false
        }
        else {
            this.state.pushNotificationBtn = true
        }
        this.setState({ pushNotificationBtn: this.state.pushNotificationBtn }, () => this.updateNotification())
    }

    btnInviteFriendsTapped() {
        var shareContent = "";
        // if (Platform.OS == 'ios') {
        //     // shareContent = "Hey, Download application from\n\nhttps://itunes.apple.com/us/app/loc-art/id1365391226?ls=1&mt=8";
        // } else {
        // }
        shareContent = "Hey, Download application from below store link\n\nApp Store: https://itunes.apple.com/us/app/loc-art/id1365391226?ls=1&mt=8"
            + "\n\nPlay Store: https://play.google.com/store/apps/details?id=com.locart";
        UtilityController.shareRefLink(shareContent)
    }

    btnRateAppTapped() {
        if (Platform.OS == 'ios') {
            Linking.openURL('itms://itunes.apple.com/us/app/apple-store/id1365391226?mt=88')
        } else {
            Linking.openURL('market://details?id=com.locart')
        }
    }

    btnHomeTapped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
        });
    }

    updateNotification() {
        WebClient.postRequest(Settings.URL.UPDATE_SETTINGS, {
            'user_id': Utility.user.user_id + '',
            'type': 'push_notification',
            'status': (this.state.pushNotificationBtn == true ? '1' : '0') + '',
        }, (response, error) => {
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.topViewStyle}>
                    <TouchableOpacity onPress={this.btnHomeTapped.bind(this)} activeOpacity={0.7}>
                        <View style={styles.titleView}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>SETTINGS</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ marginTop: 15 }}>
                    {Utility.user != undefined ?
                        <View style={styles.subTabContainer}>
                            <Text style={styles.subText}> Push Notification </Text>
                            <TouchableOpacity onPress={this.btnPushNotificationPress.bind(this)} activeOpacity={1}>
                                <Image style={styles.switchImage} source={this.state.pushNotificationBtn == true ? Images.switchOnIcon : Images.switchOffIcon} />
                            </TouchableOpacity>
                        </View>
                        : null}
                    {/* <View style={styles.viewSeperator} /> */}
                    <TouchableOpacity onPress={this.btnInviteFriendsTapped.bind(this)} activeOpacity={1}>
                        <View style={styles.subTabContainer}>
                            <Text style={styles.subText}> Invite Friends </Text>
                            <Image style={styles.arrowImage} source={Images.arrowIcon} />
                        </View>
                    </TouchableOpacity>
                    {/* <View style={styles.viewSeperator} /> */}
                    <TouchableOpacity onPress={this.btnRateAppTapped.bind(this)} activeOpacity={1}>
                        <View style={styles.subTabContainer}>
                            <Text style={styles.subText}> Rate App </Text>
                            <Image style={styles.arrowImage} source={Images.arrowIcon} />
                        </View>
                    </TouchableOpacity>
                    {/* <View style={styles.viewSeperator} />               */}
                </ScrollView>
            </SafeAreaView>
        );
    }
}
export default SettingController