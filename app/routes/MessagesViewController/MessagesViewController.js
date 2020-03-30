import React, { Component } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native';

import styles from './styles'
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Settings from '../../config/Settings';
import INTSegmentControl from '../../component/INTSegmentControl';
import TopbarView from '../../component/TopbarView';
import ProgressiveImage from '../../component/ProgressiveImage';
import SafeAreaView from '../../component/SafeAreaView';
import WebClient from '../../config/WebClient';
import Spinner from 'react-native-loading-spinner-overlay';

class MessagesViewController extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
        Utility.navigator = this.props.navigator;
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            spinnerVisible: false,
            selectedsegmentID: 0,
            arrCategoryList: ['   All   ', 'Ongoing', 'Completed'],
            // arrUsers: [{ profilePic: "", userName: "", message: "", isMedia: false }, { profilePic: "", userName: "", message: "", isMedia: false }],
            arrConversations: [],
            isDataReceived: false,
        }
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.getConversation()
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
            case 'willCommitPreview':
                break;
        }
    }
    leftBtnTapped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
        });
    }

    //API
    getConversation() {
        this.setState({ spinnerVisible: true })
        var reqParam = {}
        reqParam.user_id = Utility.user.user_id + ''

        // 0 for All, 1 for OnGoing and 2 for Completed
        reqParam.isCompleted = this.state.selectedsegmentID == 0 ? "" : this.state.selectedsegmentID == 1 ? "0" : this.state.selectedsegmentID == 2 ? "1" : "";

        WebClient.postRequest(Settings.URL.GET_CONVERSATION, reqParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({ isDataReceived: true, arrConversations: response, isRecordAvailable: response.length > 0 ? true : false });
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    // User Flatlist Cell
    renderUserCell(rowData) {
        var userChatObject = rowData.item
        var index = rowData.index
        return (
            <TouchableOpacity onPress={() => this.onMessageListCellDidTapped(userChatObject)} activeOpacity={0.7}>
                <View style={styles.userCellStyle}>
                    <ProgressiveImage
                        style={styles.artistImageStyle}
                        uri={userChatObject.receiver_profile_pic}
                        placeholderSource={Images.input_userphoto}
                        placeholderStyle={styles.artistPlaceHolderPhoto}
                        borderRadius={1} />
                    <View style={{ flex: 1, marginRight: 20 }}>
                        <View style={styles.userInformationStyle}>
                            <Text numberOfLines={1} style={styles.userNameTextStyle}>{userChatObject.receiver_name}</Text>
                            <View style={styles.roundViewAndTimeStyle}>
                                {userChatObject.isCompleted === 1 ? <View style={styles.roundViewStyle}></View> : null}
                                <Text style={styles.timeTextStyle}>{Utility.isToday() ? Utility.getDatehhmma(userChatObject.created_date) : Utility.getDateMMMdd(userChatObject.created_date)}</Text>
                            </View>
                        </View>
                        <Text numberOfLines={2} style={styles.messageTextStyle}>{userChatObject.message}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    onMessageListCellDidTapped(userChatObject) {
        var param = {
            isFromCommissionScreen: false,
            receiverId: userChatObject.receiver_id,
            receiverName: userChatObject.receiver_name,
            isCustomJobChat: userChatObject.commission_request_id > 0 ? 1 : 0,
            orderItemId: userChatObject.order_item_id,
            commissionRequestId: userChatObject.commission_request_id
        }
        console.log(param)
        Utility.push('MessageInsideViewController', param)
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={this.leftBtnTapped.bind(this)} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackGreen} />
                                <Text style={styles.titleTextStyle}>MESSAGES</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <INTSegmentControl // Category type horizontal Segment Component
                        controllStyle={styles.segmentControllerStyle}
                        arrSegment={this.state.arrCategoryList}
                        segmentWidthStyle='dynamic'
                        titleStyle={styles.segmentTitle}
                        titleStyleSelected={styles.segmentSelectedTitle}
                        selectedSegmentStyle={{ backgroundColor: Colors.themeColor }}
                        selectionStyle='box'
                        spaceBetweenSegment={15}
                        onSelectionDidChange={(selectedIndex, segmentID) => {
                            this.setState({ isDataReceived: false, selectedsegmentID: selectedIndex }, () => {
                                this.getConversation()
                            })
                        }}
                    />
                    {
                        this.state.arrConversations.length > 0 ?
                            <FlatList //User list                        
                                style={{ backgroundColor: 'white', marginTop: 15 }}
                                data={this.state.arrConversations}
                                renderItem={this.renderUserCell.bind(this)}
                                ItemSeparatorComponent={() => <View style={styles.saperatorStyle} />}
                                numColumns={1}
                                extraData={this.state}
                            />
                            :
                            this.state.isDataReceived ?
                                <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                : null
                    }

                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}
export default MessagesViewController