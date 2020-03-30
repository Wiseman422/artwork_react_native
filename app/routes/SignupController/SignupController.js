/*Replace the Whole Code*/



import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

import styles from './styles'

import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility, { screenWidth } from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import INTButton from '../../component/INTButton'
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressiveImage from '../../component/ProgressiveImage';
// import firebase from 'react-native-firebase'
import User from '../../models/User';
import RNAccountKit, { Color, StatusBarStyle } from 'react-native-facebook-account-kit'
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');
var options = {
    title: 'Select Photo',
    //customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


class SignupController extends Component {

    constructor(props) {
        super(props);
        // console.log('this.props.isFromNotLogin ', this.props.isFromNotLogin)
        this.state = {
            full_name: "",
            email: "",
            phone: "",
            country_code: "",
            password: "",
            confirmPassword: "",
            user_type: Utility.USER_TYPE.USER,
            photoIDUrl: undefined,
            isAgreeTerms: false,
            spinnerVisible: false,
            isSocialLogin: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            socialType: '',
            socialId: '',
            cmsType: "",
            cmsTitle: "",
            photoSocial: "",
        };
    }
    componentDidMount() {
        if (Utility.getAWSData == undefined) {
            Utility.getAWS();
        }
        Utility._checkCameraPermission().then((hasCameraPermission) => {
            this.setState({ hasCameraPermission });
            if (!hasCameraPermission) return;
            else {
                Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                    this.setState({ hasWritePermission });
                    if (!hasWritePermission) return;
                });
            }
        });
        //Get social data fron Signin screen
        if (this.props.isFromSocial != undefined && this.props.isFromSocial == true) {
            this.setState({
                full_name: this.props.full_name,
                email: this.props.email,
                socialType: this.props.socialType,
                socialId: this.props.socialId,
                isSocialLogin: true,
                photoSocial: this.props.photo
            })
        }
    }

    btnCreateAccountTapped() {
        Utility.hideKeyboard();
        if (!this.state.isSocialLogin) {
            if (this.state.full_name.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_your_name)
            } else if (Utility.validateEmail(this.state.email) == false) {
                Utility.showToast(Utility.MESSAGES.please_enter_valid_email)
            } else if (this.state.phone.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_phone)
            } else if (this.state.phone.trim().length < 10 || this.state.phone.trim().length > 16) {
                Utility.showToast(Utility.MESSAGES.please_enter_valid_phone)
            } else if (this.state.password.trim() === "") {
                Utility.showToast(Utility.MESSAGES.please_enter_password)
            } else if (this.state.password.trim().length < 6 || this.state.password.trim().length > 32) {
                Utility.showToast(Utility.MESSAGES.password_should_be)
            } else if (this.state.password.trim() !== this.state.confirmPassword.trim()) {
                Utility.showToast(Utility.MESSAGES.password_not_match)
            } else if (!this.state.isAgreeTerms) {
                Utility.showToast(Utility.MESSAGES.please_accept_tnc_pp)
            } else {
                this.preSignUP()
            }
        } else {
            if (this.state.full_name.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_your_name)
            } else if (Utility.validateEmail(this.state.email) == false) {
                Utility.showToast(Utility.MESSAGES.please_enter_valid_email)
            } else if (this.state.phone.trim() == "") {
                Utility.showToast(Utility.MESSAGES.please_enter_phone)
            } else if (this.state.phone.trim().length < 10 || this.state.phone.trim().length > 16) {
                Utility.showToast(Utility.MESSAGES.please_enter_valid_phone)
            } else if (!this.state.isAgreeTerms) {
                Utility.showToast(Utility.MESSAGES.please_accept_tnc_pp)
            } else {
                this.preSignUP()
            }
        }

    }

    preSignUP() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.PRE_SIGNUP, {
            'email': this.state.email,
            'phone': this.state.phone
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.openMobileVerificationView()
            } else {
                Utility.showToast(error.message);
                //Utility.showAlert('Error', error.message);
            }
        });
    }
    openMobileVerificationView() {
        // console.log("isSocial :", this.state.isSocialLogin)
        // console.log("Phone : " + this.state.phone, this.state.country_code)
        // Settings.configureMobileVerificationView("9904081622","01")
        Settings.configureMobileVerificationView(this.state.phone, this.state.country_code);
        // Shows the Facebook Account Kit view for login via SMS
        RNAccountKit.loginWithPhone().then((token) => {
            if (!token) {
                console.log('Login cancelled')
            } else {
                console.log(`Logged with phone. Token: ${token}`)
                RNAccountKit.getCurrentAccount().then((account) => {
                    this.setState({
                        country_code: '+' + account.phoneNumber.countryCode,
                        phone: account.phoneNumber.number
                    });
                    if (this.state.photoIDUrl != undefined) {
                        this.uploadImage()
                    } else {
                        if (this.state.isSocialLogin == true) {
                            this.socialSignUp('')
                        } else {
                            this.signUp('')
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                }).done();
            }
        })
    }
    //API
    uploadImage() {
        if (Utility.getAWSData != undefined) {
            var photo = {
                uri: this.state.photoIDUrl,
                type: 'image/*',
                name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
            };

            this.setState({ spinnerVisible: true });
            const options = {
                keyPrefix: Utility.getAWSData.folder_profile + '/',
                bucket: "locart",
                region: Utility.getAWSData.region,
                accessKey: Utility.getAWSData.access_key,
                secretKey: Utility.getAWSData.secret_key,
                successActionStatus: 201
            }
            this.setState({ spinnerVisible: true });
            RNS3.put(photo, options).then(response => {
                this.setState({ spinnerVisible: false });
                if (response.status !== 201)
                    throw new Error("Failed to upload image to S3");
                else {
                    console.log('UPLOAD RESPONSE', response.body);
                    if (this.state.isSocialLogin == true) {
                        this.socialSignUp(photo.name)
                    } else {
                        this.signUp(photo.name)
                    }
                }
            });
        }
    }
    // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
    //     'type': 'profile_pic',
    //     'media_file': photo,
    // }, (response, error) => {
    //     this.setState({ spinnerVisible: false });
    //     if (error == null) {
    //         console.log(response)
    //         if (this.state.isSocialLogin == true) {
    //             this.socialSignUp(response.filename)
    //         } else {
    //             this.signUp(response.filename)
    //         }
    //     } else {
    //         Utility.showToast(error.message);
    //         //Utility.showAlert('Error', error.message);
    //     }
    // });
    //API
    socialSignUp(image) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.SOCIAL_LOGIN, {
            'country_code': this.state.country_code,
            'password': this.state.password,
            'phone': this.state.phone,
            'email': this.state.email,
            'full_name': this.state.full_name,
            'profile_pic': image,
            'social_id': this.state.socialId,
            'social_type': this.state.socialType
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                    // Utility.resetTo('HomeViewController')
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
        });
    }
    //API
    signUp(image) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.SIGNUP, {
            'full_name': this.state.full_name,
            'email': this.state.email,
            'country_code': this.state.country_code,
            'phone': this.state.phone,
            'user_type': this.state.user_type,
            'password': this.state.password,
            'profile_pic': image
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                    // Utility.resetTo('HomeViewController')
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
        });
    }

    btnSignInTapped() {
        // this.props.navigator.popToRoot({
        //     animated: true
        // });
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    btnIAgreeTapped() {
        this.setState({
            isAgreeTerms: !this.state.isAgreeTerms
        })
    }


    btnSelectImageTapped() {
        Utility.hideKeyboard();
        if (this.state.hasCameraPermission && this.state.hasWritePermission) {
            ImagePicker.showImagePicker(options, (response) => {
                // console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let source = {
                        uri: response.uri
                    };
                    // You can also display the image using data:
                    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                    this.setState({ photoIDUrl: response.uri });
                }
            });
        }
    }


    showCMSTapped = (cmsType) => {
        this.props.navigator.push({
            screen: 'Artwork.CMSViewController',
            title: undefined,
            animationType: 'push',
            animated: true,
            passProps: {
                type: cmsType,
            },
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {/*Background Image*/}
                <Image style={styles.bgImageView} source={Images.background} resizeMode={'cover'} />
                <SafeAreaView style={styles.safeAreaView}>
                    <KeyboardAwareScrollView style={{ marginTop: 15 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.viewsignup}><Text style={styles.txtSignup}>SIGN UP</Text></View>
                        <View style={styles.viewmaincontainer}>
                            <View style={styles.viewsubcontainer}>
                                <View style={styles.viewTextFieldContainer}>
                                    <TextField leftIcon={Images.inputUser}
                                        inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        placeholderTextColor={Colors.grayTextColor}
                                        placeholder={""}
                                        maxLength={255}
                                        borderColor={'transparent'}
                                        selectionColor={Colors.blueType1}
                                        ref={"name"}
                                        onSubmitEditing={(event) => {
                                            this.refs.email.focus();
                                        }}
                                        returnKeyType="next"
                                        onChangeText={(full_name) => this.setState({ full_name })}
                                        value={this.state.full_name} />
                                    <View style={styles.bottomLine} />
                                    <Text style={styles.textHint}>name</Text>
                                </View>
                                <View style={styles.viewTextFieldContainer}>
                                    <TextField inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        placeholderTextColor={Colors.grayTextColor}
                                        keyboardType={'email-address'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        maxLength={255}
                                        autoCapitalize={'none'}
                                        selectionColor={Colors.blueType1}
                                        borderColor={'transparent'}
                                        ref={"email"}
                                        onSubmitEditing={(event) => {
                                            this.refs.phone.focus();
                                        }}
                                        returnKeyType="next"
                                        onChangeText={(email) => this.setState({ email })}
                                        value={this.state.email} />
                                    <View style={styles.bottomLine} />
                                    <Text style={styles.textHint}>email address</Text>
                                </View>

                                <View style={styles.viewTextFieldContainer}>
                                    <TextField leftIcon={Images.phone_signup_icon}
                                        inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        placeholderTextColor={Colors.grayTextColor}
                                        keyboardType={'phone-pad'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        maxLength={16}
                                        selectionColor={Colors.blueType1}
                                        borderColor={'transparent'}
                                        ref={"phone"}
                                        autoCapitalize={'none'}
                                        onSubmitEditing={(event) => {
                                            (!this.state.isSocialLogin) ?
                                                this.refs.password.focus()
                                                :
                                                null
                                        }}
                                        returnKeyType="next"
                                        onChangeText={(phone) => this.setState({ phone })}
                                        value={this.state.phone} />
                                    <View style={styles.bottomLine} />
                                    <Text style={styles.textHint}>phone number</Text>
                                </View>

                                {(!this.state.isSocialLogin) ?
                                    <View>
                                        <View style={styles.viewTextFieldContainer}>
                                            <TextField secureTextEntry={true}
                                                placeholderTextColor={Colors.grayTextColor}
                                                inputStyle={styles.inputText}
                                                wrapperStyle={styles.inputWrapper}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                borderColor={'transparent'}
                                                ref={"password"}
                                                autoCapitalize={'none'}
                                                onSubmitEditing={(event) => {
                                                    this.refs.confirm_password.focus()
                                                }}
                                                returnKeyType="next"
                                                onChangeText={(password) => this.setState({ password })}
                                                value={this.state.password} />
                                            <View style={styles.bottomLine} />
                                            <Text style={styles.textHint}>password</Text>
                                        </View>
                                        <View style={styles.viewTextFieldContainer}>
                                            <TextField secureTextEntry={true}
                                                placeholderTextColor={Colors.grayTextColor}
                                                inputStyle={styles.inputText}
                                                wrapperStyle={styles.inputWrapper}
                                                placeholder={""}
                                                autoCapitalize={'none'}
                                                selectionColor={Colors.blueType1}
                                                borderColor={'transparent'}
                                                ref={"confirm_password"}
                                                onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                                                value={this.state.confirmPassword} />
                                            <View style={styles.bottomLine} />
                                            <Text style={styles.textHint}>confirm password</Text>
                                        </View>
                                    </View>
                                    : null}
                                {/* Terms and Policy */}
                                <View style={styles.viewAgreeTerms}>
                                    <TouchableOpacity style={styles.btnAgree} onPress={this.btnIAgreeTapped.bind(this)} activeOpacity={0.6}>
                                        <Image style={{ width: 23, height: 23 }} source={this.state.isAgreeTerms
                                            ? Images.check_icon
                                            : Images.uncheck_icon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnAgree} onPress={() => this.showCMSTapped(Utility.cmsType.TermsOfUse)} activeOpacity={0.6}>
                                        <Text style={styles.textAgreeTerms} numberOfLines={1}>
                                            I Accept
                                        </Text>
                                        <Text style={[
                                            styles.textPrivacy, {
                                                marginTop: 3
                                            }
                                        ]} numberOfLines={1}>
                                            Term of Use</Text>
                                        <Text style={styles.textAgreeTerms} numberOfLines={1}>
                                            And
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btnAgree} onPress={() => this.showCMSTapped(Utility.cmsType.PrivacyPolicy)} activeOpacity={0.6}>
                                        <Text style={[
                                            styles.textPrivacy, {
                                                marginTop: 3
                                            }
                                        ]} numberOfLines={1}>
                                            Privacy Policy</Text>
                                    </TouchableOpacity>
                                </View>
                                {/* submit button */}
                                <INTButton buttonStyle={styles.btnSubmit} title="Create Account"
                                    titleStyle={styles.textSubmit}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.btnCreateAccountTapped()} />
                            </View>

                            <View style={{ position: 'absolute', alignSelf: 'center' }}>
                                <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: 'center' }} onPress={this.btnSelectImageTapped.bind(this)} >
                                    <Image style={{ height: 80, width: 80, borderRadius: 40 }} source={Images.input_userphoto} />
                                    <ProgressiveImage
                                        style={styles.imgPhoto}
                                        placeholderStyle={styles.placeHolderPhotoStyle}
                                        uri={this.state.photoIDUrl != undefined ? this.state.photoIDUrl : undefined}
                                        placeholderSource={Images.input_userphoto}
                                        borderRadius={1}
                                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />

                                </TouchableOpacity>
                            </View>
                        </View>

                    </KeyboardAwareScrollView>
                    {/* View Don't Have account */}
                    <View style={styles.viewBottom}>
                        <TouchableOpacity style={styles.btnSignUp} onPress={this.btnSignInTapped.bind(this)} activeOpacity={0.6}>
                            <Text style={styles.textSignUp} numberOfLines={1} allowFontScaling={true}>
                                {"Already have an account? "}
                                <Text style={{
                                    fontFamily: Fonts.santanaBold,
                                    color: Colors.greenType1,
                                    fontSize: Utility.NormalizeFontSize(12)
                                }}
                                    numberOfLines={1}
                                    allowFontScaling={true}>
                                    Sign In
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default SignupController
