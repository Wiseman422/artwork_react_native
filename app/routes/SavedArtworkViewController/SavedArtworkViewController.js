import React, { Component } from 'react';
import { FlatList, Text, View, Alert, TouchableWithoutFeedback, NativeModules } from 'react-native';

import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import { CachedImage } from 'react-native-cached-image';
import INTButton from '../../component/INTButton';
import SafeAreaView from '../../component/SafeAreaView';

import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
var UtilityController = NativeModules.UtilityController;

import Spinner from 'react-native-loading-spinner-overlay';

class SavedArtworkViewController extends Component {
    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        Utility.navigator = this.props.navigator;

        this.state = {
            spinnerVisible: false,
            selectedsegmentID: 0,
            arrArtworkList: [],
            page: 1,
            totalRecords: 0,
            error: null,
            arrCategoryList: [],
            isRecordAvailable: false,
            isDataReceived: false,
        }
    }

    componentDidMount() {
        this.getCategories()
        this.getSavedArtworksAPI()
    }

    //API
    getCategories() {
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
    // SavedArtowrk API
    getSavedArtworksAPI() {
        var preferredId = this.state.selectedsegmentID == 0 ? '' : this.state.selectedsegmentID
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.user.user_id + '',
            'page': this.state.page + '',
            'preferred_medium_id': preferredId + '',
        };
        console.log('params', params);
        WebClient.postRequest(Settings.URL.SAVED_ARTWORK_LIST, params, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                this.setState({ arrArtworkList: this.state.page > 1 ? [...this.state.arrArtworkList, ...response.result] : response.result, totalRecords: response.totalcount, isRecordAvailable: response.result.length > 0 ? true : false })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfSavedArtworkFlatList() {
        if (this.state.arrArtworkList.length < this.state.totalRecords) {
            this.setState({
                spinnerVisible: true,
                page: this.state.page + 1
            }, this.getSavedArtworksAPI.bind(this))
        }
    }

    showAlertForUnSaved(artwork, index) {
        Alert.alert(
            'Remove',
            'Are you sure remove from saved artwork?',
            [
                { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                { text: 'Yes', onPress: () => this.callSaveArtworkAPI(artwork, index) },
            ],
            { cancelable: true }
        )
    }

    // Favorite Artwork
    callSaveArtworkAPI(artwork, index) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.SAVE_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'artist_id': artwork.user_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray.splice(index, 1)
                this.setState({ arrArtworkList: tempArray })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    // Flatlist Cell
    renderArtworkViewCell(rowData) {
        var artwork = rowData.item
        var index = rowData.index
        let firstPhotUrl = undefined

        if ((artwork.artwork_photos).length > 0) {
            firstPhotUrl = (artwork.artwork_photos[0]).image_path
        }

        return (
            <TouchableWithoutFeedback onPress={() => this.onArtworkCellDidTapped(artwork)}>
                <View style={styles.gridViewCellStyle}>
                    {/* <ProgressiveImage
                        style={styles.articleImageStyle}
                        uri={firstPhotUrl}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.articleImageStyle}
                        source={{
                            uri: firstPhotUrl
                        }}
                        fallbackSource={Images.placeholderMediaImage}
                    />
                    <View style={styles.articleDescriptionStyle}>
                        <View style={styles.nameContainerView}>
                            <View style={styles.projectNameView}>
                                <Text style={styles.projectNameText} numberOfLines={1}>{artwork.title}</Text>
                                <Text style={styles.priceText}>{'$' + artwork.price}</Text>
                            </View>
                            <Text style={styles.artistNameText}>{artwork.full_name}</Text>
                        </View>
                        <View style={styles.articleIconView}>
                            <INTButton icon={artwork.is_saved == 1 ? Images.articleFavoriteSelectIcon : Images.articleFavoriteNonSelectIcon} onPress={() => this.showAlertForUnSaved(artwork, index)} />
                            <INTButton icon={artwork.is_incart == 0 ? Images.articleCartIcon : Images.articleAddedCartIcon} onPress={() => this.btnCartTapped(artwork, index)} />
                            <INTButton icon={Images.articleShareBlueIcon} onPress={() => this.btnShareTapped(artwork)} />
                        </View>
                        <Text style={styles.articleTypeText}>{artwork.preferred_medium}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
    }



    //Artwork Flatlist cell tap event
    onArtworkCellDidTapped(artwork) {
        Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id })
    }

    btnCartTapped(artwork, index) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.ADD_TO_CART, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'quantity': 1 + '',// default 
            'cart_id': 0 + '',// 0 for new add 
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray[index].is_incart = (this.state.arrArtworkList[index].is_incart == 1 ? 0 : 1)
                this.setState({ arrArtworkList: tempArray })
                if (tempArray[index].is_incart == 1) {
                    Utility.showToast(Utility.MESSAGES.added_to_cart);
                } else {
                    Utility.showToast(Utility.MESSAGES.removed_from_cart);
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    btnShareTapped(artwork) {
        var shareContent = artwork.title + "\n\n";
        shareContent = shareContent + artwork.full_name + "\n\n";
        if (artwork.artwork_photos) {
            if (artwork.artwork_photos.length > 0) {
                shareContent = shareContent + artwork.artwork_photos[0].image_path + "\n\n";
            }
        }
        shareContent = shareContent + artwork.description;
        UtilityController.shareRefLink(shareContent);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TopbarView
                    title={"SAVED ARTWORK"}
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
                            this.setState({ isDataReceived: false, selectedsegmentID: segmentID }, () => { this.getSavedArtworksAPI() })
                        }}
                    />
                    {(this.state.isRecordAvailable) ? // check if records available otherwise show no records label
                        <FlatList
                            onEndReachedThreshold={0.5}
                            onEndReached={() => this.endOfSavedArtworkFlatList()}
                            style={styles.gridViewComponentStyle}
                            data={this.state.arrArtworkList}
                            renderItem={this.renderArtworkViewCell.bind(this)}
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
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView >
        );
    }
}
export default SavedArtworkViewController