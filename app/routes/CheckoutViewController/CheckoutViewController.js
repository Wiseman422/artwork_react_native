import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ListView,
    Alert
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

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import RNGooglePlaces from 'react-native-google-places';

class CheckoutViewController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shipping_type: this.props.shipping_type,
            grand_total_price: this.props.grandTotalPrice,
            checkoutModalVisible: true,
            full_name: Utility.user.full_name,
            phone: Utility.user.phone,
            email: Utility.user.email,
            address: Utility.user.address,
            hasLocationAccessPermission: undefined,
            card_number: '',
            card_expiry: '',
            card_cvv: '',
        };
    }

    componentDidMount() {
    }

    leftBtnTaaped() {
        this.props.navigator.pop();
    }

    btnPlaceOrderTapped() {
        Utility.hideKeyboard();
        if (this.state.full_name.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_name);
        } else if (this.state.address.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_address);
        } else if (this.state.card_number.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_credit_card_number);
        } else if (this.state.card_expiry.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_expiry_date);
        } else if (this.state.card_cvv.trim().length == 0) {
            Utility.showToast(Utility.MESSAGES.please_enter_cvv);
        } else {
            this.placeOrderConfirmation();
        }
    }

    //Place Order tapped
    placeOrderConfirmation() {
        Utility.hideKeyboard();
        Alert.alert(
            Utility.MESSAGES.place_order,
            Utility.MESSAGES.are_you_sure_place_order,
            [
                { text: Utility.MESSAGES.no, onPress: () => console.log("Cancel"), style: 'cancel' },
                { text: Utility.MESSAGES.yes, onPress: () => this.placeholder() },
            ],
            { cancelable: true }
        )
    }


    placeholder() {
        this.setState({ spinnerVisible: true });
        var s = this.state.card_expiry;
        var i = s.indexOf('/');
        var exp_month = s.slice(0, i).trim();
        var exp_year = s.slice(i + 1, s.length).trim();

        var reqParam = {}
        reqParam.user_id = Utility.user.user_id + ''
        reqParam.order_amount = this.state.grand_total_price + ''
        reqParam.card_number = this.state.card_number + ''
        reqParam.exp_month = exp_month + ''
        reqParam.exp_year = exp_year + ''
        reqParam.cvv = this.state.card_cvv + ''
        // console.log("PLACE ORDER PARMS: ", JSON.stringify(reqParam));
        WebClient.postRequest(Settings.URL.PLACE_ORDER, reqParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.order_placed_success);
                setTimeout(() => {
                    Utility.resetTo('HomeViewController')
                }, 2000)
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    openLocationSelectionScreen() { // removed as per client comment
        Utility.hideKeyboard();
        Utility._checkLocationPermission().then((hasLocationAccessPermission) => {
            this.setState({ hasLocationAccessPermission });
            if (!hasLocationAccessPermission) return;
            else {
                if (this.state.hasLocationAccessPermission) {
                    RNGooglePlaces.openPlacePickerModal({
                        //   type: 'establishment',
                        //   country: 'CA',
                        latitude: this.state.latitude != 0 ? this.state.latitude : 0.0,
                        longitude: this.state.longitude != 0 ? this.state.longitude : 0.0,
                        radius: 10
                    })
                        .then((place) => {
                            // console.log("PLACE>>> " + place.address);
                            this.setState({ address: place.address, latitude: place.latitude, longitude: place.longitude });
                        })
                        .catch(error => console.log(error.message));  // error is a Javascript Error object
                } else {

                }
            }
        });

    }

    _handlingCardExpiry(text) {
        if (text.indexOf('.') >= 0 || text.length > 5) {
            // Since the keyboard will have a decimal and we don't want
            // to let the user use decimals, just exit if they add a decimal
            // Also, we only want 'MM/YY' so if they try to add more than
            // 5 characters, we want to exit as well
            return;
        }

        if (text.length === 2 && this.state.card_expiry.length === 1) {
            // This is where the user has typed 2 numbers so far
            // We can manually add a slash onto the end
            // We check to make sure the current value was only 1 character
            // long so that if they are backspacing, we don't add on the slash again
            text += '/'
        }

        // Update the state, which in turns updates the value in the text field
        this.setState({
            card_expiry: text
        });
    }
    _handlingCardNumber(number) {
        this.setState({
            card_number: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>CHECKOUT</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4, marginBottom: 4 }}>
                        <Text style={[styles.textGrandTotalCheckout, { color: Colors.blueType2 }]}>Total: {Utility.DOLLOR}{Utility.parseFloat(this.state.grand_total_price)}</Text>
                    </View>
                    <KeyboardAwareScrollView style={{ marginTop: 4 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ backgroundColor: 'transparent' }}>
                            <View style={styles.lableNTextfieldViewContainer}>
                                <Text style={styles.titleStyle}>Name</Text>
                                <TextField
                                    placeholderTextColor={Colors.grayTextColor}
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    maxLength={255}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(full_name) => this.setState({ full_name })}
                                    value={this.state.full_name}
                                />
                            </View>
                            <View style={styles.cardExpiryNCVVContainer}>
                                <View style={[styles.titleContainer, { marginRight: 10 }]}>
                                    <Text style={styles.titleStyle}>Email</Text>
                                    <TextField
                                        placeholderTextColor={Colors.grayTextColor}
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        maxLength={255}
                                        keyboardType={'email-address'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        editable={false}
                                        selectionColor={Colors.blueType1}
                                        // onChangeText={(email) => this.setState({ email })}
                                        value={this.state.email}
                                        autoCapitalize={'none'}
                                    />
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.titleStyle}>Phone number</Text>
                                    <TextField
                                        placeholderTextColor={Colors.grayTextColor}
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        maxLength={16}
                                        keyboardType={'phone-pad'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        selectionColor={Colors.blueType1}
                                        editable={false}
                                        // onChangeText={(phone) => this.setState({ phone })}
                                        value={this.state.phone}
                                        autoCapitalize={'none'}
                                    />
                                </View>
                            </View>
                            <View style={styles.lableNTextfieldViewContainer}>
                                <Text style={styles.titleStyle}>Address</Text>
                                <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    editable={true}
                                    onChangeText={(address) => this.setState({ address })}
                                    value={this.state.address}
                                />
                            </View>
                            <View style={styles.lableNTextfieldViewContainer}>
                                <Text style={styles.titleStyle}>Credit card number</Text>
                                <TextField
                                    placeholderTextColor={Colors.grayTextColor}
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    maxLength={19}
                                    keyboardType={'numeric'}
                                    autoCorrect={false}
                                    placeholder={"XXXX-XXXX-XXXX-XXXX"}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(card_number) => this._handlingCardNumber(card_number)}
                                    value={this.state.card_number.toString()}
                                />
                            </View>
                            {/* <View style={styles.lableNTextfieldViewContainer}>
                                <Text style={styles.titleStyle}>Card name</Text>
                                <TextField
                                    placeholderTextColor={Colors.grayTextColor}
                                    inputStyle={styles.inputText}
                                    autoCorrect={false}
                                    maxLength={50}
                                    autoCorrect={false}
                                    placeholder={"Name on Card"}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(card_name) => this.setState({ card_name })}
                                    value={this.state.card_name}
                                />
                            </View> */}
                            <View style={styles.cardExpiryNCVVContainer}>
                                <View style={[styles.titleContainer, { marginRight: 10 }]}>
                                    <Text style={styles.titleStyle}>Expire</Text>
                                    <TextField
                                        placeholderTextColor={Colors.grayTextColor}
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        placeholder={"MM/YY"}
                                        maxLength={5}
                                        keyboardType={'numeric'}
                                        selectionColor={Colors.blueType1}
                                        //onChangeText={(card_expiry) => this.setState({ card_expiry })}
                                        onChangeText={this._handlingCardExpiry.bind(this)}
                                        value={this.state.card_expiry.toString()}
                                    />
                                </View>
                                <View style={[styles.titleContainer]}>
                                    <Text style={styles.titleStyle}>CVV</Text>
                                    <TextField
                                        placeholderTextColor={Colors.grayTextColor}
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        //placeholder={"123"}
                                        maxLength={5}
                                        keyboardType={'numeric'}
                                        selectionColor={Colors.blueType1}
                                        onChangeText={(card_cvv) => this.setState({ card_cvv })}
                                        value={this.state.card_cvv.toString()}
                                    />
                                </View>
                            </View>
                            <INTButton buttonStyle={styles.btnChekout}
                                title="Pay Now"
                                titleStyle={styles.titleCheckout}
                                spaceBetweenIconAndTitle={0}
                                onPress={() => this.btnPlaceOrderTapped()} />
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }

}

export default CheckoutViewController