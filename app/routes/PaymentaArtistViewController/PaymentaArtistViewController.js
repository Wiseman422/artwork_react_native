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
import { CachedImage } from 'react-native-cached-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';

let PENDING = 0;
let COMPLETE = 1;

class PaymentaArtistViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentState: COMPLETE,
            spinnerVisible: false,
            arrCompletedPamentList: [],
            arrPendingPamentList: [],
            page: 1,
            totalRecords: 0,
            total_transfered_amount: 0,
            total_payment_amount: 0,
            order_ids: "",
            isDataReceived: false,
        };
    }
    componentDidMount() {
        setTimeout(() => {
            this.getPaymentList();
        }, 100);
    }

    /////////////////////////////////////////   COMPLETE PAYMENT LIST START  ///////////////////////////////////////////////

    leftBtnTaaped() {
        this.props.navigator.pop();
    }
    checkCurrentState(state) {
        return (this.state.currentState == state)
    }
    btnCompleteClick() {
        this.setState({ isDataReceived: false, currentState: COMPLETE, page: 1, totalRecords: 0 });
        setTimeout(() => {
            this.getPaymentList();
        }, 100);
    }
    btnPendingClick() {
        this.setState({ isDataReceived: false, currentState: PENDING, page: 1, totalRecords: 0 });
        setTimeout(() => {
            this.getPaymentList();
        }, 100);
    }
    //API
    getPaymentList() {

        this.setState({ spinnerVisible: true, total_payment_amount: 0, });
        WebClient.postRequest(Settings.URL.GET_PAYMENT_LIST, {
            'user_id': Utility.user.user_id + '',
            'is_payment_complete': this.state.currentState + '',//0 = pending payment, 1 = completed payment
            'page': this.state.page + ''
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    if (this.state.currentState == PENDING) {
                        this.setState({
                            isDataReceived: true,
                            arrPendingPamentList: this.state.page > 1 ? [...this.state.arrPendingPamentList, ...response.result] : response.result,
                            total_payment_amount: response.total_payment_amount,
                            order_ids: response.order_ids
                        })
                    } else {
                        this.setState({
                            isDataReceived: true,
                            arrCompletedPamentList: this.state.page > 1 ? [...this.state.arrCompletedPamentList, ...response.result] : response.result,
                            total_transfered_amount: response.total_payment_amount,
                            order_ids: response.order_ids
                        })
                    }
                }
            } else {
                if (this.state.currentState == PENDING) {
                    this.setState({
                        isDataReceived: true,
                        arrPendingPamentList: [],
                        total_payment_amount: 0,
                        order_ids: ""
                    })
                } else {
                    this.setState({
                        isDataReceived: true,
                        arrCompletedPamentList: [],
                        total_transfered_amount: 0,
                        order_ids: ""
                    })
                }
                Utility.showToast(error.message); // tell backend developer to remove no data found error.
            }
        }, true);
    }

    endOfPaymentListFlatList() {
        if ((this.state.currentState == PENDING ? this.state.arrPendingPamentList.length : this.state.arrCompletedPamentList.length) < this.state.totalRecords) {
            this.setState({
                spinnerVisible: true,
                page: this.state.page + 1
            }, this.getPaymentList.bind(this))
        }
    }

    renderCompletePaymentViewCell(rowData) {
        var order = rowData.item
        return (
            <TouchableOpacity onPress={() => this.goOrderDetailScreen(order)} activeOpacity={1}>
                <View style={styles.orderItemStyle} >
                    {/* <ProgressiveImage
                        style={styles.artImageStyle}
                        uri={order.order_items.length > 0 ? order.order_items[0].artwork_photos.length > 0 ? order.order_items[0].artwork_photos[0].thumb_name : undefined : undefined}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.artImageStyle}
                        source={{
                            uri: order.order_items.length > 0 ? order.order_items[0].artwork_photos.length > 0 ? order.order_items[0].artwork_photos[0].thumb_name : undefined : undefined
                        }}
                        fallbackSource={Images.placeholderMediaImage}
                    />
                    <View style={styles.viewOrderNumberNShippingStatus}>
                        <Text style={styles.textOrderNumber} numberOfLines={1}>
                            Order #{order.order_id}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.textShippingStatus} numberOfLines={1}>
                                {order.order_status}
                            </Text>
                            <Text style={styles.textOrderDate} numberOfLines={1}>
                                {Utility.getDateMMMdd(order.order_date)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.viewPriceOrder}>
                        <Text style={styles.textPriceOrder} numberOfLines={1}>
                            {Utility.DOLLOR}{Utility.parseFloat(order.total_amount)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    /////////////////////////////////////////   COMPLETE PAYMENT LIST END  ///////////////////////////////////////////////

    /////////////////////////////////////////   PENDING PAYMENT LIST START  ///////////////////////////////////////////////
    // //API
    // getPaymentList() {
    //     this.setState({ spinnerVisible: true });
    //     WebClient.postRequest(Settings.URL.GET_PAYMENT_LIST, {
    //         'user_id': Utility.user.user_id,
    //         'is_payment_complete': this.state.currentState,//0 = pending payment, 1 = completed payment
    //     }, (response, error) => {
    //         this.setState({ spinnerVisible: false });
    //         if (error == null) {
    //             if (response) {
    //                 this.setState({ arrPendingPamentList: response });
    //             }
    //         } else {
    //             Utility.showToast(error.message);
    //         }
    //     });
    // }

    renderPendingPaymentViewCell(rowData) {
        var order = rowData.item
        return (
            <TouchableOpacity onPress={() => this.goOrderDetailScreen(order)} activeOpacity={1}>
                <View style={styles.orderItemStyle} >
                    {/* <ProgressiveImage
                        style={styles.artImageStyle}
                        uri={order.order_items.length > 0 ? order.order_items[0].artwork_photos.length > 0 ? order.order_items[0].artwork_photos[0].thumb_name : undefined : undefined}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.artImageStyle}
                        source={{
                            uri: order.order_items.length > 0 ? order.order_items[0].artwork_photos.length > 0 ? order.order_items[0].artwork_photos[0].thumb_name : undefined : undefined
                        }}
                        fallbackSource={Images.placeholderMediaImage}
                    />
                    <View style={styles.viewOrderNumberNShippingStatus}>
                        <Text style={styles.textOrderNumber} numberOfLines={1}>
                            Order #{order.order_id}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.textShippingStatus} numberOfLines={1}>
                                {order.order_status}
                            </Text>
                            <Text style={styles.textOrderDate} numberOfLines={1}>
                                {Utility.getDateMMMdd(order.order_date)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.viewPriceOrder}>
                        <Text style={styles.textPriceOrder} numberOfLines={1}>
                            {Utility.DOLLOR}{Utility.parseFloat(order.total_amount)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    goOrderDetailScreen(order) {
        Utility.push('OrderDetailViewController', { orders: { ...order } })
    }
    /////////////////////////////////////////   PENDING PAYMENT LIST  END ///////////////////////////////////////////////
    //Get Bank Info
    getBanInfo() {
        // this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
        }
        // console.log("GET_BANK_INFO", JSON.stringify(paramRequest))
        WebClient.postRequest(Settings.URL.GET_BANK_INFO, paramRequest, (response, error) => {
            // this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.hasOwnProperty('account_number')) {
                    this.btnTransferToBankTapped(true, response.account_number);
                } else {
                    this.btnTransferToBankTapped(false, "");
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    //Place Order tapped
    btnTransferToBankTapped(isEditBankInfo, accNumber) {
        Utility.hideKeyboard();
        Alert.alert(
            'Transfer',
            'Are you sure you want to transfer amount to your bank account' + (accNumber.length > 0 ? (" xxxxxxxx" + accNumber) : "") + '?',
            isEditBankInfo ?
                [
                    { text: 'Edit Bank Info', onPress: () => this.addBankInfo() },
                    { text: 'Cancel', onPress: () => console.log("Cancel"), style: 'cancel' },
                    { text: 'Yes', onPress: () => this.transferToBank() },
                ] :
                [
                    { text: 'Cancel', onPress: () => console.log("Cancel"), style: 'cancel' },
                    { text: 'Add Bank Info', onPress: () => this.addBankInfo() },
                ],
            { cancelable: true }
        )
    }
    addBankInfo() {
        Utility.push('BankInfoViewController', { isTransferCall: true, amount: this.state.total_payment_amount, order_ids: this.state.order_ids })
    }
    //Transfer To bank
    transferToBank() {
        Utility.hideKeyboard();
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
            'amount': this.state.total_payment_amount + '',
            'order_ids': this.state.order_ids + '',
        }
        // console.log("TRANSFER_MONEY", JSON.stringify(paramRequest))
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
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>PAYMENTS</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Header View*/}
                    <View style={styles.viewHeader}>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnCompleteClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(COMPLETE) ? styles.textSelected : styles.textUnSelected} >Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnPendingClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(PENDING) ? styles.textSelected : styles.textUnSelected} >Pending</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewLine}>
                    </View>
                    {/*Card And Order Listing*/}
                    {
                        this.state.isDataReceived ?
                            < KeyboardAwareScrollView
                                style={{ marginTop: 2 }}
                                extraScrollHeight={100}
                                onScroll={this.handleScroll}
                                keyboardShouldPersistTaps={"always"}
                                automaticallyAdjustContentInsets={true}
                                bounces={true}
                                showsVerticalScrollIndicator={false}>
                                {
                                    this.checkCurrentState(COMPLETE) ?
                                        this.state.arrCompletedPamentList.length > 0 ? // check if records available otherwise show no records label
                                            <FlatList // Artwork OR Artist FlatList
                                                style={styles.listViewCellStyle}
                                                data={
                                                    this.state.arrCompletedPamentList
                                                }
                                                renderItem={
                                                    this.renderCompletePaymentViewCell.bind(this)
                                                }
                                                numColumns={1}
                                                extraData={this.state}
                                                keyExtractor={(item, index) => index + ''}
                                            />
                                            :
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : this.state.arrPendingPamentList.length > 0 ?
                                            <FlatList
                                                onEndReachedThreshold={0.5}
                                                onEndReached={() => this.endOfPaymentListFlatList()}
                                                style={styles.listViewCellStyle}
                                                data={this.state.arrPendingPamentList}
                                                renderItem={this.renderPendingPaymentViewCell.bind(this)}
                                                numColumns={1}
                                                extraData={this.state}
                                                keyExtractor={(item, index) => index + ''}
                                            />
                                            :
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                }
                            </KeyboardAwareScrollView>
                            : null
                    }
                    {
                        this.state.isDataReceived ?
                            this.state.currentState == PENDING ?
                                <View style={{ alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, flexDirection: 'row' }}>
                                    <Text style={{ flex: 1, textAlign: 'center', color: Colors.blueType5, marginBottom: 5, fontSize: Utility.NormalizeFontSize(13) }}>Amount: {Utility.DOLLOR}{Utility.parseFloat(this.state.total_payment_amount)}</Text>
                                    {
                                        Number(this.state.total_payment_amount) > 0 ?
                                            <INTButton buttonStyle={styles.btnTransferToBank}
                                                title="Transfer To Bank"
                                                titleStyle={styles.titleTransferToBank}
                                                spaceBetweenIconAndTitle={0}
                                                onPress={() => this.getBanInfo()} />
                                            : null
                                    }
                                </View>
                                : <View style={{ alignItems: 'center', paddingVertical: 15, marginHorizontal: 10, }}>
                                    <Text style={{ textAlign: 'center', color: Colors.blueType5, marginBottom: 5, fontSize: Utility.NormalizeFontSize(13) }}>Transfered Amount: {Utility.DOLLOR}{Utility.parseFloat(this.state.total_transfered_amount)}</Text>
                                </View>
                            : null
                    }

                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View >
        );
    }
}

export default PaymentaArtistViewController