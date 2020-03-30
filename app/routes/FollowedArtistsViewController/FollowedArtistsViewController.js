import React, { Component } from 'react';
import { Keyboard, FlatList, Text, View, Alert, Platform, Image, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import SafeAreaView from '../../component/SafeAreaView';
import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';

import User from '../../models/User';

import Spinner from 'react-native-loading-spinner-overlay';

class FollowedArtistsViewController extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        Utility.navigator = this.props.navigator;

        this.state = {
            spinnerVisible: false,
            selectedsegmentID: 0,
            arrArtistList: [],
            error: null,
            arrCategoryList: [],
            isRecordAvailable: false,
            page: 1,
            totalRecords: 0,
            isDataReceived: false,
        }
    }

    componentDidMount() {
        this.getPreferredMedium()
        this.getFollowedArtistsAPI()
    }

    //API
    getPreferredMedium() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': 'preferred_medium',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.length > 0) {
                    var itemAll = {
                        "id": 0,
                        "name": "   All   "
                    }
                    response.splice(0, 0, itemAll) // index position, number of item delete, item
                    this.setState({ arrCategoryList: response })
                } else {
                    this.setState({ spinnerVisible: false })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    // Artist API
    getFollowedArtistsAPI() {
        var preferredId = this.state.selectedsegmentID == 0 ? '' : this.state.selectedsegmentID
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_FOLLOWED_ARTIST, {
            'user_id': Utility.user.user_id + '',
            'preferred_medium_id': preferredId + '',
            'page': this.state.page + ''
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ isDataReceived: true, arrArtistList: this.state.page > 1 ? [...this.state.arrArtistList, ...response.result] : response.result, totalRecords: response.totalcount, isRecordAvailable: response.result.length > 0 ? true : false })
            } else {
                Utility.showToast(error.message);
            }
        },true);
    }

    endOfFollowedArtistsFlatList() {
        if (this.state.arrArtistList.length < this.state.totalRecords) {
            this.setState({
                spinnerVisible: true,
                page: this.state.page + 1
            }, this.getFollowedArtistsAPI.bind(this))
        }
    }

    renderArtistViewCell(rowData) {
        var artist = rowData.item
        return (
            <TouchableWithoutFeedback onPress={() => this.onArtistCellDidTapped(artist.artist_id)}>
                <View style={styles.gridViewCellStyle}>
                    <View style={styles.imageCellOuter}>
                        <View style={styles.imageCell}>
                            {/* <ProgressiveImage
                            style={styles.artistViewCellArticleImageStyle}
                            // uri={(artist.profile_banner_photo_thumb != "" ? artist.profile_banner_photo_thumb : undefined)}
                            uri={(artist.profile_banner_photo != "" ? artist.profile_banner_photo : undefined)}
                            placeholderSource={Images.placeholderMediaImage}
                            borderRadius={1} /> */}
                            <CachedImage
                                style={styles.artistViewCellArticleImageStyle}
                                source={{
                                    uri: (artist.profile_banner_photo != "" ? artist.profile_banner_photo : undefined)
                                }}
                                fallbackSource={Images.placeholderMediaImage}
                            />
                        </View>
                        <ProgressiveImage
                            style={styles.artistImageStyle}
                            uri={(artist.profile_pic_thumb != "" ? artist.profile_pic_thumb : undefined)}
                            placeholderSource={Images.input_userphoto}
                            placeholderStyle={styles.artistPlaceHolderPhoto}
                            borderRadius={1} />
                    </View>
                    <View style={styles.artistDescriptionStyle}>
                        <Text style={styles.artistViewCellArtistNameText} numberOfLines={1}>{artist.full_name}</Text>
                        <Text style={[styles.artistViewCellMediumOfWork]}>{artist.preferred_medium}</Text>
                        <Text style={[styles.artistTypeText, { marginVertical: 2 }]} numberOfLines={1} >
                            {artist.address}
                        </Text>
                        {/* <View style={styles.artistNameContainerView}> */}

                        {/* <View style={styles.artistNameContainerStyle}>
                            {/* <Text numberOfLines={1} style={styles.artistViewCellArtistNameText}></Text> */}
                        {/* </View>  */}
                        {/* </View> */}
                        {/* <View style={styles.artistDescriptionView}> */}
                        {/* <Text numberOfLines={2} style={styles.artistShortDescText}>{artist.bio}</Text> */}

                        {/* <Text style={styles.artistViewCellMediumOfWork}>{artist.preferred_medium}</Text> */}
                        {/* </View> */}
                    </View>
                </View>
            </TouchableWithoutFeedback >
            // <TouchableWithoutFeedback onPress={() => this.onArtistCellDidTapped(artist.artist_id)}>
            //     <View style={styles.gridViewCellStyle}>
            //         {/* <ProgressiveImage
            //             style={styles.artistViewCellArticleImageStyle}
            //             uri={(artist.profile_banner_photo_thumb != "" ? artist.profile_banner_photo_thumb : undefined)}
            //             placeholderSource={Images.placeholderMediaImage}
            //             borderRadius={1} /> */}
            //         <CachedImage
            //             style={styles.artistViewCellArticleImageStyle}
            //             source={{
            //                 uri: (artist.profile_banner_photo_thumb != "" ? artist.profile_banner_photo_thumb : undefined)
            //             }}
            //             fallbackSource={Images.placeholderMediaImage}
            //         />
            //         <View style={styles.artistDescriptionStyle}>
            //             <View style={styles.artistNameContainerView}>
            //                 <ProgressiveImage
            //                     style={styles.artistImageStyle}
            //                     uri={(artist.profile_pic_thumb != "" ? artist.profile_pic_thumb : undefined)}
            //                     placeholderSource={Images.input_userphoto}
            //                     placeholderStyle={styles.artistPlaceHolderPhoto}
            //                     borderRadius={1} />
            //                 <View style={styles.artistNameContainerStyle}>
            //                     <Text numberOfLines={1} style={styles.artistViewCellArtistNameText}>{artist.full_name}</Text>
            //                     <Text style={styles.artistViewCellMediumOfWork}>{artist.preferred_medium}</Text>
            //                 </View>
            //             </View>
            //             <View style={styles.artistDescriptionView}>
            //                 <Text numberOfLines={2} style={styles.artistShortDescText}>{artist.bio}</Text>
            //             </View>
            //             <Text numberOfLines={1} style={styles.artistTypeText}>{artist.address}</Text>
            //         </View>
            //     </View>
            // </TouchableWithoutFeedback>
        );
    }

    //Artwork Flatlist cell tap event
    onArtistCellDidTapped(artist_id) {
        Utility.push('ArtistDetailViewController', {
            artist_id: artist_id,
            handleCallback: this.handleCallback.bind(this),
            from: 'FollowedArtisScreen'
        })
    }

    handleCallback() {
        this.setState({ page: 0, selectedsegmentID: 0 }, this.getFollowedArtistsAPI.bind(this))
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TopbarView
                    title={'FOLLOWED ARTISTS'}
                    isTitleTappable={false}>
                </TopbarView>
                <View style={styles.subContainer}>
                    <INTSegmentControl // Category type horizontal Segment Component
                        controllStyle={styles.segmentControllerStyle}
                        arrSegment={this.state.arrCategoryList}
                        titleDisplayKey='name'
                        ItemIDKey='id'
                        segmentWidthStyle='dynamic'
                        titleStyle={styles.segmentTitle}
                        titleStyleSelected={styles.segmentSelectedTitle}
                        selectedSegmentStyle={{ backgroundColor: Colors.themeColor }}
                        selectionStyle='box'
                        onSelectionDidChange={(selectedIndex, segmentID) => {
                            this.setState({ isDataReceived: false, selectedsegmentID: segmentID }, () => { this.getFollowedArtistsAPI() })
                        }}
                    />
                    {(this.state.isRecordAvailable) ? // check if records available otherwise show no records label
                        <FlatList // Artist FlatList
                            onEndReachedThreshold={0.5}
                            onEndReached={() => this.endOfFollowedArtistsFlatList()}
                            style={styles.gridViewComponentStyle}
                            data={this.state.arrArtistList}
                            renderItem={this.renderArtistViewCell.bind(this)}
                            numColumns={2}
                            extraData={this.state}
                            keyExtractor={(item, index) => index + ''}
                        />
                        :
                        this.state.isDataReceived ?
                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                            : null
                    }
                </View>
                {this.state.isSearchButtonTapped == true ? null : <Spinner visible={this.state.spinnerVisible} />}
            </SafeAreaView >
        );
    }
}
export default FollowedArtistsViewController