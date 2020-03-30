import React, { Component } from 'react';
import { Keyboard, Image, FlatList, Text, View, Platform, TouchableOpacity, TextInput } from 'react-native';

import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import TextField from '../../component/TextField';
import SafeAreaView from '../../component/SafeAreaView';
import INTButton from '../../component/INTButton';
import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';

class JobDetailViewController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            arrPaymentTypeList: ["One Time", "Hourly", "Recurring", "In Person"],
            commission_request_id: this.props.commission_request_id ? this.props.commission_request_id : 4,
            cart: this.props.cart ? this.props.cart : undefined,
            dictClientInfo: undefined,
            isDataReceived: false,
        }
    }

    componentDidMount() {
        this.getJobDetail();
    }

    // API  
    getJobDetail() {
        this.setState({ spinnerVisible: true })
        var params = {
            commission_request_id: this.state.commission_request_id,
            user_id: Utility.user.user_id
        }
        WebClient.postRequest(Settings.URL.GET_JOB_DETAIL, params, (response, error) => {
            this.setState({ spinnerVisible: false })
            if (error == null) {
                this.setState({
                    dictClientInfo: response,
                    isDataReceived: true,
                });
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    backBtnTapped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    btnCancelJobTapped() {
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.user.user_id + '',
            'cart_id': this.state.cart.cart_id + '',// pass cart id
            'is_custom_job': this.state.cart.is_custom_job + ''
        };
        console.log('params', params);
        WebClient.postRequest(Settings.URL.REMOVE_FROM_CART, params, (response, error) => {
            console.log('response', response)
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var arrTemp = [...this.state.arrCartList];
                if (arrTemp.length > position)
                    arrTemp.splice(position, 1);
                this.setState({ arrCartList: arrTemp }, () => this.setTotalPrice(this.state.arrCartList));
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                {/* TopbarView Component */}
                <View style={styles.topViewStyle}>
                    <TouchableOpacity onPress={this.backBtnTapped.bind(this)} activeOpacity={0.7}>
                        <View style={styles.titleView}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>JOB DETAILS</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ScrollViewWithForm component */}
                {
                    this.state.isDataReceived ?

                        <KeyboardAwareScrollView style={{ marginTop: 15 }}
                            // extraScrollHeight={100}
                            onScroll={this.handleScroll}
                            keyboardShouldPersistTaps={"always"}
                            automaticallyAdjustContentInsets={true}
                            bounces={true}
                            showsVerticalScrollIndicator={false}>
                            <View style={styles.innerViewContainer1}>
                                <View style={styles.clientNameContainer}>
                                    <Text style={styles.textStyle}>Client Name</Text>
                                    <View style={styles.viewTextType}>
                                        <Text style={styles.textType} numberOfLines={1}>{this.state.dictClientInfo ? this.state.dictClientInfo.full_name : ""}</Text>
                                    </View>
                                </View>
                                <View style={styles.projectNameContainer}>
                                    <Text style={styles.textStyle}>Project Name</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        autoCorrect={false}
                                        selectionColor={Colors.blueType1}
                                        editable={false}
                                        // onChangeText={(strProjectName) => this.setState({ strProjectName })}
                                        value={this.state.dictClientInfo ? this.state.dictClientInfo.title : ""}
                                    />
                                </View>
                            </View>
                            {/* Project Details */}
                            <View style={styles.detailsContainer}>
                                <Text style={styles.textStyle}>Project Details</Text>
                                <TextInput
                                    style={Utility.isPlatformAndroid ? styles.detailsTextInputAndroid : styles.detailsTextInput}
                                    multiline={true}
                                    editable={false}
                                    // onChangeText={(strProjectDetails) => this.setState({ strProjectDetails })}
                                    value={this.state.dictClientInfo ? this.state.dictClientInfo.description : ''}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                />
                            </View>
                            {/* Time frame and Project Type */}
                            <View style={styles.innerViewContainer2}>
                                <View style={styles.TypeFrameContainer}>
                                    <Text style={styles.textStyle} numberOfLines={1}>Time Frame</Text>
                                    <View style={styles.viewTextType}>
                                        <Text style={styles.textType} numberOfLines={1}>{this.state.dictClientInfo ? this.state.dictClientInfo.timeframe + '' : ''}</Text>
                                    </View>
                                </View>
                                <View style={styles.projectTypeContainer}>
                                    <Text style={styles.textStyle} numberOfLines={1}>Project Type</Text>
                                    <View style={styles.viewTextType}>
                                        <Text style={styles.textType} numberOfLines={1}>{this.state.dictClientInfo ? this.state.dictClientInfo.project_type : ''}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* Payment Details */}
                            <View style={styles.PaymentDetailsContainer}>
                                <Text style={styles.textStyle}>Payment Details</Text>
                                <INTSegmentControl // Payment type horizontal Segment Component
                                    controllStyle={styles.segmentControllerStyle}
                                    arrSegment={this.state.arrPaymentTypeList}
                                    segmentWidthStyle='dynamic'
                                    titleStyle={styles.segmentTitle}
                                    titleStyleSelected={styles.segmentSelectedTitle}
                                    selectedSegmentStyle={{ borderColor: Colors.blueType1, borderWidth: 1, backgroundColor: Colors.grayType1 }}
                                    selectionStyle='box'
                                    isClickable={false}
                                    selectedIndex={this.state.dictClientInfo ? Number(this.state.dictClientInfo.job_payment_type) : 0}
                                    onSelectionDidChange={(selectedIndex) => {
                                        // this.setState({ selectedsegmentID: (selectedIndex + 1) })
                                    }}
                                />
                            </View>
                            {/* Price and Payment Required */}
                            <View style={styles.innerViewContainer2}>
                                <View style={styles.TypeFrameContainer}>
                                    <Text style={styles.textStyle}>Price</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        wrapperStyle={styles.inputWrapper}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        editable={false}
                                        selectionColor={Colors.blueType1}
                                        // onChangeText={(strPrice) => this.setState({ strPrice })}
                                        value={this.state.dictClientInfo ? this.state.dictClientInfo.price + '' : ''}
                                    />
                                </View>
                                {this.state.dictClientInfo && this.state.dictClientInfo.job_payment_type == 0 ?
                                    <View style={styles.projectTypeContainer}>
                                        <Text style={styles.textStyle}>Payment Required</Text>
                                        <View style={styles.viewTextType}>
                                            <Text style={styles.textType} numberOfLines={1}>{this.state.dictClientInfo ? this.state.dictClientInfo.payment_required_name : ''}</Text>
                                        </View>
                                    </View> : null
                                }
                            </View>
                            <View style={{ flexDirection: 'row', marginVertical: 10 }} >
                                {
                                    (this.state.dictClientInfo && this.state.dictClientInfo.is_shipping == 1) ?
                                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                                            title="Shipping"
                                            titleStyle={styles.btnTitleOptions}
                                            icon={Images.selected}
                                            spaceBetweenIconAndTitle={0} />
                                        : null
                                }
                                {
                                    (this.state.dictClientInfo && this.state.dictClientInfo.is_delivery == 1) ?
                                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                                            title="Delivery"
                                            titleStyle={styles.btnTitleOptions}
                                            icon={Images.selected}
                                            spaceBetweenIconAndTitle={0} />
                                        : null
                                }
                                {
                                    (this.state.dictClientInfo && this.state.dictClientInfo.is_pickup == 1) ?
                                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                                            title="Pickup"
                                            titleStyle={styles.btnTitleOptions}
                                            icon={Images.selected}
                                            spaceBetweenIconAndTitle={0} />
                                        : null
                                }
                            </View>
                            {(this.state.dipatchOptionShipping == 0 && this.state.dipatchOptionDelivery == 0) ?
                                null : <View style={[styles.shippingCostDeliveryCostContainer, { justifyContent: 'flex-start' }]}>
                                    {this.state.dictClientInfo && this.state.dictClientInfo.is_shipping == 1 ?
                                        <View style={{ marginRight: 20, flex: 1 }}>
                                            <Text style={styles.textStyle}>Shipping Cost({Utility.DOLLOR})</Text>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                keyboardType={'numeric'}
                                                maxLength={8}
                                                ref={"shipping_cost"}
                                                returnKeyType="done"
                                                // onChangeText={(shipping_cost) => this.setState({ shipping_cost })}
                                                value={this.state.dictClientInfo ? this.state.dictClientInfo.shipping_cost.toString() : ''}
                                            />
                                        </View> : null}
                                    {this.state.dictClientInfo && this.state.dictClientInfo.is_delivery == 1 ?
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.textStyle}>Delivery Cost({Utility.DOLLOR})</Text>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                keyboardType={'numeric'}
                                                maxLength={8}
                                                ref={"deliveryCost"}
                                                onSubmitEditing={(event) => {
                                                    this.refs.deliveryCost.focus();
                                                }}
                                                returnKeyType="next"
                                                // onChangeText={(deliveryCost) => this.setState({ deliveryCost })}
                                                value={this.state.dictClientInfo ? this.state.dictClientInfo.delivery_cost.toString() : ''}
                                            />
                                        </View> : null}
                                </View>}
                            {
                                this.state.cart ?
                                    <View style={styles.sendButtonView}>
                                        <TouchableOpacity onPress={() => this.btnCancelJobTapped()}>
                                            <Text style={{ color: 'white', fontFamily: Fonts.promptRegular }}>Cancel Job</Text>
                                        </TouchableOpacity>
                                    </View>
                                    : null
                            }

                        </KeyboardAwareScrollView>
                        : null
                }
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}
export default JobDetailViewController