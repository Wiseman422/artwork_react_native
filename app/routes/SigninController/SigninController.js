/*Replace the Whole Code*/

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    AsyncStorage,
    DeviceEventEmitter
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import INTButton from '../../component/INTButton'
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import Modal from 'react-native-modalbox';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import User from '../../models/User';
import Spinner from 'react-native-loading-spinner-overlay';
import { GoogleSignin } from 'react-native-google-signin';

const FBSDK = require('react-native-fbsdk');
const {
    LoginManager,
    AccessToken,
    // GraphRequest,
    // GraphRequestManager
} = FBSDK;

class SigninController extends Component {

    constructor(props) {
        super(props);
        this.props.navigator.setDrawerEnabled({ side: 'right', enabled: false });
        Utility.navigator = this.props.navigator;
        this.state = {
            isFromNotLogin: false,
            isRememberme: true,
            phoneNumber: "",
            password: "",
            spinnerVisible: false,
            deviceToken: '',
            // tourScreenModalVisible: false
        };
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case "willAppear":
                // On enter on this screen, enable the drawer
                this.props.navigator.setDrawerEnabled({
                    side: "left",
                    enabled: false
                });
                break;
            case "willDisappear":
                // On leave from this screen, enable the drawer
                this.props.navigator.setDrawerEnabled({
                    side: "left",
                    enabled: true
                });
                break;
        }
    }
    componentDidMount() {
        // Need to write below code for tour screen changes.
        // AsyncStorage.getItem("isShown", (err, result) => {
        //     if (err) {
        //     } else {
        //         if (result == null) {
        //             console.log("null value recieved", result);
        //             this.setState({ tourScreenModalVisible: true })
        //         } else {
        //             console.log("result", result);
        //         }
        //     }
        // });

        // AsyncStorage.setItem("isShown", JSON.stringify({ "value": "true" }), (err, result) => {
        //     console.log("error", err, "result", result);
        // });

        User.getAsyncData((token) => {
            if (token != undefined) {
                this.setState({ deviceToken: token });
                // console.log("fcm_token" + token)
            }
        }, 'fcm_token');

    }

    btnSubmitTapped() {
        Utility.hideKeyboard();
        if (this.state.phoneNumber.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_phone)
        } else if (this.state.phoneNumber.trim().length < 10 || this.state.phoneNumber.trim().length > 16) {
            Utility.showToast(Utility.MESSAGES.please_enter_phone)
        } else if (this.state.password == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_password);
        } else {
            this.signIn();
        }
    }

    // tourScreenModal() {
    //     var sizeModelbox = <Modal
    //         coverScreen={true}
    //         swipeToClose={false}
    //         backdropPressToClose={false}
    //         swipeToClose={false}
    //         backButtonClose={true}
    //         style={styles.modalContainer}
    //         isOpen={this.state.tourScreenModalVisible}>
    //         <TourViewController />
    //     </Modal >
    //     return sizeModelbox;
    // }

    //API
    signIn() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.USER_LOGIN, {
            'phone': this.state.phoneNumber,
            'password': this.state.password,
            'device_type': Utility.device_type,
            'device_token': this.state.deviceToken
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    // console.log('USER Response ' + response)
                    User.save(response);
                    Utility.user = new User(response);
                    if (this.props.isFromNotLogin) {
                        if (this.props.isFromNotLogin == true) {
                            this.props.onNavigationCallBack({ isSuccess: true })
                            this.props.navigator.pop();
                        }
                    } else {
                        Utility.resetTo('HomeViewController')
                    }
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    btnForgotPasswordTapped() {
        Utility.hideKeyboard();
        Utility.push('ForgotPasswordViewController')
    }
    btnFBClick() {
        Utility.hideKeyboard();
        var context = this;
        context.setState({ spinnerVisible: true });
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithReadPermissions(['public_profile']).then(
            function (result) {
                if (result.isCancelled) {
                    context.setState({ spinnerVisible: false });
                    Utility.showToast(Utility.MESSAGES.login_cancelled);
                } else {
                    // console.log('Login With Facebook :')
                    AccessToken.getCurrentAccessToken().then((data) => {
                        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + data.accessToken.toString())
                            .then((response) => response.json())
                            .then((json) => {
                                // console.log("JSON : " + JSON.stringify(json))
                                context.socialLoginAPI(json, 'facebook');
                            })
                            .catch((error) => {
                                //reject('ERROR GETTING DATA FROM FACEBOOK')
                                context.setState({ spinnerVisible: false });
                                console.error(error);
                            }).done();
                    })
                }
            },
            function (error) {
                context.setState({ spinnerVisible: false });
                Utility.showToast('Login fail with error:' + error);
            }
        );
    }
    btnGPlusClick() {
        var context = this;
        context.setState({ spinnerVisible: true });
        Utility.hideKeyboard();
        //Signout from google
        // GoogleSignin.signOut()
        //     .then(() => {
        //         console.log('out');
        //     })
        //     .catch((err) => {

        //     });
        //Google Signin
        GoogleSignin.configure({
            iosClientId: Settings.GOOGLE_CLIENT_ID_FOR_IOS, // only for iOS
        })
            .then(() => {
                // you can now call currentUserAsync()
                GoogleSignin.signIn()
                    .then((user) => {
                        // console.log("Google Login: >>> " + JSON.stringify(user));
                        context.socialLoginAPI(user, 'google');
                    })
                    .catch((err) => {
                        context.setState({ spinnerVisible: false });
                        // console.log('WRONG SIGNIN', err);
                        Utility.showToast(Utility.MESSAGES.login_cancelled);
                    })
                    .done();
            });
    }

    socialLoginAPI(json, socialtype) {
        var context = this;
        WebClient.postRequest(Settings.URL.SOCIAL_LOGIN, {
            'social_type': socialtype,
            'social_id': json.id,
            'full_name': json.name,
            'email': json.email,
            'device_type': Utility.device_type,
            'device_token': this.state.deviceToken
        }, (response, error) => {
            context.setState({ spinnerVisible: false });
            // console.log("response :" + JSON.stringify(response))
            if (error == null) {
                if (response.need_to_complete == 1) {
                    context.navigateToSignup(json.email, json.name, socialtype, json.id, json.photo)
                } else {
                    User.save(response);
                    Utility.user = new User(response);
                    if (Utility.user.user_id != 0 && Utility.user.user_id != undefined) {
                        // Utility.resetTo('HomeViewController')
                        if (this.props.isFromNotLogin) {
                            if (this.props.isFromNotLogin == true) {
                                this.props.onNavigationCallBack({ isSuccess: true })
                                this.props.navigator.pop();
                            }
                        } else {
                            Utility.resetTo('HomeViewController')
                        }
                    } else {
                        this.btnSignupTapped();
                    }
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }
    btnSignupTapped() {
        Utility.hideKeyboard();
        this.props.navigator.push({
            screen: 'Artwork.SignupController',
            passProps: {
                isFromNotLogin: (this.props.isFromNotLogin) ? true : false,
                onNavigationCallBack: this.onNavigationCallBack.bind(this)
            },
            title: undefined,
            animationType: 'push',
            animated: true
        });
    }
    btnSkipTapped() {
        User.saveAsyncData('isTempLogin', 'true');
        Utility.hideKeyboard();
        DeviceEventEmitter.emit('sideMenuViewWillToggleNotification', { isVisible: false });
        Utility.resetTo('HomeViewController')
    }

    navigateToSignup(email, name, social_type, social_id, photo) {
        this.props.navigator.push({
            screen: 'Artwork.SignupController',
            passProps: {
                isFromSocial: true,
                email: email,
                full_name: name,
                socialId: social_id,
                socialType: social_type,
                photo: photo,
                isFromNotLogin: (this.props.isFromNotLogin) ? true : false,
                onNavigationCallBack: this.onNavigationCallBack.bind(this)

            },
            title: undefined,
            animationType: 'push',
            animated: true
        });
    }

    onNavigationCallBack(params) {
        if (params.isSuccess == true) {
            this.props.onNavigationCallBack({ isSuccess: true })

            this.props.navigator.pop();
        }
    }

    onBackTap() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/*Background Image*/}
                <Image style={styles.bgImageView} source={Images.background} resizeMode={'cover'} />
                <SafeAreaView style={styles.safeAreaView}>
                    <TouchableOpacity style={{ marginHorizontal: 15, alignSelf: 'flex-end' }} activeOpacity={0.6} onPress={() => this.btnSkipTapped()}>
                        <Text style={styles.textSkip}>Skip</Text>
                    </TouchableOpacity>
                    <KeyboardAwareScrollView
                        // style={{ marginTop: 15 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        {/* App Name  */}
                        <View style={styles.viewTop}>
                            <Image style={styles.textAppName} source={Images.login_logo} />
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                            <View style={styles.viewSignInContainer}>
                                {/* TextField phoneNumber and password */}
                                <View style={styles.viewTextFieldContainer}>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        maxLength={16}
                                        keyboardType={'phone-pad'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        autoCapitalize={'none'}
                                        selectionColor={Colors.blueType1}
                                        ref={"phone"}
                                        onSubmitEditing={(event) => {
                                            this.refs.password.focus();
                                        }}
                                        returnKeyType="next"
                                        onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                                        value={this.state.phoneNumber + ''} />
                                    <View style={styles.bottomLine} />
                                    <Text style={styles.textHint}>phone number</Text>
                                </View>
                                <View style={styles.viewTextFieldContainer}>
                                    <TextField secureTextEntry={true}
                                        placeholderTextColor={Colors.grayTextColor}
                                        inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        borderColor={'transparent'}
                                        selectionColor={Colors.blueType1}
                                        placeholder={""}
                                        autoCorrect={false}
                                        ref={"password"}
                                        returnKeyType="done"
                                        onChangeText={(password) => this.setState({ password })}
                                        value={this.state.password + ''} />
                                    <View style={styles.bottomLine} />
                                    <Text style={styles.textHint}>password</Text>
                                </View>
                                {/* Remember me & forgot password */}

                                <TouchableOpacity activeOpacity={0.6} onPress={() => this.btnForgotPasswordTapped()}>
                                    <Text style={styles.textForgotpassword}>Forgot Password?</Text>
                                </TouchableOpacity>

                            </View>

                            {/*  Sign in Button */}
                            <View style={styles.viewLoginNFbGPlusContainer}>
                                <INTButton buttonStyle={styles.btnLogin}
                                    title="Log In"
                                    titleStyle={styles.titleLogin}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.btnSubmitTapped()} />
                                <Text style={styles.textOrLoginWith}>Or Login With</Text>
                                <View style={styles.viewFbGPlusContainer}>
                                    <INTButton buttonStyle={styles.btnFB}
                                        icon={Images.facebook}
                                        titleStyle={styles.textFB}
                                        spaceBetweenIconAndTitle={0}
                                        onPress={() => this.btnFBClick()} />

                                    <INTButton buttonStyle={styles.btnFB}
                                        icon={Images.gplus}
                                        titleStyle={styles.textFB}
                                        spaceBetweenIconAndTitle={0}
                                        onPress={() => this.btnGPlusClick()} />
                                </View>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>

                    {/* Don't Have account  */}
                    <View style={styles.viewBottom}>
                        <TouchableOpacity style={styles.btnSignUp}
                            onPress={this.btnSignupTapped.bind(this)}
                            activeOpacity={0.6}>
                            <Text style={styles.textSignUp} numberOfLines={1} allowFontScaling={true}>
                                {"Not Registered? "}
                                <Text style={{
                                    fontFamily: Fonts.santanaBold,
                                    color: Colors.greenType1, fontSize: Utility.NormalizeFontSize(12)
                                }} numberOfLines={1} allowFontScaling={true}>
                                    Create an account here!</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default SigninController