import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, Platform } from 'react-native';

import styles from './styles'

import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import WebClientChat from '../../config/WebClientChat';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

import TopbarView from '../../component/TopbarView'
import SafeAreaView from '../../component/SafeAreaView';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';

import Spinner from 'react-native-loading-spinner-overlay';
import ImageView from 'react-native-image-view';
import { GiftedChat, Actions, Bubble, MessageText, Time, Avatar, StyleSheet } from 'react-native-gifted-chat';
import { RNS3 } from 'react-native-aws3';

var ImagePicker = require('react-native-image-picker');
var options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class MessageInsideViewController extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true
        Utility.navigator = this.props.navigator;
        this.renderBubble = this.renderBubble.bind(this);
        this.state = {
            spinnerVisible: false,
            loadEarlier: false,
            typingText: null,
            isLoadingEarlier: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            isCompleted: 1,

            // Paramter for add chat
            isCustomJobChat: this.props.isCustomJobChat,
            commissionRequestId: this.props.isCustomJobChat == 1 ? this.props.commissionRequestId : 0,
            orderItemId: this.props.orderItemId == undefined ? 0 : this.props.orderItemId,


            // dictParam.is_custom_job_chat = this.props.isFromConversationScreen == true ? 0 : 1 // is_custom_job_chat:1 (0 = no, 1 = yes)
            // dictParam.order_item_id = this.props.order_item_id  // order_item_id:0 (0 = request for commision, other wise order_item_id  > 0)
            // dictParam.commission_request_id = this.props.commissionRequestId


            //chat variables            
            receiverId: this.props.receiverId,
            arrChatMessages: [],
            minChatId: 0,
            maxChatId: 0,

            isFullScreenImageViewVisible: false,
            strFullImageUrl: ''
        }

        this.renderCustomActions = this.renderCustomActions.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);
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
        this.getChatMessages(0, true, true, true)
    }

    componentDidUnMount() {
        // Tried to stop timer of getChat API
        // if (chatCallingTimeout != undefined) {
        //     clearTimeout(chatCallingTimeout);
        // }
    }

    // API 
    // Message Order will be:  (1 : prev , 2 : next)     
    getChatMessages(messageOrder, isRecent, showLoading, resetMessageList) {
        if (Utility.user == undefined) {
            return
        }
        var dictParam = {};
        dictParam.user_id = Utility.user.user_id + ''
        dictParam.receiver_id = this.state.receiverId + ''
        dictParam.order_item_id = this.props.orderItemId + ''
        if (this.props.isCustomJobChat == 1) {
            dictParam.commission_request_id = this.props.commissionRequestId + ''
        }

        if (resetMessageList == true) {
            this.setState({ arrChatMessages: [] })
        }

        if (this.state.arrChatMessages.length > 0) {

            if (messageOrder == 1) { // for message history
                chatId = this.state.arrChatMessages.reverse()[0]._id
            } else if (messageOrder == 2) { // for upcoming message               
                chatId = this.state.arrChatMessages[0]._id
            }

            dictParam.last_msg_id = chatId
            dictParam.message_order = messageOrder

        }

        //Only show loading first time
        if (this.state.isLoadingEarlier == false && showLoading == true) {
            this.setState({ spinnerVisible: true })
        }

        console.log('dictParam-->', dictParam)

        WebClientChat.postRequest(Settings.URL.GET_CHAT_LIST, dictParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {

                    this.setState({ isCompleted: response.isCompleted })

                    if (response.data.length > 0) {
                        var arrChatObjects = response.data
                        arrChatObjects = this.setupChatDataStructure(arrChatObjects)

                        // show load earlier 
                        var showLoadEarlier = false
                        var firstMessageChatId = arrChatObjects[0]._id
                        if (firstMessageChatId > response.chat_list.min_chat_id) {
                            showLoadEarlier = true
                        }

                        this.setState({ loadEarlier: showLoadEarlier })

                        if (resetMessageList == true) {
                            this.setState({ minChatId: response.chat_list.min_chat_id, maxChatId: response.chat_list.max_chat_id, arrChatMessages: arrChatObjects.reverse() })
                        }

                        if (messageOrder == 1) {// for message history
                            this.setState((previousState) => {
                                return {
                                    arrChatMessages: GiftedChat.prepend(previousState.arrChatMessages.reverse(), arrChatObjects.reverse()),
                                    isLoadingEarlier: false,
                                };
                            });
                        } else if (messageOrder == 2 && arrChatObjects.length > 0) { // for upcoming message
                            this.setState({ arrChatMessages: GiftedChat.append(this.state.arrChatMessages, arrChatObjects) })
                        }
                    }
                    // if (response.isCompleted == 0) {
                    //     setTimeout(() => this.getChatMessages(2, true, false, false), 5000);
                    // }

                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    setupChatDataStructure(arrChatObjects) {
        arrChatObjects.forEach(function (item, i) {

            var giftedChatObject = {}
            giftedChatObject._id = item.chat_id
            giftedChatObject.text = item.message
            giftedChatObject.createdAt = new Date(item.created_date);

            var user = {}
            user._id = item.sender_id
            user.name = item.sender_name
            user.avatar = item.sender_profile_pic

            giftedChatObject.user = user
            giftedChatObject.sent = true
            giftedChatObject.conversation_id = item.conversation_id
            giftedChatObject.unread_message_count = item.unread_message_count
            giftedChatObject.receiver_seen = item.receiver_seen
            giftedChatObject.isCompleted = item.isCompleted
            giftedChatObject.messageDate = Utility.isToday(item.created_date) ? Utility.getDatehhmma(item.created_date) : Utility.getDateMMMdd(item.created_date)
            giftedChatObject.image = item.file
            giftedChatObject.imageThumb = item.file_thumb
            giftedChatObject.messageType = item.msg_type

            arrChatObjects[i] = giftedChatObject;
        });
        return arrChatObjects
    }

    sendMessageAPI(sendMessageText) {

        this.setState({ spinnerVisible: true })

        var dictParam = {};
        dictParam.user_id = Utility.user.user_id + ''
        dictParam.receiver_id = this.state.receiverId + ''
        dictParam.message = sendMessageText + ''
        dictParam.msg_type = 1 + ''
        dictParam.filename = ''
        dictParam.is_custom_job_chat = this.state.isCustomJobChat + ''
        dictParam.order_item_id = this.state.orderItemId + ''
        dictParam.commission_request_id = this.state.commissionRequestId + ''

        console.log(dictParam)

        WebClientChat.postRequest(Settings.URL.ADD_MESSAGE, dictParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    arrChatObjects = this.setupChatDataStructure([response.data])
                    this.setState((previousState) => {
                        return {
                            arrChatMessages: GiftedChat.append(previousState.arrChatMessages, arrChatObjects),
                        };
                    });
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }


    sendAttachmentAPI(serverImageName) {

        this.setState({ spinnerVisible: true })

        var dictParam = {};
        dictParam.user_id = Utility.user.user_id
        dictParam.receiver_id = this.state.receiverId
        dictParam.message = 'Image'
        dictParam.msg_type = 2
        dictParam.filename = serverImageName
        dictParam.is_custom_job_chat = this.state.isCustomJobChat
        dictParam.order_item_id = this.state.orderItemId
        dictParam.commission_request_id = this.state.commissionRequestId


        WebClientChat.postRequest(Settings.URL.ADD_MESSAGE, dictParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    console.log(response)
                    arrChatObjects = this.setupChatDataStructure([response.data])
                    this.setState((previousState) => {
                        return {
                            arrChatMessages: GiftedChat.append(previousState.arrChatMessages, arrChatObjects),
                        };
                    });
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    uploadImageAttachment(imagePickerResponse) {
        if (Utility.getAWSData == undefined) {
            return;
        }
        let photoFileUrl = imagePickerResponse.uri
        var photo = {
            uri: photoFileUrl,
            type: 'image/*',
            name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
        };
        const options = {
            keyPrefix: Utility.getAWSData.folder_chat + '/',
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
                console.log('UPLOAD RESPONSE', response.body);
                this.sendAttachmentAPI(photo.name)
            }
        });
        // WebClientChat.postRequest(Settings.URL.MEDIA_UPLOAD_CHAT, {
        //     'type': 'chat',
        //     'media_file': reqParam,
        // }, (response, error) => {
        //     this.setState({ spinnerVisible: false });
        //     if (error == null) {
        //         var serverImageName = response.data.filename
        //         this.sendAttachmentAPI(serverImageName)
        //     } else {
        //         Utility.showToast(error.message);
        //     }
        // });
    }

    backBtnTapped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });
        this.getChatMessages(1, false, false, false)
    }

    onSend(arrChatMessages = [], messageType = 1) {
        console.log('sendMessages', arrChatMessages)
        if (messageType == 1) {
            var sendMessageText = arrChatMessages[0].text
            this.sendMessageAPI(sendMessageText)
        } else {
            var imagePath = arrChatMessages[0].image
            this.sendAttachmentAPI(imagePath)
        }
    }

    onActionsPress() {
        Utility.hideKeyboard();
        let context = this;
        // if (this.state.hasCameraPermission != undefined && this.state.hasWritePermission != undefined) {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                context.uploadImageAttachment(response)
            }
        });
        // }
    }

    onBubbleImageTapped(imageUrl) {
        this.setState({ isFullScreenImageViewVisible: true, strFullImageUrl: imageUrl })
    }

    renderCustomActions(props) {
        return (
            <TouchableOpacity
                {...props}
                style={[styles.chatAttachmentContainer]}
                onPress={() => this.onActionsPress()}
            >
                <Image source={Images.chatImageAttachment} />
            </TouchableOpacity>
        );
    }
    profileImageClick(user) {
        console.log('user', user);
        // Utility.push('ArtistDetailViewController', { artist_id: artist_id })
    }
    renderAvatar(props) {
        return (
            <Avatar
                {...props}
                containerStyle={{
                    left: {
                        marginRight: 0
                    },
                    right: {
                        marginLeft: 0
                    }
                }}
                imageStyle={{
                    left: styles.UserDisplayImageStyle,
                    right: styles.UserDisplayImageStyle
                }}
                onPressAvatar={(user) => user._id != Utility.user.user_id ? Utility.push('ArtistDetailViewController', { artist_id: user._id }) : null}
            />
        );
    }

    renderBubble(props) {
        let isSender = props.position === "right" ? true : false
        return (
            <View style={[styles.bubbleContainer, isSender ? { alignItems: 'flex-end', justifyContent: "flex-end" } : { alignItems: 'flex-start', justifyContent: "flex-start" }]}>
                <View style={styles.bubbleMessageContainer}>
                    {isSender ? null : this.getTriangleImageView(isSender)}
                    {this.getBubbleView(isSender, props)}
                    {isSender ? this.getTriangleImageView(isSender) : null}
                </View>
                <View style={[{ flexDirection: 'row' }, isSender ? { marginRight: 18 } : { marginLeft: 18 }]}>
                    <Image source={Images.chatTrueIcon} style={{ marginRight: 5 }} />
                    <Text style={styles.dateTextStyle}>{props.currentMessage.messageDate}</Text>
                </View>
            </View>
        );
    }

    getBubbleView(isSender, props) {
        return (<View style={isSender ? styles.senderTextContainer : styles.receiverTextContainer} >
            {props.currentMessage.messageType == 1 ?
                <Text style={styles.textStyle}>{props.currentMessage.text}</Text>
                :
                <TouchableOpacity style={styles.profilePicEditView} onPress={() => this.onBubbleImageTapped(props.currentMessage.image)} activeOpacity={0.7}>
                    {/* <ProgressiveImage
                        style={styles.bubbleImageStyle}
                        placeholderStyle={styles.bubbleImageStyle}
                        uri={props.currentMessage.imageThumb}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.bubbleImageStyle}
                        // placeholderStyle={styles.bubbleImageStyle}
                        // uri={props.currentMessage.imageThumb}
                        // placeholderSource={Images.placeholderMediaImage}
                        // borderRadius={1}
                        source={{
                            uri: props.currentMessage.imageThumb
                        }}
                        fallbackSource={Images.placeholderMediaImage} />
                </TouchableOpacity>}
        </View>);
    }

    getTriangleImageView(isSender) {
        return (<Image source={isSender ? Images.chatTriangleRight : Images.chatTriangleLeft} style={{ marginTop: 12 }} />);
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    renderCompletedGiftedChat() {
        return (
            <GiftedChat
                ref='GiftedChat'
                messages={this.state.arrChatMessages}
                onSend={arrChatMessages => this.onSend(arrChatMessages)}
                loadEarlier={this.state.loadEarlier}
                onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                user={{
                    _id: Utility.user.user_id,
                }}
                renderComposer={() => null} // to hide bottom text input.
                showAvatarForEveryMessage={true}
                showUserAvatar={true}
                renderBubble={this.renderBubble.bind(this)}
                showUserAvatar={true}
                renderAvatar={this.renderAvatar}
                renderAvatarOnTop={true}
                extraData={this.state}
            />
        );
    }

    renderOnGoingGiftedChat() {
        return (
            <GiftedChat
                ref='GiftedChat'
                messages={this.state.arrChatMessages.filter((v, i, a) => a.indexOf(v) === i)}
                onSend={arrChatMessages => this.onSend(arrChatMessages)}
                loadEarlier={this.state.loadEarlier}
                onLoadEarlier={this.onLoadEarlier}
                isLoadingEarlier={this.state.isLoadingEarlier}
                user={{
                    _id: Utility.user.user_id,
                }}
                renderActions={this.renderCustomActions}
                renderFooter={this.renderFooter}
                showAvatarForEveryMessage={true}
                showUserAvatar={true}
                renderBubble={this.renderBubble.bind(this)}
                showUserAvatar={true}
                renderAvatar={this.renderAvatar}
                renderAvatarOnTop={true}
                extraData={this.state}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {this.state.isFullScreenImageViewVisible == 1 ?
                        // <CachedImage
                        //     style={{ height: 720, width: 806 }}
                        //     // placeholderStyle={styles.bubbleImageStyle}
                        //     // uri={props.currentMessage.imageThumb}
                        //     // placeholderSource={Images.placeholderMediaImage}
                        //     // borderRadius={1}
                        //     source={{
                        //         uri: this.state.strFullImageUrl,
                        //     }}
                        //     isVisible={this.state.isFullScreenImageViewVisible}
                        //     fallbackSource={Images.placeholderMediaImage}
                        //     onClose={() => this.setState({ isFullScreenImageViewVisible: false })}
                        //     isScrolling={false} />
                        <ImageView
                            images={[
                                {
                                    source: {
                                        uri: this.state.strFullImageUrl,
                                    },
                                    width: 806,
                                    height: 720,
                                },
                            ]}
                            imageIndex={0}
                            isVisible={this.state.isFullScreenImageViewVisible}
                            onClose={() => this.setState({ isFullScreenImageViewVisible: false })}
                            isScrolling={false}
                        />
                        : null}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={this.backBtnTapped.bind(this)} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackGreen} />
                                <Text style={styles.titleTextStyle}>{this.props.receiverName ? this.props.receiverName.toUpperCase() : ''}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {this.state.isCompleted == 1 ? this.renderCompletedGiftedChat() : this.renderOnGoingGiftedChat()}
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}
export default MessageInsideViewController