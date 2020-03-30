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
    SafeAreaView,
} from 'react-native';

import styles from './styles'

import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import Spinner from 'react-native-loading-spinner-overlay';
import TopbarView from '../../component/TopbarView'
import INTButton from '../../component/INTButton'
import KeyboardAwareScrollView from '../../component/KeyboardAwareScrollView';
import TextField from '../../component/TextField';

class ChangePasswordController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            currentPassword: "",
            confirmPassword: "",
            spinnerVisible: false,
        };
    }
    componentDidMount() { }

    onbtnSavePress() {
        if (this.state.currentPassword.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_current_password);
        } else if (this.state.newPassword.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_new_password);
        } else if (this.state.newPassword != this.state.confirmPassword) {
            Utility.showToast(Utility.MESSAGES.password_not_match);
        } else {
            Utility.hideKeyboard();
            this.changePassword();
        }
    }

    changePassword() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.CHANGE_PASSWORD, {
            "user_id": Utility.user.user_id + '',
            "oldpassword": this.state.currentPassword + '',
            "newpassword": this.state.newPassword + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ currentPassword: "" })
                this.setState({ newPassword: "" })
                this.setState({ confirmPassword: "" })
                Utility.showToast(Utility.MESSAGES.password_change_success);
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.safeAreaView}>
                    <TopbarView title={"Change Password"} isLeftItemTypeLogo={false} showSearchBtn={false} showOptionsBtn={false} >
                    </TopbarView>
                    <View style={styles.mainContainer}>
                        {/* <KeyboardAwareScrollView contentContainerStyle={styles.scrollView} automaticallyAdjustContentInsets={false} bounces={false} showsVerticalScrollIndicator={false}> */}
                        <TextField inputStyle={styles.inputText}
                            wrapperStyle={styles.inputWrapper}
                            placeholderTextColor={Colors.grayTextColor}
                            placeholder={"Current Password"}
                            secureTextEntry={true}
                            multiline={false}
                            maxLength={15}
                            autoCorrect={false}
                            value={this.state.currentPassword}
                            onChangeText={(currentPassword) => this.setState({ currentPassword })}
                        />
                        <TextField inputStyle={styles.inputText} wrapperStyle={styles.inputWrapper} placeholderTextColor={Colors.grayTextColor} placeholder={"New Password"} secureTextEntry={true} multiline={false} maxLength={15} autoCorrect={false} value={this.state.newPassword} onChangeText={(newPassword) => this.setState({ newPassword })} />
                        <TextField inputStyle={styles.inputText} wrapperStyle={styles.inputWrapper} placeholderTextColor={Colors.grayTextColor} placeholder={"Confirm Password"} secureTextEntry={true} multiline={false} maxLength={15} autoCorrect={false} value={this.state.confirmPassword} onChangeText={(confirmPassword) => this.setState({ confirmPassword })} />
                        <INTButton buttonStyle={styles.btnSubmit} title="Change"
                            titleStyle={styles.textSubmit}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onbtnSavePress()} />
                        {/* </KeyboardAwareScrollView> */}
                    </View>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default ChangePasswordController
