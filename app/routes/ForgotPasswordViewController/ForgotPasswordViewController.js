/*Replace the Whole Code*/



import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    ListView,
    Platform,
    Keyboard,
} from 'react-native';

import styles from './styles'

import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import TopbarView from '../../component/TopbarView'
import INTButton from '../../component/INTButton'
import TextField from '../../component/TextField'
import SafeAreaView from '../../component/SafeAreaView';
import Fonts from '../../config/Fonts';
import Underline from '../../component/TextField/Underline';
// import firebase from 'react-native-firebase'
import Spinner from 'react-native-loading-spinner-overlay';
class ForgotPasswordViewController extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            spinnerVisible: false,
        };
    }
    componentDidMount() {

    }

    onbtnForgotPasswordClick() {
        if (Utility.validateEmail(this.state.email) == false) {
            Utility.showToast(Utility.MESSAGES.please_enter_valid_email);
        }
        else {
            this.setState({ spinnerVisible: true });
            WebClient.postRequest(Settings.URL.FORGOT_PASSWORD, {
                'email': this.state.email
            }, (response, error) => {
                this.setState({ spinnerVisible: false });
                if (error == null) {
                    Utility.showToast(Utility.MESSAGES.password_reset_email_sent)
                    setTimeout(() => {
                        Utility.resetTo("SigninController")
                    }, 2500);
                } else {
                    Utility.showToast(error.message);
                    //Utility.showAlert('Error', error.message);
                }
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeAreaView}>
                    {/*<Image source={Images.background} style={styles.bgImageView} />*/}
                    <Image style={styles.bgImageView} source={Images.background} resizeMode={'cover'} />
                    <TopbarView title={"Forgot Password"} isLeftItemTypeLogo={false} showSearchBtn={false} showOptionsBtn={false} >
                    </TopbarView>

                    {/* App Name  */}
                    <View style={styles.viewTop}>
                        <Text style={styles.textAppName}>Loc Art</Text>
                    </View>
                    <View style={{ flex: 1, minHeight: 250 }}>
                        <View style={styles.viewSignInContainer}>
                            {/* TextField emai-address */}
                            <View style={styles.viewTextFieldContainer}>
                                <TextField inputStyle={styles.inputText}
                                    wrapperStyle={styles.inputWrapper}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    keyboardType={'email-address'}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(email) => this.setState({ email })}
                                    value={this.state.email} 
                                    maxLength={255}
                                    autoCapitalize={'none'}/>
                                <View style={styles.bottomLine} />
                                <Text style={styles.textHint}>email address</Text>
                            </View>
                        </View>

                        {/* Submit button */}
                        <INTButton buttonStyle={styles.btnSubmit} title="Submit"
                            titleStyle={styles.textSubmit}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onbtnForgotPasswordClick()} />
                    </View>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>


        );
    }
}

export default ForgotPasswordViewController
