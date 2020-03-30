import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';

import styles from './styles'

import SafeAreaView from '../../component/SafeAreaView';
import TopbarView from '../../component/TopbarView';
import INTButton from '../../component/INTButton'
import TextField from '../../component/TextField'
import Colors from '../../config/Colors';
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


class SupportViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            strFirstNameLastNameText: Utility.user.full_name,
            strEmailText: Utility.user.email,
            strHelpDescription: ''
        };
    }

    btnSendSupportTapped() {
        if (this.isValidInputData() == true) {
            this.supportAPI()
        }
    }

    isValidInputData() {
        var isValidData = true
        if (this.state.strFirstNameLastNameText.trim().length == 0) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_name)
        } else if (Utility.validateEmail(this.state.strEmailText) == false) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_valid_email)
        } else if (this.state.strHelpDescription.trim().length == 0) {
            isValidData = false
            Utility.showToast(Utility.MESSAGES.please_enter_des)
        }
        return isValidData
    }

    //API
    supportAPI() {
        this.setState({ spinnerVisible: true })
        var reqestParam = {};
        reqestParam.user_id = Utility.user.user_id + ''
        reqestParam.name = this.state.strFirstNameLastNameText + ''
        reqestParam.email = this.state.strEmailText + ''
        reqestParam.description = this.state.strHelpDescription + ''
        WebClient.postRequest(Settings.URL.ADD_CONTACT_REQUEST, reqestParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.thankyou_for_your_feedback)
                Utility.navigator.pop({
                    animated: true,
                });
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    showFAQTapped = (cmsType) => {
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
            <SafeAreaView>
                <TopbarView
                    title={'SUPPORT'}
                    isTitleTappable={false}>
                </TopbarView>
                <KeyboardAwareScrollView
                    bounces={true}
                    automaticallyAdjustContentInsets={true}
                    extraScrollHeight={100}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.containerViewStyle}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.supportText1}>Have a problem?</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                                <Text style={styles.supportText2}>Be sure to check the </Text>
                                <Text style={[styles.supportText2, { textDecorationLine: 'underline' }]} onPress={() => this.showFAQTapped(Utility.cmsType.FAQ)}>FAQ</Text>
                                <Text style={styles.supportText2}> for a solution first!</Text>
                            </View>
                            <Text style={styles.supportText3}>Fill out the below and we'll do our best to get it sorted out</Text>
                        </View>
                        <View style={styles.applicationFormInnerContainer}>
                            <View style={[styles.titleContainer, { marginRight: 10 }]}>
                                <Text style={styles.titleStyle}>First & Last Name</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(strFirstNameLastNameText) => this.setState({ strFirstNameLastNameText })}
                                    value={this.state.strFirstNameLastNameText}
                                />
                            </View>
                            <View style={[styles.titleContainer, { marginLeft: 10 }]}>
                                <Text style={styles.titleStyle}>Email</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(strEmailText) => this.setState({ strEmailText })}
                                    value={this.state.strEmailText}
                                />
                            </View>
                        </View>
                        <View style={styles.artworkDescriptionStyle}>
                            <Text style={styles.titleStyle}>How can we help?</Text>
                            <TextField
                                inputStyle={Utility.isPlatformAndroid ? styles.inputTextDescriptionAndroid : styles.inputTextDescription}
                                autoCorrect={false}
                                placeholder={""}
                                multiline={true}
                                selectionColor={Colors.blueType1}
                                onChangeText={(strHelpDescription) => this.setState({ strHelpDescription })}
                                value={this.state.strHelpDescription}
                            />
                        </View>
                        <TouchableOpacity onPress={() => this.btnSendSupportTapped()} activeOpacity={0.7}>
                            <View style={styles.sendButtonView}>
                                <Text style={{ color: 'white', fontFamily: Fonts.promptRegular }}>Send</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}
export default SupportViewController;