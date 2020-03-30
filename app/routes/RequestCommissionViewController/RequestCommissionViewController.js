/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    FlatList,
    Linking,
    TextInput,
    TouchableOpacity
} from 'react-native';

import styles from './styles'

import INTButton from '../../component/INTButton'
import SafeAreaView from '../../component/SafeAreaView';
import INTSegmentControl from '../../component/INTSegmentControl';
import ProgressiveImage from '../../component/ProgressiveImage';
import Colors from '../../config/Colors';
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';
import Images from '../../config/Images';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var arrSegmentText = ['Instagram', 'DeviantArt', 'ArtStation', 'Website'];

class RequestCommissionViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            artist: this.props.artist,
            spinnerVisible: false,
            text: ''
        };
    }

    leftBtnTaaped() {
        Utility.navigator.pop({
            animated: true,
        });
    }

    //API 
    //Request for commission
    requestForCommissionAPI() {
        if (this.state.text.trim().length > 0) {
            this.setState({ spinnerVisible: true })
            var reqestParam = {};
            reqestParam.user_id = Utility.user.user_id + ''
            reqestParam.artist_id = this.state.artist.artist_id + ''
            reqestParam.description = this.state.text + ''
            WebClient.postRequest(Settings.URL.ADD_JOB_REQUEST, reqestParam, (response, error) => {
                this.setState({ spinnerVisible: false });
                // console.log(response)
                if (error == null) {
                    Utility.showToast(Utility.MESSAGES.request_added_success)
                    this.leftBtnTaaped()

                } else {
                    Utility.showToast(error.message);
                }
            });
        } else {
            Utility.showToast(Utility.MESSAGES.please_enter_des)
        }
    }

    render() {
        // const { onScroll = () => { } } = this.props;
        return (
            <SafeAreaView style={{ backgroundColor: '#ffffff' }}>
                <KeyboardAwareScrollView
                    // onScroll={this.handleScroll}       
                    extraScrollHeight={100}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}>
                    <ProgressiveImage
                        style={{
                            width: Utility.screenWidth,
                            height: 250
                        }}
                        uri={this.state.artist != null ? this.state.artist.profile_banner_photo : undefined}
                        placeholderSource={Images.placeholderMediaImage}
                    />
                    <View style={{ position: "absolute", marginLeft: 15, marginTop: 15 }}>
                        <TouchableOpacity onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackTransparent} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.detailViewStyle}>
                        <View style={styles.artistInnerDetailViewStyle}>
                            <View style={styles.artistProfile}>
                                <ProgressiveImage
                                    style={styles.artistProfilePhoto}
                                    uri={this.state.artist != null ? (this.state.artist.profile_pic != "" ? this.state.artist.profile_pic : undefined) : undefined}
                                    placeholderSource={Images.input_userphoto}
                                    placeholderStyle={styles.artistPlaceHolderPhoto}
                                    borderRadius={1} />
                                <View style={{ flex: 1, marginEnd: 20 }}>
                                    <Text style={styles.artistNameText} >{this.state.artist.full_name}</Text>
                                    <Text style={styles.artistCategoryText} >{this.state.artist.preferred_medium}</Text>
                                </View>
                            </View>
                            <Text style={styles.customArtworkTitle}>Please describe artwork you would like to commission in the form below. Be as descriptive as possible so the artist knows exactly what you want!</Text>
                            <TextInput
                                style={Utility.isPlatformAndroid ? styles.detailsTextInputAndroid : styles.detailsTextInput}
                                multiline={true}
                                placeholder={""}
                                selectionColor={Colors.blueType1}
                                onChangeText={(text) => this.setState({ text })}
                            />
                            <INTButton
                                buttonStyle={styles.btnContactForCommissionStyle}
                                title='Request Commission'
                                titleStyle={styles.btnContactForCommissionTextStyle}
                                onPress={() => this.requestForCommissionAPI()}
                            />
                        </View>
                    </View>
                    <Spinner visible={this.state.spinnerVisible} />
                </KeyboardAwareScrollView>

            </SafeAreaView>
        );
    }
}
export default RequestCommissionViewController;