import React, { Component } from 'react';
import { Keyboard, FlatList, Text, View, Alert, Platform, Image, TouchableWithoutFeedback, TouchableOpacity, NativeModules, DeviceEventEmitter } from 'react-native';
// import {
//     CachedImage,
//     ImageCacheProvider
// } from 'react-native-cached-image';
import firebase from 'react-native-firebase';
import styles from './styles'

import TopbarView from '../../component/TopbarView'
import INTSegmentControl from '../../component/INTSegmentControl';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import TextField from '../../component/TextField';
import INTButton from '../../component/INTButton';
import SafeAreaView from '../../component/SafeAreaView';

import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';

import User from '../../models/User';

import Spinner from 'react-native-loading-spinner-overlay';
var UtilityController = NativeModules.UtilityController;
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Fonts from '../../config/Fonts';

let kARTWORK = 'ARTWORK'
let kARTIST = 'ARTISTS'
let kEVENTS = 'EVENTS/CLASSES'

class HomeViewController extends Component {
    constructor(props) {
        super(props);
        Utility.navigator = this.props.navigator;
        this.state = {
            spinnerVisible: false,
            topbarTitle: kARTWORK,
            selectedsegmentID: 0,

            arrArtworkList: [],
            totalArtworkRecords: 0,
            artworkPage: 1,

            arrArtistList: [],
            totalArtistRecords: 0,
            artistPage: 1,

            //location variables
            userGeoPosition: undefined,
            error: null,
            arrCategoryList: [],
            isRecordAvailable: false,
            isSearchButtonTapped: false,
            suggestionRowDidTapped: false,
            search: '',
            arrSearchResult: [],
            hasLocationPermission: false,
            //Events
            arrMonthEventList: [],
            dictMarkedMonthDays: [],
            arrMonthEventDates: [],
            isDataReceived: false,
            isGetCurrentLocationCall: false,
        }
        LocaleConfig.locales['en_us'] = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        };
        LocaleConfig.defaultLocale = 'en_us';
    }

    componentDidMount() {
        this.setupFirebase()
        DeviceEventEmitter.addListener('removeCartItemFromCartListNotification', () => this.refreshScreen())
        this.saveDeviceTokenToServer()
        this.getPreferredMedium()
        Utility._checkLocationPermission().then((hasLocationPermission) => {
            if (!hasLocationPermission) {
                Utility.showToast(Utility.MESSAGES.location_alert);
                return;
            } else {
                this.setState({ hasLocationPermission }, () => this.setupGeolocation());
            }
        });
        if (Utility.user != undefined && Utility.user.latitude != 0 && Utility.user.longitude != 0) {
            Utility.currentLATITUDE = Utility.user.latitude;
            Utility.currentLONGITUDE = Utility.user.longitude;
            this.getArtworksAPI();
        } else {
            // Utility.currentLATITUDE = 0;
            // Utility.currentLONGITUDE = 0;
            if (Utility.isPlatformAndroid) {
                this.getArtworksAPI();
            }
        }
    }

    setupFirebase() {
        let objfirebaseAnalytics = firebase.analytics()
        objfirebaseAnalytics.setAnalyticsCollectionEnabled(true)
        objfirebaseAnalytics.setCurrentScreen("HomeScreen", 'HomeViewController')
        objfirebaseAnalytics.logEvent('HomeScreenEvent')
    }

    componentWillUnmount() {
        if (this.watchId != undefined) {
            navigator.geolocation.clearWatch(this.watchId)
        }
    }

    refreshScreen() {
        if (Utility.user != undefined) {
            this.getArtworksAPI(2);
        }
    }

    saveDeviceTokenToServer() {
        // Get Device token and post it to server
        if (Utility.user != undefined) {
            User.getAsyncData((token) => {
                if (token != undefined) {
                    this.setState({ deviceToken: token }, () => Utility.user.device_token == undefined ? this.saveToken() : '');
                    // console.log("fcm_token ", token)
                }
            }, 'fcm_token');
        }
    }

    setupGeolocation() {
        navigator.geolocation.getCurrentPosition(
            (userGeoPosition) => {
                // console.log("Position: ", userGeoPosition);
                this.setState({
                    userGeoPosition
                });
                if (userGeoPosition.coords.latitude != 0 && userGeoPosition.coords.longitude != 0) {
                    Utility.currentLATITUDE = userGeoPosition.coords.latitude,
                        Utility.currentLONGITUDE = userGeoPosition.coords.longitude
                }
                this.setCurrentLatLong()
            },
            //    this.setState({ userGeoPosition }, () => this.setCurrentLatLong())
            (error) => { if (Utility.currentLatitude == "") { Utility.showToast(Utility.MESSAGES.could_not_fetch_current_location) } this.setCurrentLatLong() },
            // (error) => {Utility.showToast(error.message)},
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 100, useSignificantChanges: true },
        );
        this.watchId = navigator.geolocation.watchPosition((userGeoPosition) => {
            this.setState({ userGeoPosition }, () => this.setCurrentLatLong())
        })
    }

    setCurrentLatLong() {
        var isBeforeLocationIdentify = true;
        if (Utility.currentLATITUDE == undefined && Utility.currentLONGITUDE == undefined) {
            isBeforeLocationIdentify = false;
        }
        // Utility.currentLATITUDE = this.state.userGeoPosition.coords.latitude;
        // Utility.currentLONGITUDE = this.state.userGeoPosition.coords.longitude;

        if (isBeforeLocationIdentify == true) {
            if (this.state.isGetCurrentLocationCall == false) {
                this.setState({ isGetCurrentLocationCall: true }, this.getArtworksAPI.bind(this))
            }
        }
    }

    //API
    saveToken() {
        if (Utility.user == undefined) {
            return;
        }
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.SAVE_TOKEN, {
            'user_id': Utility.user.user_id + '',
            'device_type': Utility.device_type + '',
            'device_token': this.state.deviceToken + '',
        }, (response, error) => {
            // this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    getPreferredMedium() {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': 'preferred_medium',
        }, (response, error) => {
            // this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.length > 0) {
                    var itemAll = {
                        "id": 0,
                        "name": "   All   "
                    }
                    response.splice(0, 0, itemAll) // index position, number of item delete, item
                    this.setState({ arrCategoryList: response })
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }
    // Artowrk API
    getArtworksAPI() {
        if (this.state.arrCategoryList.length == 0) this.getPreferredMedium();

        var preferredId = this.state.selectedsegmentID == 0 ? '' : this.state.selectedsegmentID
        this.setState({ spinnerVisible: true });
        var requestParam = {
            'user_id': Utility.getUserId + '',
            'latitude': Utility.currentLATITUDE != undefined ? Utility.currentLATITUDE + '' : 0.0 + '',
            'longitude': Utility.currentLONGITUDE != undefined ? Utility.currentLONGITUDE + '' : 0.0 + '',
            'preferred_medium_id': preferredId + '',
            'search_keyword': this.state.search + '',
            'page': this.state.artworkPage + '',
            'unique_device_id': Utility.deviceId + '',
        }
        WebClient.postRequest(Settings.URL.GET_ARTWORKS, requestParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ isDataReceived: true, arrArtworkList: this.state.artworkPage > 1 ? [...this.state.arrArtworkList, ...response.result] : response.result, totalArtworkRecords: response.totalcount, isRecordAvailable: response.result.length > 0 ? true : false })
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    // Artist API
    getArtistsAPI() {
        var preferredId = this.state.selectedsegmentID == 0 ? '' : this.state.selectedsegmentID
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.getUserId + '',
            'latitude': Utility.currentLATITUDE != undefined ? Utility.currentLATITUDE + '' : 0.0 + '',
            'longitude': Utility.currentLONGITUDE != undefined ? Utility.currentLONGITUDE + '' : 0.0 + '',
            'preferred_medium_id': preferredId + '',
            'search_keyword': this.state.search,
            'page': this.state.artworkPage + ''
        };
        WebClient.postRequest(Settings.URL.GET_ARTIST, params, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ isDataReceived: true, arrArtistList: this.state.artworkPage > 1 ? [...this.state.arrArtistList, ...response.result] : response.result, totalArtistRecords: response.totalcount, isRecordAvailable: response.result.length > 0 ? true : false })
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    //EVENT & CLASSES
    //API
    callEventList(reqParam) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_EVENT_LIST, reqParam, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                this.setupMarkedEvents(response.result)
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    goEventDetailScreen(event) {
        Utility.push('EventDetailViewController', { eventId: event.id })
    }
    onMonthChange(object) {
        var reqParam = {
            'user_id': Utility.getUserId + '',
            'page': 1 + '',
            'month': object.month + '',
            'year': object.year + ''
        }
        this.callEventList(reqParam)
    }
    onDayChange(object) {
        // var reqParam = {
        //     'user_id': Utility.user.user_id,
        //     'page': 1,
        //     // 'month': object.month,
        //     // 'year': object.year
        //     'date':object.dateString
        // }
        // this.callEventList(reqParam)
        const indexx = this.state.arrMonthEventList.findIndex(item => Utility.getEventDateYYYYMMDD(item.event_datetime) === object.dateString);
        if (indexx >= 0)
            this.list.scrollToIndex({ index: indexx })
    }

    setupMarkedEvents(responseEvents) {
        let arrEventDates = responseEvents.map(function (d) { return d['event_datetime']; })
        var dictMarkedDate = {}
        var dictCustomStyle = { 'container': styles.markDayContainerStyle, 'text': styles.markDayTextStyle }
        var dictCalenderOptions = { 'selected': false, 'customStyles': dictCustomStyle }
        arrEventDates.map((timestamp) => {
            var eventDate = Utility.getFormatedDate(timestamp)
            dictMarkedDate[eventDate] = dictCalenderOptions
        })
        this.setState({ dictMarkedMonthDays: dictMarkedDate, arrMonthEventList: responseEvents })
    }

    // endOfFlatlist() {
    //     if (this.state.topbarTitle == kARTWORK) {
    //         if (this.state.arrArtworkList.length < this.state.totalArtworkRecords) {
    //             this.setState({
    //                 spinnerVisible: true,
    //                 artworkPage: this.state.artworkPage + 1
    //             }, this.getArtworksAPI())
    //         }
    //     } else {
    //         if (this.state.arrArtistList.length < this.state.totalArtistRecords) {
    //             this.setState({
    //                 spinnerVisible: true,
    //                 artistPage: this.state.artistPage + 1
    //             }, this.getArtistsAPI())
    //         }
    //     }
    // }

    // search Keyword API
    searchKeywordsAPI() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.SEARCH_KEYWORDS, {
            'user_id': Utility.getUserId + '',
            'type': this.state.topbarTitle == kARTWORK ? '1' : '2',
            'search_keyword': this.state.search + ''
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({ isDataReceived: true, arrSearchResult: response });
                }
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
                                {artwork.is_product_sold == 0 ?
                                    <Text style={styles.priceText}>{Utility.DOLLOR + artwork.price}</Text>
                                    :
                                    <Text style={[styles.priceText, { color: Colors.blueType1, }]}>SOLD</Text>
                                }
                            </View>
                            <Text style={styles.artistNameText} numberOfLines={1}>{artwork.full_name}</Text>
                        </View>
                        <View style={styles.articleIconView}>
                            <INTButton icon={artwork.is_saved == 1 ? Images.articleFavoriteSelectIcon : Images.articleFavoriteNonSelectIcon} onPress={() => this.callSaveArtworkAPI(artwork, index)} />
                            <INTButton icon={artwork.is_incart == 0 ? Images.articleCartIcon : Images.articleAddedCartIcon} onPress={() => (artwork.is_incart == 0) ? this.btnCartTapped(artwork, index) : this.removeFromCart(artwork, index)} />
                            <INTButton icon={Images.articleShareBlueIcon} onPress={() => this.onShareTapped(artwork)} />
                        </View>
                        <Text style={styles.articleTypeText} numberOfLines={1}>{artwork.preferred_medium}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>);
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
            </TouchableWithoutFeedback >);
    }

    renderEventListViewCell(rowData) {
        var event = rowData.item
        return (
            <TouchableOpacity onPress={() => this.goEventDetailScreen(event)} activeOpacity={1}>
                <View style={styles.eventItemStyle}>
                    {/* <ProgressiveImage
                        style={styles.eventImageStyle}
                        uri={event.event_photo}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} /> */}
                    <CachedImage
                        style={styles.eventImageStyle}
                        source={{
                            uri: event.event_photo
                        }}
                        fallbackSource={Images.placeholderMediaImage}
                    />
                    <View style={styles.viewEventNameStyle}>
                        <Text style={styles.textEventName} numberOfLines={1}>
                            {event.title}
                        </Text>
                        <Text style={styles.textEventInfo}>
                            {Utility.getEventFormatDate(event.event_datetime, false) + ' to ' + Utility.getEventFormatDate(event.event_endtime, true) + " - " + event.address}
                        </Text>
                    </View>
                    <View style={styles.viewPriceCart}>
                        <Text style={styles.textPriceCart} numberOfLines={1}>
                            {Utility.DOLLOR}{Utility.parseFloat(event.price)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    //TopbarView tooltip menu Click event
    onMenuItemClick(item) {
        // if (item.title == kEVENTS) {
        //     Utility.push('EventViewController')
        // } else {
        //     this.setState({ topbarTitle: item.title, selectedsegmentID: 0 }, () => {
        //         if (this.state.topbarTitle == kARTWORK) {
        //             this.getArtworksAPI()
        //         } else if (this.state.topbarTitle == kARTIST) {
        //             this.getArtistsAPI()
        //         }
        //     })
        // }
        this.setState({
            isDataReceived: false, topbarTitle: item.title
            // , selectedsegmentID: 0 
        }, () => {
            if (this.state.topbarTitle == kARTWORK) {
                this.getArtworksAPI()
            } else if (this.state.topbarTitle == kARTIST) {
                this.getArtistsAPI()
            } else if (this.state.topbarTitle == kEVENTS) {
                var reqParam = {
                    'user_id': Utility.getUserId + '',
                    'page': '1',
                    'month': Utility.getCurrentMonthNumber() + '',
                    'year': Utility.getCurrentYear() + ''
                }
                this.callEventList(reqParam)
            }
        })
    }

    //auto suggestion flat list cell did tap event
    onAutoSuggestionTextDidTapped(item, index) {
        Utility.hideKeyboard()
        this.setState({ search: item, suggestionRowDidTapped: true }, this.state.topbarTitle == kARTWORK ? () => this.getArtworksAPI() : () => this.getArtistsAPI())
        setTimeout(() => {
            this.setState({
                suggestionRowDidTapped: false,
                arrSearchResult: []
            });
        }, 1000);
    }

    //Artwork Flatlist cell tap event
    onArtworkCellDidTapped(artwork) {
        if (artwork != undefined) {
            Utility.push('ArtDetailViewController', {
                artwork_id: artwork.artwork_id,
                isReported: artwork.is_reported,
                isFromHomeScreen: true, // Detail screen is open in many places so need to check and put condition for childScreenCallback
                childScreenCallback: this.childScreenCallback.bind(this)
            })
        }
    }

    childScreenCallback(artwork) {
        if (artwork != undefined) {
            var tempArtworkList = this.state.arrArtworkList;
            const index = tempArtworkList.findIndex(item => item.artwork_id === artwork.artwork_id);
            // console.log('BEFORE: ', tempArtworkList[index])
            tempArtworkList[index] = artwork;
            // console.log('AFTER: ', artwork)
            this.setState({ arrArtworkList: tempArtworkList })
        }
    }

    onTopBarSearchTapped() {
        this.setState({ isSearchButtonTapped: true, suggestionRowDidTapped: false })
    }
    onSearchClick() {
        Utility.hideKeyboard()
        this.setState({ suggestionRowDidTapped: true }, this.state.topbarTitle == kARTWORK ? () => this.getArtworksAPI() : () => this.getArtistsAPI())
    }
    btnCloseClick() { // search button close event
        this.setState({ isSearchButtonTapped: false, search: '', arrSearchResult: [] }, this.state.topbarTitle == kARTWORK ? () => this.getArtworksAPI() : () => this.getArtistsAPI())
    }

    //Artwork Flatlist cell tap event
    onArtistCellDidTapped(artistId) {
        Utility.push('ArtistDetailViewController', { artist_id: artistId })
    }

    // Favorite Artwork
    callSaveArtworkAPI(artwork, index) {
        if (Utility.user == undefined) {
            Utility.showLoginAlert();
        } else {
            this.setState({ spinnerVisible: true });
            WebClient.postRequest(Settings.URL.SAVE_ARTWORK, {
                'user_id': Utility.user.user_id + '',
                'artwork_id': artwork.artwork_id + '',
                'artist_id': artwork.user_id + '',
            }, (response, error) => {
                this.setState({ spinnerVisible: false });
                if (error == null) {
                    var tempArray = this.state.arrArtworkList;
                    tempArray[index].is_saved = (this.state.arrArtworkList[index].is_saved == 1 ? 0 : 1)
                    this.setState({ arrArtworkList: tempArray })
                } else {
                    Utility.showToast(error.message);
                }
            });
        }
    }

    btnCartTapped(artwork, index) {
        // if (Utility.user == undefined) {
        //     Utility.showLoginAlert();
        // } else {
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.getUserId + '',
            'artwork_id': artwork.artwork_id + '',
            'quantity': '1',// default 
            'cart_id': '0',// 0 for new add 
            'unique_device_id': Utility.deviceId + '',
        };
        WebClient.postRequest(Settings.URL.ADD_TO_CART, params, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray[index].is_incart = 1;
                tempArray[index].cart_id = response.cart_id;
                this.setState({ arrArtworkList: tempArray })
                Utility.showToast(Utility.MESSAGES.added_to_cart);
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }
    // }

    removeFromCart(cart, index) {
        // if (Utility.user == undefined) {
        //     Utility.showLoginAlert();
        // } else {
        this.setState({ spinnerVisible: true });
        var reqParm = {
            'user_id': Utility.getUserId + '',
            'cart_id': cart.cart_id + '',
            'is_custom_job': '0',
            'unique_device_id': Utility.deviceId + '',
        }
        WebClient.postRequest(Settings.URL.REMOVE_FROM_CART, reqParm, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var tempArray = this.state.arrArtworkList;
                tempArray[index].is_incart = 0;
                this.setState({ arrArtworkList: tempArray })
                Utility.showToast(Utility.MESSAGES.removed_from_cart);
            } else {
                Utility.showToast(error.message);
            }
        }, false);
        // }
    }

    onShareTapped(artwork) {
        // if (Utility.user == undefined) {
        //     Utility.showLoginAlert();
        // } else {
        var shareContent = artwork.title + "\n\n";
        shareContent = shareContent + artwork.full_name + "\n\n";
        if (artwork.artwork_photos) {
            if (artwork.artwork_photos.length > 0) {
                shareContent = shareContent + artwork.artwork_photos[0].image_path + "\n\n";
            }
        }
        shareContent = shareContent + artwork.description;
        UtilityController.shareRefLink(shareContent);
        // if (artwork.is_shared == 0) {
        //     this.shareArtworkAPI(artwork, index);
        // }
        // }
    }

    // shareArtworkAPI(artwork, index) {
    //     console.log("" + 'user_id ' + Utility.user.user_id)
    //     console.log("" + 'artwork_id ' + artwork.artwork_id)
    //     var reqParm = {
    //         'user_id': Utility.user.user_id,
    //         'artwork_id': artwork.artwork_id,
    //     }
    //     this.setState({ spinnerVisible: true });
    //     WebClient.postRequest(Settings.URL.SHARE_ARTWORK, reqParm, (response, error) => {
    //         this.setState({ spinnerVisible: false });
    //         if (error == null) {
    //             var tempArray = this.state.arrArtworkList;
    //             tempArray[index].is_shared = (this.state.arrArtworkList[index].is_shared == 0 ? 1 : 0)
    //             this.setState({ arrArtworkList: tempArray })
    //         } else {
    //             Utility.showToast(error.message);
    //         }
    //     });
    // }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <TopbarView
                    title={this.state.topbarTitle}
                    isLeftItemTypeLogo={true}
                    showSearchBtn={this.state.topbarTitle != kEVENTS ? true : false}
                    isTitleTappable={true}
                    onMenuClick={this.onMenuItemClick.bind(this)}
                    onSearchTapped={() => this.onTopBarSearchTapped()}>
                </TopbarView>
                {this.state.isSearchButtonTapped == true ? // Check if search button tapped and show search field                
                    <View style={styles.searchView}>
                        <Image source={Images.searchLight} />
                        <TextField
                            inputStyle={styles.inputText}
                            wrapperStyle={styles.inputWrapper}
                            placeholderTextColor={Colors.lightGray3Color}
                            placeholder={"Search here"}
                            textColor={Colors.topTitle}
                            borderColor={'transparent'}
                            selectionColor={Colors.blueType1}
                            onChangeText={(search) => this.setState({ search }, () => this.searchKeywordsAPI())}
                            value={this.state.search}
                            returnKeyType="search"
                            autoFocus={true}
                            onSubmitEditing={() => this.onSearchClick()}
                        />
                        <INTButton buttonStyle={styles.btnClose} icon={Images.searchClose} onPress={() => this.btnCloseClick()} />
                    </View>
                    :
                    null
                }
                {/* seperator below topbar view */}
                <View style={{ backgroundColor: Colors.topBarSeparator, width: Utility.screenWidth, height: 1.5 }} />
                {
                    this.state.topbarTitle != kEVENTS ?
                        <View style={styles.subContainer}>
                            {
                                (this.state.topbarTitle != kEVENTS)
                                    ?
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
                                            this.setState({ isDataReceived: false, selectedsegmentID: segmentID },
                                                () => {
                                                    this.state.topbarTitle == kARTWORK ? this.getArtworksAPI() : this.getArtistsAPI()
                                                })
                                        }}
                                    /> : null
                            }

                            {
                                (this.state.topbarTitle != kEVENTS) ?
                                    (this.state.isRecordAvailable) ? // check if records available otherwise show no records label
                                        <FlatList // Artwork OR Artist FlatList
                                            onEndReachedThreshold={0.5}
                                            // onEndReached={() => this.endOfFlatlist()}
                                            style={styles.gridViewComponentStyle}
                                            data={
                                                this.state.topbarTitle == kARTWORK ? this.state.arrArtworkList : this.state.arrArtistList
                                            }
                                            renderItem={
                                                this.state.topbarTitle == kARTWORK ? this.renderArtworkViewCell.bind(this) : this.renderArtistViewCell.bind(this)
                                            }
                                            numColumns={2}
                                            extraData={this.state}
                                            keyExtractor={(item, index) => index + ''}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                        />
                                        :

                                        this.state.isDataReceived ?
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                            : null
                                    : null
                            }
                        </View>
                        : null
                }
                {/* check if search button tapped, search suggestion has records and suggestionDidTapped == false */}
                {(this.state.isSearchButtonTapped == true && this.state.arrSearchResult.length > 0 && this.state.suggestionRowDidTapped == false) ?
                    <View style={styles.autoSuggestionContainer}>
                        <FlatList // Search suggestion list
                            keyboardShouldPersistTaps='always'
                            style={{ backgroundColor: Colors.grayType1 }}
                            data={this.state.arrSearchResult}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity onPress={() => this.onAutoSuggestionTextDidTapped(item, index)}>
                                    <View style={styles.autoSuggestionRowItem} >
                                        <Text style={{ color: Colors.grayTextColor }}>
                                            {item}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            }
                            ItemSeparatorComponent={() => <View style={styles.saperatorStyle} />}
                            numColumns={1}
                            extraData={this.state}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        />
                    </View> : null
                }

                {/* EVENTS */}
                {
                    (this.state.topbarTitle == kEVENTS) ?
                        <View style={styles.subContainer}>
                            <Calendar
                                style={styles.calendar}
                                onDayLongPress={this.onDayLongPress}
                                onMonthChange={(object) => this.onMonthChange(object)}
                                hideExtraDays
                                minDate={'2017-01-01'}
                                markingType={'custom'}
                                markedDates={this.state.dictMarkedMonthDays}
                                hideArrows={false}
                                onDayPress={(object) => this.onDayChange(object)}
                                theme={{
                                    dayTextColor: Colors.themeColor,
                                    textSectionTitleColor: Colors.themeColor,
                                    textDayHeaderFontFamily: Fonts.promptRegular,
                                    selectedDayBackgroundColor: Colors.themeColor,
                                    todayTextColor: Colors.blueType2,
                                    arrowColor: 'black',
                                    monthTextColor: Colors.blueType2,
                                    textDayFontFamily: Fonts.promptRegular,
                                    textDayFontSize: 14,
                                    textMonthFontFamily: Fonts.promptBold,
                                    textMonthFontWeight: '600',
                                    textMonthFontSize: 14,
                                }}
                            />

                            {this.state.topbarTitle == kEVENTS
                                ? this.state.arrMonthEventList.length > 0 ?
                                    <FlatList
                                        style={styles.listViewCellStyle}
                                        data={
                                            this.state.arrMonthEventList
                                        }
                                        renderItem={
                                            this.renderEventListViewCell.bind(this)
                                        }
                                        numColumns={1}
                                        extraData={this.state}
                                        keyExtractor={(item, index) => index + ''}
                                        ref={el => this.list = el}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                    /> :
                                    this.state.isDataReceived ?
                                        <Text style={styles.txtNoEventFoundStyle}>No events found</Text>
                                        : null
                                : null}
                        </View>
                        : null}
                {this.state.isSearchButtonTapped == true ? null : <Spinner visible={this.state.spinnerVisible} />}
            </SafeAreaView >

        );
    }
}
export default HomeViewController

