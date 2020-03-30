import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeAreaView from '../../component/SafeAreaView';
import TextField from '../../component/TextField'
import INTButton from '../../component/INTButton'
import TagView from '../../component/TagView';
import Spinner from 'react-native-loading-spinner-overlay';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import ModalBox from 'react-native-modalbox';
import ProgressiveImage from '../../component/ProgressiveImage';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment'
var ImagePicker = require('react-native-image-picker');
import { RNS3 } from 'react-native-aws3';
var options = {
    title: 'Select Photo',
    //customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
class BankInfoViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spinnerVisible: false,
            isTransferCall: this.props.isTransferCall ? this.props.isTransferCall : false,
            amount: this.props.amount ? this.props.amount : 0,
            order_ids: this.props.order_ids ? this.props.order_ids : 0,
            account_holder_name: "",
            account_number: "",
            routing_number: "",
            // account_holder_type: "Individual",
            // arrAccountHolderList: [{ type: "Individual" }, { type: "Company" }],
            first_name: "",
            last_name: "",
            email: "",
            address_line1: "",
            postal_code: "",
            state: "",
            city: "",
            ssn: "",
            verification: "",
            dob: undefined,
            identity_img: undefined,
            isDateTimePickerVisible: false,
            // accountHolderModalVisible: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            photoIDUrl: undefined,
            isExistAccount: false,
            is_verified: false,
            is_from_server: false,
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
        this.getBanInfo();
    }

    //API
    leftBtnTaaped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
        });
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

    getBanInfo() {
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
        }
        // console.log("GET_BANK_INFO", JSON.stringify(paramRequest))
        WebClient.postRequest(Settings.URL.GET_BANK_INFO, paramRequest, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.hasOwnProperty('account_holder_name')) {
                    this.setState({
                        account_holder_name: response.account_holder_name,
                        account_number: 'xxxxxxxx' + response.account_number,
                        routing_number: response.routing_number,
                        account_holder_type: response.account_holder_type,

                        first_name: response.first_name,
                        last_name: response.last_name,
                        email: response.email,
                        address_line1: response.address_line1,
                        postal_code: response.postal_code,
                        state: response.state,
                        city: response.city,
                        // ssn: response.ssn,
                        dob: response.dob,
                        identity_img: response.identity_img,
                        is_verified: response.is_verified,
                        is_from_server: true,
                        verification: response.verification,
                    })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    saveBankInfoTapped() {
        if (this.state.account_holder_name.trim() == "") {
            Utility.showToast(Utility.MESSAGES.Utility.MESSAGES.please_enter_account)
        } else if (this.state.account_number.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_account_number)
        } else if (this.state.account_number.trim().length < 12 || this.state.account_number.trim().length > 16) {
            Utility.showToast(Utility.MESSAGES.please_enter_valid_account_number)
        } else if (this.state.routing_number.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_routing_number)
        } else if (this.state.first_name.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_first_name)
        } else if (this.state.last_name.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_last_name)
        } else if (this.state.email.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_email)
        } else if (Utility.validateEmail(this.state.email) == false) {
            Utility.showToast(Utility.MESSAGES.please_enter_valid_email)
        } else if (this.state.dob.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_select_date_of_birth)
        } else if (this.state.address_line1.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_address)
        } else if (this.state.postal_code.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_postal_code)
        } else if (this.state.state.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_state)
        } else if (this.state.city.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_city)
        }
        else if (!this.state.is_verified && this.state.ssn.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_ssn)
        } else if (!this.state.is_verified && this.state.ssn.trim().length < 4) {
            Utility.showToast(Utility.MESSAGES.please_enter_valid_ssn)
        }
        else if (!this.state.is_verified && this.state.photoIDUrl == undefined) {
            Utility.showToast(Utility.MESSAGES.please_enter_identity_proof)
        } else {
            if (!this.state.is_verified)
                this.uploadImage();
            else {
                this.saveBankInfo(this.state.identity_img)
            }
        }
    }

    uploadImage() {
        if (Utility.getAWSData == undefined) {
            return;
        }
        var photo = {
            uri: this.state.photoIDUrl,
            type: 'image/*',
            name: (Utility.isPlatformAndroid ? 'android_doc_' : 'ios_doc_') + new Date().getTime() + '.jpg'
        };
        const options = {
            keyPrefix: Utility.getAWSData.folder_document + '/',
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
                // console.log('UPLOAD RESPONSE', response.body);
                this.saveBankInfo(photo.name)
            }
        });
        // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
        //     'type': 'document',
        //     'media_file': photo,
        // }, (response, error) => {
        //     this.setState({ spinnerVisible: false });
        //     if (error == null) {
        //         console.log(response)
        //         this.saveBankInfo(response.filename)
        //     } else {
        //         Utility.showToast(error.message);
        //         //Utility.showAlert('Error', error.message);
        //     }
        // });
    }

    saveBankInfo(document_file) {
        Utility.hideKeyboard();
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
            'account_holder_name': this.state.account_holder_name + '',
            'account_number': this.state.account_number.replace('x', ''),
            'routing_number': this.state.routing_number + '',
            'account_holder_type': this.state.account_holder_type + '',
            'first_name': this.state.first_name + '',
            'last_name': this.state.last_name + '',
            'email': this.state.email + '',
            'address_line1': this.state.address_line1 + '',
            'postal_code': this.state.postal_code + '',
            'state': this.state.state + '',
            'city': this.state.city + '',
            'ssn': this.state.ssn + '',
            'dob': this.state.dob + '',
            'identity_img': document_file + '',
        }
        // console.log("ADD_BANK_INFO", JSON.stringify(paramRequest))
        WebClient.postRequest(Settings.URL.ADD_BANK_INFO, paramRequest, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.bank_info_securly_saved_with_stripe);
                if (this.state.isTransferCall) {
                    this.transferToBank();
                } else {
                    this.leftBtnTaaped();
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }


    //Transfer To bank
    transferToBank() {
        Utility.hideKeyboard();
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
            'amount': this.state.amount + '',
            'order_ids': this.state.order_ids + '',
        }
        console.log("TRANSFER_MONEY", JSON.stringify(paramRequest))
        WebClient.postRequest(Settings.URL.TRANSFER_MONEY, paramRequest, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.amount_transfer);
                this.leftBtnTaaped();
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    render() {
        var datePicker = <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 13))}
        />

        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {datePicker}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={() => this.leftBtnTaaped()} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackBlue} />
                                <Text style={styles.titleTextStyle}>Bank Info</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView style={{ marginTop: 20 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.applicationFormContainer}>
                            {
                                (!this.state.is_verified && this.state.verification != undefined && this.state.verification != "") ?
                                    <Text style={styles.titleStyle}>{this.state.verification}</Text>
                                    : null
                            }
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Account Holder Name</Text>
                                {
                                    this.state.is_from_server ?
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            ref={"account_holder_name"}
                                            onSubmitEditing={(event) => {
                                                this.refs.account_number.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onPress={() => this.askConfirmation()}
                                            value={this.state.account_holder_name}
                                        // editable={false}
                                        /> :
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            ref={"account_holder_name"}
                                            onSubmitEditing={(event) => {
                                                this.refs.account_number.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(account_holder_name) => this.setState({ account_holder_name })}
                                            value={this.state.account_holder_name}
                                        />
                                }
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Account Number</Text>
                                {
                                    this.state.is_from_server ?
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            keyboardType={'numeric'}
                                            ref={"account_number"}
                                            onSubmitEditing={(event) => {
                                                this.refs.routing_number.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onPress={() => this.askConfirmation()}
                                            value={this.state.account_number}
                                        // editable={false}
                                        /> :
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            keyboardType={'numeric'}
                                            ref={"account_number"}
                                            onSubmitEditing={(event) => {
                                                this.refs.routing_number.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(account_number) => this.setState({ account_number })}
                                            value={this.state.account_number}
                                        />
                                }
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Routing Number</Text>
                                {
                                    this.state.is_from_server ?
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            keyboardType={'numeric'}
                                            ref={"routing_number"}
                                            onSubmitEditing={(event) => {
                                                // this.refs.description.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onPress={() => this.askConfirmation()}
                                            value={this.state.routing_number}
                                        // editable={false}
                                        /> :
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            maxLength={50}
                                            keyboardType={'numeric'}
                                            ref={"routing_number"}
                                            onSubmitEditing={(event) => {
                                                // this.refs.description.focus();
                                            }}
                                            returnKeyType="done"
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(routing_number) => this.setState({ routing_number })}
                                            value={this.state.routing_number}
                                        />
                                }
                            </View>
                            {/* <View style={[styles.titleContainer]}>
                                <TouchableOpacity
                                    //onPress={() => this.accountHolderClick()} 
                                    activeOpacity={0.9}>
                                    <Text style={styles.titleStyle}>Account Type</Text>
                                    <View style={[styles.dropDownView]}>
                                        <Text style={[styles.dropDownText]} numberOfLines={1} onPress={() => this.accountHolderClick()}>
                                            {this.state.account_holder_type}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View> */}
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>First Name</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"first_name"}
                                    onSubmitEditing={(event) => {
                                        this.refs.last_name.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(first_name) => this.setState({ first_name })}
                                    value={this.state.first_name}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Last Name</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"last_name"}
                                    onSubmitEditing={(event) => {
                                        this.refs.email.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(last_name) => this.setState({ last_name })}
                                    value={this.state.last_name}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Email</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    keyboardType={'email-address'}
                                    maxLength={255}
                                    ref={"email"}
                                    onSubmitEditing={(event) => {
                                        this.refs.address.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(email) => this.setState({ email })}
                                    value={this.state.email}
                                    editable={!this.state.is_verified}
                                    autoCapitalize={'none'}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>DOB</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"dob"}
                                    onSubmitEditing={(event) => {
                                        // this.refs.account_number.focus();
                                    }}
                                    returnKeyType="next"
                                    editable={false}
                                    selectionColor={Colors.blueType1}
                                    // onChangeText={(dob) => this.setState({ dob })}
                                    onPress={() => !this.state.is_verified ? this._showDateTimePicker() : null}
                                    value={this.state.dob}
                                // editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Address Line 1</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"address"}
                                    onSubmitEditing={(event) => {
                                        this.refs.postal_code.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(address_line1) => this.setState({ address_line1 })}
                                    value={this.state.address_line1}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>City</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"city"}
                                    onSubmitEditing={(event) => {
                                        this.refs.ssn.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(city) => this.setState({ city })}
                                    value={this.state.city}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>State</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    ref={"state"}
                                    onSubmitEditing={(event) => {
                                        this.refs.city.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(state) => this.setState({ state })}
                                    value={this.state.state}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.titleStyle}>Postal Code</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    placeholder={""}
                                    maxLength={50}
                                    keyboardType={'numeric'}
                                    ref={"postal_code"}
                                    onSubmitEditing={(event) => {
                                        this.refs.state.focus();
                                    }}
                                    returnKeyType="next"
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(postal_code) => this.setState({ postal_code })}
                                    value={this.state.postal_code}
                                    editable={!this.state.is_verified}
                                />
                            </View>
                            {
                                this.state.is_verified ?
                                    null :
                                    <View style={[styles.titleContainer]}>
                                        <Text style={styles.titleStyle}>Social Security Number last 4 digit</Text>
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            keyboardType={'numeric'}
                                            maxLength={4}
                                            ref={"ssn"}
                                            onSubmitEditing={(event) => {
                                                // this.refs.account_number.focus();
                                            }}
                                            returnKeyType="next"
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(ssn) => this.setState({ ssn })}
                                            value={this.state.ssn}
                                        />
                                    </View>
                            }

                            {/*Identity Proof IMAGE*/}
                            {
                                this.state.is_verified ?
                                    null :
                                    <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => this.btnSelectImageTapped()}>
                                        <View style={styles.bannerProjectContainer}>
                                            {(this.state.photoIDUrl != undefined) ?
                                                <View  >
                                                    <ProgressiveImage
                                                        style={{
                                                            width: Utility.screenWidth,
                                                            height: 100,
                                                            alignSelf: 'center',
                                                            resizeMode: 'contain',
                                                        }}
                                                        uri={(this.state.photoIDUrl != undefined) ?
                                                            this.state.photoIDUrl : undefined}
                                                        placeholderSource={Images.placeholderMediaImage}
                                                    />
                                                </View>
                                                : <INTButton
                                                    buttonStyle={{ alignSelf: 'center', left: 0, bottom: 0, right: 0, top: 0 }}
                                                    // icon={Images.cloudIcon}
                                                    title="Identity Document"
                                                    titleStyle={styles.bannerProjectText}
                                                    spaceBetweenIconAndTitle={10}
                                                    onPress={() => this.btnSelectImageTapped()}
                                                />
                                            }

                                        </View>
                                    </TouchableOpacity>
                            }
                            <View style={{ marginTop: 25, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                                <INTButton buttonStyle={{ paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                    title={'Save'}
                                    titleStyle={{ color: 'white' }}
                                    onPress={() => this.saveBankInfoTapped()}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {/* {this.accountHolderModal()} */}
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
    askConfirmation() {
        Alert.alert(
            'Change Account',
            'Are you sure want to change account information?',
            [
                { text: 'No', onPress: () => console.log('cancel pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => this.setState({
                        is_from_server: false,
                        account_holder_name: '',
                        account_number: '',
                        routing_number: '',
                    })
                },
            ],
            { cancelable: false }
        )
    }
    _handleDatePicked = date => {
        // console.log("A date has been picked: ", date);
        var formattedDate = moment(date).format('MM/DD/YYYY');
        this.setState({ dob: formattedDate });
        this._hideDateTimePicker();
    };
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
    // accountHolderClick() {
    //     Utility.hideKeyboard();
    //     this.setState({ accountHolderModalVisible: true });
    // }
    // accountHolderItemClick(item) {
    //     this.setState({ account_holder_type: item.type });
    //     this.setState({ accountHolderModalVisible: false });
    // }
    // accountHolderPopUpClose() {
    //     this.setState({ accountHolderModalVisible: false });
    // }
    // accountHolderModal() {
    //     var preferedMediumModelbox = <ModalBox
    //         coverScreen={true}
    //         swipeToClose={false}
    //         backdropPressToClose={false}
    //         swipeToClose={false}
    //         backButtonClose={true}
    //         onClosed={() => this.setState({ accountHolderModalVisible: false })}
    //         style={styles.modalContainer}
    //         isOpen={this.state.accountHolderModalVisible}
    //         position='bottom'>
    //         <View style={{ flex: 1, paddingHorizontal: 10 }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    //                 <Text style={[styles.modalHeaderTextStyle]}>Select Account Type</Text>
    //                 <TouchableOpacity onPress={this.accountHolderPopUpClose.bind(this)} activeOpacity={0.7}>
    //                     <Text style={styles.closeTextStyle} >Close</Text>
    //                 </TouchableOpacity>
    //             </View>
    //             <FlatList
    //                 style={{ marginTop: 5 }}
    //                 data={this.state.arrAccountHolderList}
    //                 keyExtractor={(item, index) => index}
    //                 renderItem={({ item, index }) =>
    //                     <View style={{ marginHorizontal: 8 }} >
    //                         <Text style={styles.modalTextStyle} onPress={this.accountHolderItemClick.bind(this, item)} >
    //                             {item.type}
    //                             {console.log(">>>> POS " + index)}
    //                         </Text>
    //                         <View style={styles.viewBottom} />
    //                     </View>}
    //                 numColumns={1}
    //             />
    //         </View>
    //     </ModalBox >
    //     return preferedMediumModelbox;
    // }
}
export default BankInfoViewController