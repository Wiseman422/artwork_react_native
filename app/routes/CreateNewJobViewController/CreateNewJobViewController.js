import React, { Component } from 'react';
import { Keyboard, Image, FlatList, Text, View, Platform, TouchableOpacity, TextInput, Alert } from 'react-native';

import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import TextField from '../../component/TextField';
import SafeAreaView from '../../component/SafeAreaView';
import ProgressiveImage from '../../component/ProgressiveImage';
import INTButton from '../../component/INTButton';
import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalBox from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';

let selectionModalType = {
    // ProjectType: "project_type",
    PaymentRequired: "payment_required",
    ClientName: "clientname" //It is individual API.
}

class CreateNewJobViewController extends Component {
    constructor(props) {
        super(props)
        console.disableYellowBox = true;
        // Utility.navigator = this.props.navigator;

        this.state = {
            spinnerVisible: false,
            selectionModalVisible: false,
            modalType: undefined,

            strProjectName: '',
            strProjectDetails: '',
            strPrice: '',
            timeframe: '',
            project_type: '',
            dictClientInfo: this.props.dictClientInfo,
            // dictProjectType: {},
            selectedsegmentID: 1,
            dictPaymentRequired: {},

            arrClientName: [],
            arrPaymentTypeList: ["One Time", "Hourly", "Recurring", "In Person"],
            // arrProjectType: [],
            arrPaymentRequired: [],

            isRepeatable: 0,
            repeatableQuanltity: 1,

            dipatchOptionShipping: 0,
            shipping_cost: 0,

            dipatchOptionDelivery: 0,
            deliveryCost: 0,

            dipatchOptionPickup: 0,
        }
    }

    componentDidMount() {
        // this.getProjectType();
        this.getPaymentRequired();
    }

    // API  
    // getProjectType() {
    //     this.setState({ spinnerVisible: true })
    //     WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
    //         'type': selectionModalType.ProjectType,
    //     }, (response, error) => {
    //         this.setState({ spinnerVisible: false })
    //         if (error == null) {
    //             if (response.length > 0) {
    //                 this.setState({ arrProjectType: response })
    //             }
    //         } else {
    //             Utility.showToast(error.message);
    //         }
    //     });
    // }


    getPaymentRequired() {
        this.setState({ spinnerVisible: true })
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': selectionModalType.PaymentRequired,
        }, (response, error) => {
            this.setState({ spinnerVisible: false })
            if (error == null) {
                if (response.length > 0) {
                    this.setState({ arrPaymentRequired: response })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    // show Model   
    showModal() {
        var title = "";
        var selectionModelbox = null;
        var arrObjects = []
        // if (this.state.modalType === selectionModalType.ProjectType) {
        //     title = "Select Project Type"
        //     arrObjects = this.state.arrProjectType
        // } else
        if (this.state.modalType === selectionModalType.PaymentRequired) {
            title = "Select Payment Required"
            arrObjects = this.state.arrPaymentRequired
        }

        if (arrObjects.length > 0) {
            selectionModelbox = <ModalBox
                coverScreen={true}
                swipeToClose={false}
                backdropPressToClose={false}
                swipeToClose={false}
                backButtonClose={true}
                onClosed={() => this.setState({ selectionModalVisible: false })}
                style={styles.modalContainer}
                isOpen={this.state.selectionModalVisible}
                position='bottom'>
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.modalHeaderTextStyle]}>{title}</Text>
                        <TouchableOpacity onPress={this.selectionModalVisibleClose.bind(this)} activeOpacity={0.7}>
                            <Text style={styles.closeTextStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginTop: 5 }}
                        data={arrObjects}
                        keyExtractor={(item, index) => index + ''}
                        renderItem={({ item, index }) =>
                            this.state.modalType === selectionModalType.ClientName ?
                                <View style={{ marginHorizontal: 8 }}>
                                    <TouchableOpacity onPress={() => this.selectionModalDidTapped(item, index)} activeOpacity={0.7}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ProgressiveImage
                                                style={styles.profileImage}
                                                uri={item.profile_pic}
                                                placeholderSource={Images.input_userphoto}
                                                placeholderStyle={styles.artistPlaceHolderPhoto}
                                                borderRadius={1} />
                                            <Text style={[styles.modalTextStyle, { alignSelf: 'center' }]} >
                                                {item.full_name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={styles.viewBottom} />
                                </View> :
                                <TouchableOpacity onPress={() => this.selectionModalDidTapped(item, index)} activeOpacity={0.7}>
                                    <View style={{ marginHorizontal: 8, justifyContent: 'center' }}>
                                        <Text style={[styles.modalTextStyle, { paddingVertical: 12 }]} >
                                            {item.name}
                                        </Text>
                                        <View style={styles.viewBottom} />
                                    </View>
                                </TouchableOpacity>
                        }
                        numColumns={1}
                    />
                </View>
            </ModalBox >
        }
        return selectionModelbox;
    }

    backBtnTapped(isSuccess) {
        Utility.hideKeyboard();
        // var params = {
        //     'isSuccess': isSuccess,
        // }
        this.props.handleOnNavigateBack();
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    selectionModalVisibleClose() {
        Utility.hideKeyboard()
        this.setState({ selectionModalVisible: false, modalType: undefined });
    }

    selectionModalDidTapped(item, index) {
        var dictSelection = {}
        // if (this.state.modalType === selectionModalType.ProjectType) {
        //     dictSelection.name = item.name
        //     dictSelection.id = item.id
        //     this.setState({ dictProjectType: dictSelection, selectionModalVisible: false })
        // } else 
        if (this.state.modalType === selectionModalType.PaymentRequired) {
            dictSelection.name = item.name
            dictSelection.id = item.id
            this.setState({ dictPaymentRequired: dictSelection, selectionModalVisible: false })
        }
        Utility.hideKeyboard()
    }

    subscribeTapped() {
        Utility.push('SubscriptionViewController', {
            isFromNotSubscribe: true,
            onSubscriptionCallBack: this.onSubscriptionCallBack.bind(this)
        })
    }
    onSubscriptionCallBack(params) {
        if (params.isSuccess == true) {
            this.setState({})
        }
    }
    btnCreateJobTapped() {
        if (Utility.user.subscription_type == Utility.SUBSCRIPTION_TYPE.NOT_SUBSCRIBE) {
            Alert.alert(
                'Subscription Expired',
                Utility.MESSAGES.subscription_expired,
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Subscribe', onPress: () => { this.subscribeTapped() } },
                ],
                { cancelable: true }
            )
            // Utility.showToast(Utility.MESSAGES.subscription_expired)
            return;
        }
        if (this.isValidInput() == true) {
            var reqParam = {}
            reqParam.artist_id = Utility.user.user_id + ''
            reqParam.custom_job_user_id = this.state.dictClientInfo.id + ''
            reqParam.project_name = this.state.strProjectName
            reqParam.description = this.state.strProjectDetails
            reqParam.timeframe = this.state.timeframe + ''
            reqParam.project_type = this.state.project_type + ''
            reqParam.job_payment_type = this.state.selectedsegmentID + ''// online or offline
            reqParam.price = this.state.strPrice + ''
            reqParam.payment_required = this.state.dictPaymentRequired.id + ''
            reqParam.commission_request_id = this.props.commissionRequestId + ''
            reqParam.is_shipping = this.state.dipatchOptionShipping + ''
            reqParam.shipping_cost = this.state.shipping_cost + ''
            reqParam.is_delivery = this.state.dipatchOptionDelivery + ''
            reqParam.delivery_cost = this.state.deliveryCost + ''
            reqParam.is_pickup = this.state.dipatchOptionPickup + ''

            // console.log('reqParam for create Job', reqParam)

            this.setState({ spinnerVisible: true })
            WebClient.postRequest(Settings.URL.CREATE_CUSTOM_JOB, reqParam, (response, error) => {
                this.setState({ spinnerVisible: false })
                if (error == null) {
                    Utility.showToast(Utility.MESSAGES.custom_job_create_success);
                    //this.props.navigator.pop();
                    this.backBtnTapped(true)
                } else {
                    Utility.showToast(error.message);
                }
            });
        }
    }

    onUniqueRepeatableTapped(status) {
        this.setState({ isRepeatable: status });
    }

    onShippingTapped() {
        this.setState({ dipatchOptionShipping: (this.state.dipatchOptionShipping == 0 ? 1 : 0) })
    }

    onDeliveryTapped() {
        this.setState({ dipatchOptionDelivery: (this.state.dipatchOptionDelivery == 0 ? 1 : 0) })
    }

    onPickupTapped() {
        this.setState({ dipatchOptionPickup: (this.state.dipatchOptionPickup == 0 ? 1 : 0) })
    }

    isValidInput() {
        var flag = true
        if (this.state.dictClientInfo.name == undefined) {
            Utility.showToast(Utility.MESSAGES.please_select_client_name);
            flag = false
        }
        else if (this.state.strProjectName.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_project_name);
            flag = false
        }
        else if (this.state.strProjectDetails.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_project_details);
            flag = false
        }
        else if (this.state.timeframe == undefined) {
            Utility.showToast(Utility.MESSAGES.please_enter_time_frame);
            flag = false
        }
        else if (this.state.project_type == '') {
            Utility.showToast(Utility.MESSAGES.please_select_project_type);
            flag = false
        }
        else if (this.state.price == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_price);
            flag = false
        }
        else if (this.state.selectedsegmentID == 1 && this.state.dictPaymentRequired.name == undefined) {
            Utility.showToast(Utility.MESSAGES.please_select_payment_required);
            flag = false
        }
        return flag
    }

    render() {
        return (
            <SafeAreaView style={styles.container} >
                {/* TopbarView Component */}
                <View style={styles.topViewStyle}>
                    <TouchableOpacity onPress={this.backBtnTapped.bind(this, false)} activeOpacity={0.7}>
                        <View style={styles.titleView}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>CREATE NEW JOB</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ScrollViewWithForm component */}
                <KeyboardAwareScrollView style={{ marginTop: 15 }}
                    extraScrollHeight={100}
                    onScroll={this.handleScroll}
                    keyboardShouldPersistTaps={"always"}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.innerViewContainer1}>
                        <View style={styles.clientNameContainer}>
                            <TouchableOpacity onPress={() => { this.setState({ modalType: selectionModalType.ClientName, selectionModalVisible: true }) }}
                                activeOpacity={0.7}>
                                <Text style={styles.textStyle}>Client Name</Text>
                                <View style={styles.viewTextType}>
                                    <Text style={styles.textType} numberOfLines={1}>{this.state.dictClientInfo ? this.state.dictClientInfo.name : ''}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.projectNameContainer}>
                            <Text style={styles.textStyle}>Project Name</Text>
                            <TextField
                                inputStyle={styles.inputText}
                                placeholderTextColor={Colors.grayTextColor}
                                borderColor={'transparent'}
                                autoCorrect={false}
                                selectionColor={Colors.blueType1}
                                onChangeText={(strProjectName) => this.setState({ strProjectName })}
                                value={this.state.strProjectName}
                            />
                        </View>
                    </View>
                    {/* Project Details */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.textStyle}>Project Details</Text>
                        <TextInput
                            style={Utility.isPlatformAndroid ? styles.detailsTextInputAndroid : styles.detailsTextInput}
                            multiline={true}
                            onChangeText={(strProjectDetails) => this.setState({ strProjectDetails })}
                            value={this.state.strProjectDetails}
                            placeholder={""}
                            selectionColor={Colors.blueType1}
                        />
                    </View>
                    {/* Time frame and Project Type */}
                    <View style={styles.innerViewContainer2}>
                        <View style={styles.TypeFrameContainer}>
                            <Text style={styles.textStyle}>Time Frame</Text>
                            <TextField
                                inputStyle={styles.inputText}
                                wrapperStyle={styles.inputWrapper}
                                placeholderTextColor={Colors.grayTextColor}
                                borderColor={'transparent'}
                                autoCorrect={false}
                                placeholder={""}
                                selectionColor={Colors.blueType1}
                                onChangeText={(timeframe) => this.setState({ timeframe })}
                                value={this.state.timeframe}
                            />
                        </View>
                        <View style={styles.projectTypeContainer}>
                            {/* <TouchableOpacity onPress={() => { this.setState({ modalType: selectionModalType.ProjectType, selectionModalVisible: true }) }} activeOpacity={0.7}> */}
                            <Text style={styles.textStyle} >Project Type</Text>
                            <TextField
                                inputStyle={styles.inputText}
                                wrapperStyle={styles.inputWrapper}
                                placeholderTextColor={Colors.grayTextColor}
                                borderColor={'transparent'}
                                autoCorrect={false}
                                placeholder={""}
                                selectionColor={Colors.blueType1}
                                onChangeText={(project_type) => this.setState({ project_type })}
                                value={this.state.project_type}
                            />
                            {/* <View style={styles.viewTextType}>
                                    <Text style={styles.textType} numberOfLines={1}>{this.state.dictProjectType.name}</Text>
                                </View> */}
                            {/* </TouchableOpacity> */}
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
                            onSelectionDidChange={(selectedIndex) => {
                                this.setState({ selectedsegmentID: (selectedIndex + 1) })
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
                                selectionColor={Colors.blueType1}
                                onChangeText={(strPrice) => this.setState({ strPrice })}
                                value={this.state.strPrice + ''}
                            />
                        </View>
                        {this.state.selectedsegmentID == 1 ?
                            <View style={styles.projectTypeContainer}>
                                <TouchableOpacity onPress={() => { this.setState({ modalType: selectionModalType.PaymentRequired, selectionModalVisible: true }) }} activeOpacity={0.7}>
                                    <Text style={styles.textStyle}>Payment Required</Text>
                                    <View style={styles.viewTextType}>
                                        <Text style={styles.textType} numberOfLines={1}>{this.state.dictPaymentRequired.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> : null
                        }
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10 }} >
                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                            title="Shipping"
                            titleStyle={styles.btnTitleOptions}
                            icon={(this.state.dipatchOptionShipping == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onShippingTapped()} />
                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                            title="Delivery"
                            titleStyle={styles.btnTitleOptions}
                            icon={(this.state.dipatchOptionDelivery == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onDeliveryTapped()} />
                        <INTButton buttonStyle={styles.btnDeliveryPickup}
                            title="Pickup"
                            titleStyle={styles.btnTitleOptions}
                            icon={(this.state.dipatchOptionPickup == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onPickupTapped()} />
                    </View>
                    {(this.state.dipatchOptionShipping == 0 && this.state.dipatchOptionDelivery == 0) ?
                        null : <View style={[styles.shippingCostDeliveryCostContainer, { justifyContent: 'flex-start' }]}>
                            {this.state.dipatchOptionShipping == 1 ?
                                <View style={{ marginRight: 20, minWidth: 100 }}>
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
                                        onChangeText={(shipping_cost) => this.setState({ shipping_cost })}
                                        value={this.state.shipping_cost.toString()}
                                    />
                                </View> : null}
                            {this.state.dipatchOptionDelivery == 1 ?
                                <View style={{ minWidth: 100 }}>
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
                                        onChangeText={(deliveryCost) => this.setState({ deliveryCost })}
                                        value={this.state.deliveryCost.toString()}
                                    />
                                </View> : null}
                        </View>}
                    <View style={styles.sendButtonView}>
                        <TouchableOpacity onPress={() => this.btnCreateJobTapped()}>
                            <Text style={{ color: 'white', fontFamily: Fonts.promptRegular }}>Send Job</Text>
                        </TouchableOpacity>
                    </View>

                </KeyboardAwareScrollView>
                {this.showModal()}
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}
export default CreateNewJobViewController