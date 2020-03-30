/*Replace the Whole Code*/
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Keyboard,
    FlatList,
    Image,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Settings from '../../config/Settings';
import Utility, { user } from '../../config/Utility';
import WebClient from '../../config/WebClient';
import User from '../../models/User';
import INTButton from '../../component/INTButton'
import SafeAreaView from '../../component/SafeAreaView';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import Spinner from 'react-native-loading-spinner-overlay';

var CART_OR_CHECKOUT = "Cart / Checkout";
var MESSAGE = "Messages";
var SAVED_ARTWORK = "Saved Artwork";
var FOLLOWED_ARTIST = "Followed Artists";
var SUPPORT_AND_FAQ = "Support / FAQ";
var ARTISTPORTAL = "Artist Portal";
var SUBSCRIPTION = "Subscription";
var NOTIFICATION = "Notifications";
var SETTINGS = "Settings";
var TOUR = "Tour";
class SideMenuViewController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            NavigationMenuItems: [
                { key: CART_OR_CHECKOUT },
                { key: MESSAGE },
                { key: SAVED_ARTWORK },
                { key: FOLLOWED_ARTIST },
                { key: ARTISTPORTAL },
                { key: NOTIFICATION },
                { key: SETTINGS },
                { key: SUPPORT_AND_FAQ },
                { key: TOUR },
            ],
            NavigationMenuItemsArtist: [
                { key: CART_OR_CHECKOUT },
                { key: MESSAGE },
                { key: SAVED_ARTWORK },
                { key: FOLLOWED_ARTIST },
                { key: ARTISTPORTAL },
                { key: SUBSCRIPTION },
                { key: NOTIFICATION },
                { key: SETTINGS },
                { key: SUPPORT_AND_FAQ },
                { key: TOUR },
            ],
            guestUserCartCount: 0,
        }
    }

    //For refresh on Sidebar
    componentDidMount() {
        DeviceEventEmitter.addListener('sideMenuViewWillToggleNotification', this.viewWillToggle.bind(this))
    }

    viewWillToggle() {
        if (Utility.user != undefined) {
            this.getProfileInfo()
        } else {
            this.getCartCount()
            this.setState({})
        }
        Utility.getUserId = Utility.user != undefined ? Utility.user.user_id : '0'
    }

    // ProfileInfo API
    getProfileInfo() {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_PROFILE_INFO, {
            'user_id': Utility.user.user_id + '',
        }, (response, error) => {
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                    this.setState({})
                }
            } else {
                Utility.showToast(error.message);
                if (error.code == -1) {
                    setTimeout(() => {
                        this.removeUser();
                    }, 3000);
                }
            }
            // this.setState({ spinnerVisible: false });
        }, true);
    }
    getCartCount() {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_GUEST_CART_COUNT, {
            'unique_device_id': Utility.deviceId + '',
        }, (response, error) => {
            // console.log('GET_GUEST_CART_COUNT', response)
            if (error == null) {
                this.setState({ guestUserCartCount: response })
            }
            // this.setState({ spinnerVisible: false });
        }, true);
    }



    //Logout tapped
    onLogoutTapped() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.logout() },
            ],
            { cancelable: true }
        )
    }

    // LOGOUT API
    logout() {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.LOGOUT, {
            'user_id': Utility.user.user_id + '',
        }, (response, error) => {
            if (error == null) {
            }
            this.removeUser();
            // this.setState({ spinnerVisible: false });
        }, true);
    }
    removeUser() {
        User.delete(() => {
            User.saveAsyncData('isTempLogin', 'false');
            Utility.user = undefined;
            Utility.toggleSideMenu();
            Utility.resetTo('SigninController');
        });
    }

    btnCloseTapped() {
        Utility.toggleSideMenu();
    }
    //Edit Profile Click
    editProfileTapped() {
        if (Utility.user == undefined) {
            Utility.showLoginAlert(() => {
                Utility.closeSideMenu();
                // Utility.resetTo('SigninController')
                Utility.push('SigninController', {
                    isFromNotLogin: false,
                    onNavigationCallBack: this.onNavigationCallBack.bind(this)
                })
            });
        } else {
            Utility.toggleSideMenu();
            // if (Utility.user.is_artist_approved == 1) {
            //     Utility.push('ArtistProfileViewController');
            // } else {
            // }
            Utility.push('EditProfileViewController');
        }
    }

    hideNavigationDrawer() {
        Utility.toggleSideMenu();
    }
    onSettingsMenuTapped() {

    }
    gotoScreen(screenName) {
        if (screenName == undefined) {
            return;
        }
        if (Utility.user == undefined) {
            Utility.showLoginAlert(() => {
                Utility.closeSideMenu();
                // Utility.resetTo('SigninController')
                Utility.push('SigninController', {
                    isFromNotLogin: false,
                    onNavigationCallBack: this.onNavigationCallBack.bind(this)
                })
            });
        } else {
            Utility.toggleSideMenu();
            Utility.push(screenName);
        }
    }

    onNavigationCallBack(params) {
        if (params.isSuccess == true) {
            this.viewWillToggle();
        }
    }

    sideMenuItemTapped(index) {
        var menu = Utility.user != undefined ? Utility.user.is_artist_approved == 1 ? this.state.NavigationMenuItemsArtist[index].key : this.state.NavigationMenuItems[index].key : this.state.NavigationMenuItems[index].key
        switch (menu) {
            case CART_OR_CHECKOUT:
                Utility.toggleSideMenu();
                Utility.push('CartViewController');
                // this.gotoScreen('CartViewController')
                break

            case MESSAGE:
                this.gotoScreen('MessagesViewController');
                break;

            case SAVED_ARTWORK:
                this.gotoScreen('SavedArtworkViewController');
                break;

            case FOLLOWED_ARTIST:
                this.gotoScreen('FollowedArtistsViewController');
                break;
            case SUPPORT_AND_FAQ:
                this.gotoScreen('SupportViewController');
                break;
            case NOTIFICATION:
                this.gotoScreen('NotificationsController');
                break;
            case SETTINGS:
                Utility.toggleSideMenu();
                Utility.push('SettingController');
                break;
            case ARTISTPORTAL:
                if (Utility.user == undefined) {
                    Utility.showLoginAlert(() => {
                        Utility.closeSideMenu();
                        // Utility.resetTo('SigninController')
                        Utility.push('SigninController', {
                            isFromNotLogin: false,
                            onNavigationCallBack: this.onNavigationCallBack.bind(this)
                        })
                    });
                } else {
                    if (Utility.user.is_artist_approved == 1) {
                        Utility.toggleSideMenu();
                        Utility.push('ArtistHomeViewController');
                    } else {
                        Utility.toggleSideMenu();
                        Utility.push('ArtistPortalViewController');
                    }
                }
                break;
            case SUBSCRIPTION:
                if (Utility.user == undefined) {
                    Utility.showLoginAlert(() => {
                        Utility.closeSideMenu();
                        // Utility.resetTo('SigninController')
                        Utility.push('SigninController', {
                            isFromNotLogin: false,
                            onNavigationCallBack: this.onNavigationCallBack.bind(this)
                        })
                    });
                } else {
                    Utility.toggleSideMenu();
                    Utility.push('SubscriptionViewController');
                }

                break;
            case TOUR:
                Utility.toggleSideMenu();
                Utility.push('TourViewController', { from: 'sidebar' });
                break;
        }
        // Alert.alert( index);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.safeAreaView}>
                    <SafeAreaView style={styles.viewSafeArea}>
                        <View style={styles.subContainer}>
                            <View style={styles.topViewStyle}>
                                <View style={styles.titleView}>
                                    <Text style={styles.titleTextStyle} >{(Utility.user) ? Utility.user.full_name.toUpperCase() : "No\nName".toUpperCase()}</Text>
                                </View>
                                <View style={styles.profilePicView}>
                                    <TouchableOpacity onPress={this.editProfileTapped.bind(this)} activeOpacity={0.7}>
                                        <View style={styles.profilePicEditView}>
                                            {/* <ProgressiveImage
                                                style={styles.profileImage}
                                                uri={Utility.user != undefined ? Utility.user.profile_pic : ''}
                                                // uri={Utility.user.profile_pic}
                                                placeholderSource={Images.input_userphoto}
                                                placeholderStyle={styles.placeHolderPhotoStyle}
                                                borderRadius={1} /> */}
                                            <CachedImage
                                                style={styles.profileImage}
                                                source={{
                                                    uri: Utility.user != undefined ? Utility.user.profile_pic : ''
                                                }}
                                                fallbackSource={Images.input_userphoto}
                                            />
                                            <Text style={styles.editTextStyle}>{Utility.user != undefined ? 'Edit' : 'Login'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.hideNavigationDrawer()} >
                                        <Image style={styles.forwardArrow} source={Images.forwardArrow} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <FlatList
                                style={styles.NavigationMenuFlatListComponentStyle}
                                data={Utility.user != undefined ? Utility.user.is_artist_approved == 1 ? this.state.NavigationMenuItemsArtist : this.state.NavigationMenuItems : this.state.NavigationMenuItems}
                                keyExtractor={(item, index) => index + ''}
                                renderItem={({ item, index }) =>
                                    <View style={styles.NavigationMenuItemBlockStyle}>
                                        <Text style={[styles.NavigationMenuItemStyle, item.key == ARTISTPORTAL ? { color: Colors.blueType1, } : { color: Colors.green, }]} onPress={this.sideMenuItemTapped.bind(this, index)} >
                                            {item.key}
                                        </Text>
                                        {item.key == CART_OR_CHECKOUT ?
                                            Utility.user != undefined ?
                                                (Utility.user.cart_product_count > 0) ?
                                                    <View style={{ height: 20, width: 20, backgroundColor: Colors.themeColor, marginVertical: 12, borderRadius: 10, justifyContent: 'center', }}>
                                                        <Text style={{ alignSelf: 'center', color: Colors.white, fontSize: Utility.NormalizeFontSize(10) }}>
                                                            {Utility.user.cart_product_count}
                                                        </Text>
                                                    </View>
                                                    : null
                                                : (this.state.guestUserCartCount > 0) ?
                                                    <View style={{ height: 20, width: 20, backgroundColor: Colors.themeColor, marginVertical: 12, borderRadius: 10, justifyContent: 'center', }}>
                                                        <Text style={{ alignSelf: 'center', color: Colors.white, fontSize: Utility.NormalizeFontSize(10) }}>
                                                            {this.state.guestUserCartCount}
                                                        </Text>
                                                    </View>
                                                    : null
                                            : null
                                        }
                                    </View>}
                                numColumns={1}
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </SafeAreaView>
                    {
                        Utility.user != undefined ?
                            <View style={styles.bottomViewContiner}>
                                <INTButton buttonStyle={styles.btnLogout} title="Log Out" titleStyle={styles.txtLogOut} onPress={() => this.onLogoutTapped()} />
                            </View>
                            : null
                    }
                </View>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default SideMenuViewController
