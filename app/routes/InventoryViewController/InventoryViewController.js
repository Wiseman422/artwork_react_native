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
import SafeAreaView from '../../component/SafeAreaView';
import { CachedImage } from 'react-native-cached-image';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Fonts from '../../config/Fonts';
import Spinner from 'react-native-loading-spinner-overlay';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

let LISTED = 0;
let SOLD = 1;
class InventoryViewController extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            currentState: LISTED,
            spinnerVisible: false,

            arrListedArtworks: [],
            listedInventoryPage: 1,
            listedInventoryTotalRecords: 0,

            arrSoldArtworks: [],
            soldInventoryPage: 1,
            soldInventoryTotalRecords: 0,
            isDataReceived: false,
        };
    }
    componentDidMount() {
        this.getListedArtworks();
    }

    /////////////////////////////////////////   LISTED LIST START  ///////////////////////////////////////////////

    leftBtnTaaped() {
        this.props.navigator.pop();
    }
    checkCurrentState(state) {
        return (this.state.currentState == state)
    }
    btnCurrentClick() {
        this.setState({ isDataReceived: false, currentState: LISTED });
        this.getListedArtworks();
    }
    btnPastOrderClick() {
        this.setState({ isDataReceived: false, currentState: SOLD });
        this.getSoldArtworks();
    }
    //API
    getListedArtworks() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_ARTIST_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            "page": this.state.listedInventoryPage + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ isDataReceived: true, arrListedArtworks: this.state.listedInventoryPage > 1 ? [...this.state.arrListedArtworks, ...response.result] : response.result, listedInventoryTotalRecords: response.totalcount })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfListedArtworkFlatList() {
        if (this.state.arrListedArtworks.length < this.state.listedInventoryTotalRecords) {
            this.setState({
                spinnerVisible: true,
                listedInventoryPage: this.state.listedInventoryPage + 1
            }, this.getListedArtworks.bind(this))
        }
    }

    //Remove Artwork tapped
    removeArtworkConfirmation(position, artwork, rowMap, index) {
        Utility.hideKeyboard();
        Alert.alert(
            'Remove Artwork',
            'Are you sure you want to remove artwork?',
            [
                { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                { text: 'Yes', onPress: () => this.deleteListedArtworkRow(position, artwork, rowMap, index) },
            ],
            { cancelable: true }
        )
    }

    closeListedArtworkRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteListedArtworkRow(position, artwork, rowMap, index) {
        this.closeListedArtworkRow(rowMap, index);
        this.removeArtwork(artwork, position);
    }

    // onRowDidOpen = (rowKey, rowMap) => {
    //     console.log('This row opened', rowKey);
    //     setTimeout(() => {
    //         this.closeListedArtworkRow(rowMap, rowKey);
    //     }, 100);
    // }

    //API 
    removeArtwork(artwork, position) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.REMOVE_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                const newData = [...this.state.arrListedArtworks];
                // const prevIndex = this.state.arrListedArtworks.findIndex(item => item.key === index);
                // newData.splice(prevIndex, 1);
                if (newData.length > position)
                    newData.splice(position, 1);
                this.setState({ arrListedArtworks: newData });
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    editArtwork(artwork, rowMap, index) {
        console.log("ART IDDDD " + artwork.artwork_id);
        Utility.push('NewArtworkViewController', { artwork_id: artwork.artwork_id })
    }


    onArtworkTapped(artwork) {
        Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id, from: 'SOLD' })
    }

    renderListedArtworksViewCell(rowData, secId, rowId, rowMap) {
        var artwork = rowData
        var position = rowId;
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={150}
                rightOpenValue={-150}>
                <View style={styles.rowBack}>
                    {/*<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={_ => this.closeRow(rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.backTextWhite}>Close</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={_ => this.editArtwork(artwork, rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.textEdit}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.removeArtworkConfirmation(position, artwork, rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.textRemove}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.onArtworkTapped(artwork)} activeOpacity={1}>
                    <View style={styles.cartItemStyle}>
                        {/* <ProgressiveImage
                            style={styles.artImageStyle}
                            uri={artwork.artwork_photos != null ? artwork.artwork_photos.length > 0 ? artwork.artwork_photos[0].thumb_name : undefined : undefined}
                            placeholderSource={Images.placeholderMediaImage}
                            borderRadius={1} /> */}
                        <CachedImage
                            style={styles.artImageStyle}
                            source={{
                                uri: artwork.artwork_photos != null ? artwork.artwork_photos.length > 0 ? artwork.artwork_photos[0].thumb_name : undefined : undefined
                            }}
                            fallbackSource={Images.placeholderMediaImage}
                        />
                        <View style={styles.viewArtNameStyle}>
                            <Text style={styles.textArtName} numberOfLines={1}>
                                {artwork.title}
                            </Text>
                            <Text style={styles.textArtistName} numberOfLines={1}>
                                {artwork.project_type}
                            </Text>
                        </View>
                        <View style={styles.viewPriceCart}>
                            <Text style={styles.textPriceCart} numberOfLines={1}>
                                {Utility.DOLLOR}{Utility.parseFloat(artwork.price)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </SwipeRow>
        );
    }

    /////////////////////////////////////////   LISTED LIST END  ///////////////////////////////////////////////

    /////////////////////////////////////////   SOLD LIST START  ///////////////////////////////////////////////
    //API
    getSoldArtworks() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_SOLD_ARTWORK, {
            'user_id': Utility.user.user_id + '',
            'page': this.state.soldInventoryPage + ''
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setState({ isDataReceived: true, arrSoldArtworks: this.state.soldInventoryPage > 1 ? [...this.state.arrSoldArtworks, ...response.result] : response.result, soldInventoryTotalRecords: response.totalcount })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    endOfSoldArtworkFlatList() {
        if (this.state.arrSoldArtworks.length < this.state.soldInventoryTotalRecords) {
            this.setState({
                spinnerVisible: true,
                soldInventoryPage: this.state.soldInventoryPage + 1
            }, this.getSoldArtworks.bind(this))
        }
    }

    renderSoldArtworksViewCell(rowData, secId, rowId, rowMap) {
        var soldArtworks = rowData
        var index = rowId;
        var imageUrl = soldArtworks.artwork_photos != null ? (soldArtworks.artwork_photos.length > 0 ? soldArtworks.artwork_photos[0].thumb_name : undefined) : undefined

        // console.log("**** Image url ===" +  imageUrl)
        return (
            <SwipeRow
                disableRightSwipe={(soldArtworks.order_status_id == Utility.OrderStatus.COMPLETED
                    || soldArtworks.order_status_id == Utility.OrderStatus.CANCELLED
                    || soldArtworks.order_status_id == Utility.OrderStatus.NONE) ? true : false}
                disableLeftSwipe={(soldArtworks.order_status_id == Utility.OrderStatus.COMPLETED
                    || soldArtworks.order_status_id == Utility.OrderStatus.CANCELLED
                    || soldArtworks.order_status_id == Utility.OrderStatus.NONE) ? true : false}
                leftOpenValue={75}
                rightOpenValue={-75}>
                <View style={styles.rowBack}>
                    <TouchableOpacity style={styles.backLeftBtn} onPress={_ => this.changeOrderStatusConfirmation(soldArtworks, rowMap, `${secId}${rowId}`)}>
                        <Text style={[styles.backLeftBtn]}>{soldArtworks.next_order_status}</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={_ => this.closeRow(rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.backTextWhite}>Close</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={_ => this.rejectArtworkConfirmation(soldArtworks, rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.textReject}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.onArtworkTapped(soldArtworks)} activeOpacity={1}>
                    <View style={styles.orderItemStyle} >
                        {/* <ProgressiveImage
                            style={styles.artImageStyle}
                            uri={soldArtworks.artwork_photos != null ? soldArtworks.artwork_photos.length > 0 ? soldArtworks.artwork_photos[0].thumb_name : undefined : undefined}
                            placeholderSource={Images.placeholderMediaImage}
                            borderRadius={1} /> */}
                        <CachedImage
                            style={styles.artImageStyle}
                            source={{
                                uri: imageUrl
                            }}
                            fallbackSource={Images.placeholderMediaImage}
                        />
                        <View style={styles.viewOrderNumberNShippingStatus}>
                            <Text style={styles.textOrderNumber} numberOfLines={1}>
                                {soldArtworks.title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.textShippingStatus} numberOfLines={1}>
                                    {soldArtworks.product_order_status}
                                </Text>
                                <Text style={styles.textOrderDate} numberOfLines={1}>
                                    {Utility.getDateMMMdd(soldArtworks.created_date)}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.viewPriceOrder}>
                            <Text style={styles.textPriceOrder} numberOfLines={1}>
                                {Utility.DOLLOR}{Utility.parseFloat((soldArtworks.price * soldArtworks.quantity))}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </SwipeRow>
        );
    }

    //Change Order Status tapped
    changeOrderStatusConfirmation(artwork, rowMap, index) {
        this.closeSoldArtworkRow(rowMap, index);
        Utility.hideKeyboard();
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
                this.getSoldArtworks();
            } else {
                Utility.showToast(error.message);
            }
        });
    }


    //Reject Artwork tapped
    rejectArtworkConfirmation(artwork, rowMap, index) {
        this.closeSoldArtworkRow(rowMap, index);
        Utility.hideKeyboard();
        Alert.alert(
            'Reject Order',
            'Are you sure you want to reject order?',
            [
                { text: 'No', onPress: () => console.log("Cancel"), style: 'cancel' },
                { text: 'Yes', onPress: () => this.deleteSoldArtworkRow(artwork) },
            ],
            { cancelable: true }
        )
    }


    closeSoldArtworkRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteSoldArtworkRow(artwork) {
        this.rejectArtwork(artwork);
    }

    // onRowDidOpen = (rowKey, rowMap) => {
    //     console.log('This row opened', rowKey);
    //     setTimeout(() => {
    //         this.closeSoldArtworkRow(rowMap, rowKey);
    //     }, 100);
    // }

    //API
    rejectArtwork(artwork) {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.ORDER_STATUS_UPDATE, {
            'user_id': Utility.user.user_id + '',
            'artwork_id': artwork.artwork_id + '',
            'order_id': artwork.order_id + '',
            'order_status': Utility.OrderStatus.CANCELLED + '',//check order status 1 = inprogress, 2 = packed, 3 = shipped, 4 = completed, 5 = order cancel by artist
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.getSoldArtworks();
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    /////////////////////////////////////////   SOLD LIST  END ///////////////////////////////////////////////

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>INVENTORY</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Header View*/}
                    <View style={styles.viewHeader}>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnCurrentClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(LISTED) ? styles.textSelected : styles.textUnSelected} >Listed</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnPastOrderClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(SOLD) ? styles.textSelected : styles.textUnSelected} >Sold</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewLine}>
                    </View>
                    {/*Card And Order Listing*/}
                    {
                        this.state.isDataReceived ?
                            <KeyboardAwareScrollView
                                style={{ marginTop: 2 }}
                                extraScrollHeight={10}
                                onScroll={this.handleScroll}
                                keyboardShouldPersistTaps={"always"}
                                automaticallyAdjustContentInsets={true}
                                bounces={true}
                                showsVerticalScrollIndicator={false}>
                                {
                                    this.checkCurrentState(LISTED) ?
                                        this.state.arrListedArtworks.length > 0 ? // check if records available otherwise show no records label
                                            <SwipeListView
                                                onEndReachedThreshold={0.5} onEndReached={() => this.endOfListedArtworkFlatList()}
                                                dataSource={this.ds.cloneWithRows(this.state.arrListedArtworks)}
                                                renderRow={(data, secId, rowId, rowMap) => this.renderListedArtworksViewCell(data, secId, rowId, rowMap)}
                                            />
                                            :
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : this.state.arrSoldArtworks.length > 0 ? // check if records available otherwise show no records label
                                            <SwipeListView
                                                onEndReachedThreshold={0.5} onEndReached={() => this.endOfSoldArtworkFlatList()}
                                                dataSource={this.ds.cloneWithRows(this.state.arrSoldArtworks)}
                                                renderRow={(data, secId, rowId, rowMap) => this.renderSoldArtworksViewCell(data, secId, rowId, rowMap)}
                                            />
                                            :
                                            <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                }
                            </KeyboardAwareScrollView>
                            : null
                    }
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default InventoryViewController