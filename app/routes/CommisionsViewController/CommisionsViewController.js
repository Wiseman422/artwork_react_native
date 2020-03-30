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
import ProgressiveImage from '../../component/ProgressiveImage';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

let REQUESTED = 0;
let ONGOING = 1;
let COMPLETE = 2;

class CommisionsViewController extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            currentState: REQUESTED,
            spinnerVisible: false,

            arrNewRequestCommissions: [],
            newRequestTotalRecords: 0,
            newRequestCommisionPage: 1,

            arrOngoingCommissions: [],

            arrCompleteCommissions: [],
            completedCommisionPage: 1,
            completedCommisionTotalRecords: 0,
            isDataReceived: false,
        };
    }

    componentDidMount() {
        this.btnRequestedJobTapped()
    }

    backBtnTapped() {
        this.props.navigator.pop();
    }
    checkCurrentState(state) {
        return (this.state.currentState == state)
    }
    btnRequestedJobTapped() {
        this.setState({ isDataReceived: false, currentState: REQUESTED });
        this.getNewRequestJobList();
    }
    btnOngoingJobTapped() {
        this.setState({ isDataReceived: false, currentState: ONGOING });
        this.getOnGoingJobList();
    }
    btnCompleteJobTapped() {
        this.setState({ isDataReceived: false, currentState: COMPLETE });
        this.getCompletedJobList();
    }
    /////////////////////////////////////////   NEW REQUEST LIST START  ///////////////////////////////////////////////
    getNewRequestJobList() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_NEW_REQUEST_LIST, {
            'user_id': Utility.user.user_id + '',
            'page': this.state.newRequestCommisionPage + ''
        }, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                this.setState({ arrNewRequestCommissions: this.state.newRequestCommisionPage > 1 ? [...this.state.arrNewRequestCommissions, ...response.result] : response.result, newRequestTotalRecords: response.totalcount })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfNewRequestJobListFlatList() {
        if (this.state.arrNewRequestCommissions.length < this.state.newRequestTotalRecords) {
            this.setState({
                spinnerVisible: true,
                newRequestCommisionPage: this.state.newRequestCommisionPage + 1
            }, this.getNewRequestJobList.bind(this))
        }
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
    onNewJobTapped(requestedJobItem) {
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
        var dictClientInfo = { id: requestedJobItem.user_id, name: requestedJobItem.sender_name }
        Utility.push('CreateNewJobViewController', {
            handleOnNavigateBack: this.handleOnNavigateBack.bind(this),
            commissionRequestId: requestedJobItem.commission_request_id,
            dictClientInfo: dictClientInfo
        });
    }

    handleOnNavigateBack = () => {
        this.btnRequestedJobTapped();
    }

    onChatTapped(requestedJobItem) {
        Utility.push('MessageInsideViewController', {
            isFromCommissionScreen: true,
            receiverId: requestedJobItem.user_id,
            receiverName: requestedJobItem.sender_name,
            isCustomJobChat: 1,
            orderItemId: requestedJobItem.order_item_id, //0
            commissionRequestId: requestedJobItem.commission_request_id //id
        })
    }
    onArtistProfileClick(requestedJobItem) {
        if (requestedJobItem.user_type == Utility.USER_TYPE.ARTIST) {
            Utility.push('ArtistDetailViewController', { artist_id: requestedJobItem.user_id });
        }
    }
    renderNewRequestJobViewCell(rowData, secId, rowId, rowMap) {
        var requestedJobItem = rowData
        var index = rowId;
        return (
            <View style={styles.jobItemStyle}>
                <TouchableOpacity onPress={() => this.onArtistProfileClick(requestedJobItem)} activeOpacity={0.9}>
                    <ProgressiveImage
                        style={styles.artistImageStyle}
                        uri={requestedJobItem.profile_pic_thumb}
                        placeholderSource={Images.input_userphoto}
                        placeholderStyle={styles.artistPlaceHolderPhoto}
                        borderRadius={1} />
                </TouchableOpacity>
                <View style={{ flex: 1, marginRight: 20 }}>
                    <View style={styles.userInformationStyle}>
                        <Text numberOfLines={1} style={styles.userNameTextStyle}>{requestedJobItem.sender_name}</Text>
                        <View style={styles.roundViewAndTimeStyle}>
                            {requestedJobItem.isCompleted === 1 ? <View style={styles.roundViewStyle}></View> : null}
                            <Text style={styles.timeTextStyle}>{Utility.isToday() ? Utility.getDatehhmma(requestedJobItem.request_date) : Utility.getDateMMMdd(requestedJobItem.request_date)}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.messageTextStyle}>{requestedJobItem.description}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <INTButton buttonStyle={styles.btnChat}
                            icon={Images.chat}
                            title="Chat"
                            titleStyle={styles.titleChat}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => this.onChatTapped(requestedJobItem)} />
                        <INTButton buttonStyle={requestedJobItem.isCompleted == 1 ? styles.btnDisable : styles.btnChat}
                            icon={Images.newjob}
                            title="New Job"
                            titleStyle={styles.titleChat}
                            spaceBetweenIconAndTitle={0}
                            isDisable={requestedJobItem.isCompleted == 1 ? true : false}
                            onPress={() => this.onNewJobTapped(requestedJobItem)} />
                    </View>
                </View>
            </View>
        );
    }

    /////////////////////////////////////////   ONGOING LIST START  ///////////////////////////////////////////////

    //API
    getOnGoingJobList() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_ONGOING_JOB_LIST, {
            'user_id': Utility.user.user_id + '',
        }, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({
                        arrOngoingCommissions: response,
                    });
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    removeFromOnGoingList(jobItem, index) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.REMOVE_FROM_ONGOING_LIST, {
            'user_id': Utility.user.user_id + '',
            'cart_id': jobItem.cart_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var arrTemp = [...this.state.arrOngoingCommissions];
                arrTemp.splice(index, 1);
                this.setState({ arrOngoingCommissions: arrTemp });
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow(jobItem, secId, rowId, rowMap) {
        this.removeFromOnGoingList(jobItem, rowId)
        this.closeRow(rowMap, rowId);
    }

    onRowDidOpen = (rowKey, rowMap) => {
        setTimeout(() => {
            this.closeRow(rowMap, rowKey);
        }, 2000);
    }

    renderOngoingJobViewCell(rowData, secId, rowId, rowMap) {
        var jobItem = rowData
        var index = rowId;
        return (
            <SwipeRow
                // disableRightSwipe={false}
                disableRightSwipe={jobItem.is_user_job_delete_to_cart == 1 ? false : (jobItem.order_status_id == Utility.OrderStatus.NONE) ? true : false}
                disableLeftSwipe={(jobItem.order_status_id == Utility.OrderStatus.NONE) ? true : false}
                leftOpenValue={75}
                rightOpenValue={-75}>
                <View style={styles.rowBack}>
                    <TouchableOpacity style={styles.backLeftBtn} onPress={_ => this.changeOrderStatusConfirmation(jobItem, rowMap, `${secId}${rowId}`)}>
                        <Text style={[styles.backLeftBtn, { color: Colors.blueType1, }]}>{jobItem.is_user_job_delete_to_cart == 1 ? 'Delete' : jobItem.next_order_status}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(jobItem, secId, rowId, rowMap)}>
                        <Text style={styles.backTextWhite}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.onJobPress.bind(this, jobItem)} activeOpacity={0.7}>
                    <View style={styles.onGoingJobContainerStyle} >
                        <View style={styles.onGoingJobItemStyle} >
                            <View style={styles.viewJobTitleNCustomeName}>
                                <Text style={styles.textArtworkJobName} numberOfLines={1}>
                                    {jobItem.title}
                                </Text>
                                <Text style={styles.textCustomerName} numberOfLines={1}>
                                    {"for " + jobItem.customer_name}
                                </Text>
                                {jobItem.is_user_job_delete_to_cart == 1 ?
                                    null
                                    : <View style={{ flexDirection: 'row' }}>
                                        <INTButton buttonStyle={styles.btnChat}
                                            icon={Images.chat}
                                            title="Chat"
                                            titleStyle={styles.titleChat}
                                            spaceBetweenIconAndTitle={0}
                                            onPress={() => this.onChatTapped(jobItem)} />
                                    </View>}
                            </View>
                            <View style={styles.viewJobDate}>
                                <Text style={styles.textJobDate} numberOfLines={1}>
                                    {Utility.getDateMMMdd(jobItem.created_date)}
                                </Text>
                            </View>

                        </View>
                        {jobItem.is_user_job_delete_to_cart == 1 ? <Text style={styles.textRemoveCart}>{jobItem.customer_name + " has removed from cart."}</Text> :
                            null}
                    </View>
                </TouchableOpacity>
            </SwipeRow>
        );
    }

    //Change Order Status tapped
    changeOrderStatusConfirmation(artwork, rowMap, index) {
        this.closeRow(rowMap, index);
        Utility.hideKeyboard();
        if (artwork.is_user_job_delete_to_cart == 1) {
            Alert.alert(
                'Delete',
                'Are you sure you want to delete ' + artwork.title + '?',
                [
                    { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                    { text: 'Yes', onPress: () => this.removeArtwork(artwork) },
                ],
                { cancelable: true }
            )
        } else {
            Alert.alert(
                artwork.next_order_status,
                'Are you sure you want to ' + artwork.next_order_status + ' ' + artwork.title + '?',
                [
                    { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                    { text: 'Yes', onPress: () => this.changeStatus(artwork) },
                ],
                { cancelable: true }
            )
        }
    }

    changeStatus(artwork) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.ORDER_STATUS_UPDATE, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'order_id': artwork.order_id + '',
            'order_status': artwork.next_order_status_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.getOnGoingJobList()
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    //API
    removeArtwork(artwork) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.REMOVE_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.getOnGoingJobList();
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    /////////////////////////////////////////   ONGOING LIST END  ///////////////////////////////////////////////

    /////////////////////////////////////////   COMPLETE LIST START  ///////////////////////////////////////////////
    //API  API change
    getCompletedJobList() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_COMPLETED_JOB_LIST, {
            'user_id': Utility.user.user_id,
            'page': this.state.completedCommisionPage
        }, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({ arrCompleteCommissions: this.state.completedCommisionPage > 1 ? [...this.state.arrCompleteCommissions, ...response.result] : response.result, completedCommisionTotalRecords: response.totalcount })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfCompletedJobListFlatList() {
        if (this.state.arrCompleteCommissions.length < this.state.completedCommisionTotalRecords) {
            this.setState({
                spinnerVisible: true,
                completedCommisionPage: this.state.completedCommisionPage + 1
            }, this.getCompletedJobList.bind(this))
        }
    }

    renderCompletedJobViewCell(rowData, secId, rowId, rowMap) {
        var completedJob = rowData
        var index = rowId;
        return (
            <SwipeRow
                disableRightSwipe={true}
                disableLeftSwipe={true}>
                <View style={styles.rowBack}>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.deleteRow(cart, rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.backTextWhite}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.onJobPress.bind(this, completedJob)} activeOpacity={0.7}>
                    <View style={styles.jobItemStyle} >
                        <View style={styles.viewJobTitleNCustomeName}>
                            <Text style={styles.textArtworkJobName} numberOfLines={1}>
                                {completedJob.title}
                            </Text>
                            <Text style={styles.textCustomerName} numberOfLines={1}>
                                {"for " + completedJob.customer_name}
                            </Text>
                        </View>
                        <View style={styles.viewJobDate}>
                            <Text style={styles.textJobDate} numberOfLines={1}>
                                {Utility.getDateMMMdd(completedJob.created_date)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </SwipeRow>
        );
    }

    goOrderDetailScreen(order) {
        // Utility.push('OrderDetailViewController', { orders: { ...order } })
    }
    /////////////////////////////////////////   COMPLETE LIST  END ///////////////////////////////////////////////
    onJobPress(jobdetails) {
        Utility.push('JobDetailViewController', { commission_request_id: jobdetails.commission_request_id });
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.backBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>COMMISSIONS</Text>

                        </TouchableOpacity>
                    </View>
                    {/*Header View*/}
                    <View style={styles.viewHeader}>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnRequestedJobTapped()} activeOpacity={0.6}>
                            <Text numberOfLines={1} style={this.checkCurrentState(REQUESTED) ? styles.textSelected : styles.textUnSelected} >New Request</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnOngoingJobTapped()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(ONGOING) ? styles.textSelected : styles.textUnSelected} >Ongoing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnCompleteJobTapped()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(COMPLETE) ? styles.textSelected : styles.textUnSelected} >Complete</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewLine}>
                    </View>
                    {/*Card And Order Listing*/}

                    <KeyboardAwareScrollView
                        style={{ marginVertical: 2 }}
                        extraScrollHeight={10}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        {
                            this.checkCurrentState(ONGOING) ? // for ongoing list
                                this.state.arrOngoingCommissions.length > 0 ? // check if records available otherwise show no records label
                                    <SwipeListView
                                        dataSource={this.ds.cloneWithRows(this.state.arrOngoingCommissions)}
                                        renderRow={(data, secId, rowId, rowMap) => this.renderOngoingJobViewCell(data, secId, rowId, rowMap)}
                                    />
                                    :
                                    this.state.isDataReceived ?
                                        <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : null
                                : this.checkCurrentState(COMPLETE) ? this.state.arrCompleteCommissions.length > 0 ? // check if records available otherwise show no records label
                                    <SwipeListView  //for complete list
                                        onEndReachedThreshold={0.5}
                                        onEndReached={() => this.endOfCompletedJobListFlatList()}
                                        dataSource={this.ds.cloneWithRows(this.state.arrCompleteCommissions)}
                                        renderRow={(data, secId, rowId, rowMap) => this.renderCompletedJobViewCell(data, secId, rowId, rowMap)}
                                    />
                                    :
                                    this.state.isDataReceived ?
                                        <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : null
                                    :
                                    this.state.arrNewRequestCommissions.length > 0 ? // check if records available otherwise show no records label
                                        <SwipeListView // for new request list
                                            onEndReachedThreshold={0.5}
                                            // onEndReached={() => this.endOfNewRequestJobListFlatList()}
                                            dataSource={this.ds.cloneWithRows(this.state.arrNewRequestCommissions)}
                                            renderRow={(data, secId, rowId, rowMap) => this.renderNewRequestJobViewCell(data, secId, rowId, rowMap)}
                                        />
                                        :
                                        this.state.isDataReceived ?
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                            : null
                        }
                    </KeyboardAwareScrollView>
                    {/* <View style={styles.sendButtonView}>
                        <TouchableOpacity onPress={() => this.btnNewJobTapped()}>
                            <Text style={{ color: 'white', fontFamily: Fonts.promptRegular }}>New Job</Text>
                        </TouchableOpacity>
                    </View> */}
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default CommisionsViewController