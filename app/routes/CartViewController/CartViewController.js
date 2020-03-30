import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ListView,
    DeviceEventEmitter
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
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';

let CART = 0;
let PAST_ORDERS = 1;
class CartViewController extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            currentState: CART,
            shipping_type: Utility.ShippingType.DELIVERY,
            spinnerVisible: false,
            artworkTotalPrice: 0,
            shippingTotalPrice: 0,
            deliveryTotalPrice: 0,
            grandTotalPrice: 0,
            arrCartList: [],
            arrPastOrderList: [],
            pastOrderPage: 1,
            pastOrderTotalRecords: 0,
            isDataReceived: false,
        };
    }
    componentDidMount() {
        this.getCartList();
    }

    /////////////////////////////////////////   CART LIST START  ///////////////////////////////////////////////

    leftBtnTaaped() {
        DeviceEventEmitter.emit('removeCartItemFromCartListNotification', { isVisible: false });
        this.props.navigator.pop();
    }
    checkCurrentState(state) {
        return (this.state.currentState == state)
    }
    btnCurrentClick() {
        this.setState({ isDataReceived: false, currentState: CART });
        this.getCartList();
    }
    btnPastOrderClick() {
        if (Utility.user == undefined) {
            Utility.showLoginAlert(() => {
                Utility.closeSideMenu();
                // Utility.resetTo('SigninController')
                Utility.push('SigninController', {
                    isFromNotLogin: true,
                    onNavigationCallBack: this.onNavigationCallBack.bind(this)
                })
            });
        } else {
            this.setState({ isDataReceived: false, currentState: PAST_ORDERS });
            this.getPastOrders();
        }
    }
    //API
    getCartList() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_CART, {
            'user_id': Utility.getUserId + '',
            'unique_device_id': Utility.deviceId + '',
        }, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                if (response) {
                    this.setState({
                        arrCartList: response,
                    });
                    this.setTotalPrice(this.state.arrCartList);
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    //
    setTotalPrice(arrCartListTemp) {
        var totalShippingCost = 0;
        var totalDeliveryCost = 0;
        var totalPrice = 0;
        arrCartListTemp.forEach(function (element) {

            if ((element.is_custom_job == 1 && element.job_payment_type == 'onetime') || element.is_custom_job == 0) {
                totalPrice += (element.price * element.quantity);
                if (element.selected_shipping_option == "shipping") {
                    totalShippingCost += element.shipping_cost;
                }

                if (element.selected_shipping_option == "delivery") {
                    totalDeliveryCost += element.delivery_cost;
                }
            }
        }, this);

        this.setState({
            artworkTotalPrice: totalPrice,
            shippingTotalPrice: totalShippingCost,
            deliveryTotalPrice: totalDeliveryCost,
            grandTotalPrice: (totalDeliveryCost + totalShippingCost + totalPrice)
        });
    }


    ////////////  Quantity Update   ////////////
    btnMinusClick(index) {
        var cartList = this.state.arrCartList;
        this.updateItemQuantity(index, cartList, true);
    }
    btnPlusClick(index) {
        var cartList = this.state.arrCartList;
        this.updateItemQuantity(index, cartList, false);
    }
    updateItemQuantity(index, cartList, isMinus) {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.ADD_TO_CART, {
            'user_id': Utility.getUserId + '',
            'artwork_id': cartList[index].artwork_id + '',
            'quantity': (isMinus ? (cartList[index].quantity - 1) : (cartList[index].quantity + 1)) + '',
            'cart_id': cartList[index].cart_id + '',// pass cart id
            'unique_device_id': Utility.deviceId + '',
        }, (response, error) => {
            // this.setState({ spinnerVisible: false });
            if (error == null) {
                if (isMinus) {
                    if (cartList[index].quantity > 1) {
                        cartList[index].quantity = cartList[index].quantity - 1;
                        this.setState({ arrCartList: cartList })
                    }
                } else {
                    if (cartList[index].quantity < 100) {
                        cartList[index].quantity = cartList[index].quantity + 1;
                        this.setState({ arrCartList: cartList })
                    }
                }
                this.setTotalPrice(cartList);
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    //////////// Quantity Update END  ////////////
    btnCheckOutTapped() {
        Utility.hideKeyboard();
        if (this.isValidateForDispatchSelectionOption() == true) {
            //TODO Added
            if (Utility.user == undefined) {
                Utility.showLoginAlert(() => {
                    Utility.closeSideMenu();
                    // Utility.resetTo('SigninController')
                    Utility.push('SigninController', {
                        isFromNotLogin: true,
                        onNavigationCallBack: this.onNavigationCallBack.bind(this)
                    })
                });
            } else {
                Utility.push('CheckoutViewController', {
                    grandTotalPrice: this.state.grandTotalPrice,
                })
            }
        } else {
            Utility.showToast(Utility.MESSAGES.please_select_shipping_type)
        }
    }

    onNavigationCallBack(params) {
        if (params.isSuccess == true) {
            this.getCartList();
        }
    }

    isValidateForDispatchSelectionOption() {
        var flag = true
        this.state.arrCartList.map(function (value, index) {
            if (value.selected_shipping_option == "") {
                flag = false
                return flag;
            }
        })
        return flag;
    }

    btnContactUsTapped() {
        if (Utility.user == undefined) {
            Utility.showLoginAlert(() => {
                Utility.closeSideMenu();
                // Utility.resetTo('SigninController')
                Utility.push('SigninController', {
                    isFromNotLogin: true,
                    onNavigationCallBack: this.onNavigationCallBack.bind(this)
                })
            });
        } else {
            Utility.hideKeyboard();
            Utility.push('SupportViewController');
        }
    }

    closeRow(rowMap, rowKey) {
        // console.log('closeRow INDEX', rowKey);
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    deleteRow(position, cart, rowMap, index) {
        // console.log('DELETE INDEX', position);
        this.closeRow(rowMap, index);
        this.removeFromCart(cart, position);
    }

    removeFromCart(cart, position) {
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.getUserId + '',
            'cart_id': cart.cart_id + '',// pass cart id
            'is_custom_job': cart.is_custom_job + '',
            'unique_device_id': Utility.deviceId + '',
        };
        // console.log('params', params);
        WebClient.postRequest(Settings.URL.REMOVE_FROM_CART, params, (response, error) => {
            // console.log('response', response)
            this.setState({ spinnerVisible: false });
            if (error == null) {
                var arrTemp = [...this.state.arrCartList];
                if (arrTemp.length > position)
                    arrTemp.splice(position, 1);
                this.setState({ arrCartList: arrTemp }, () => this.setTotalPrice(this.state.arrCartList));
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    onRowDidOpen = (rowKey, rowMap) => {
        setTimeout(() => {
            this.closeRow(rowMap, rowKey);
        }, 2000);
    }
    onArtworkTapped(artwork) {
        if (Utility.user == undefined) {
            // Utility.showLoginAlert();
            Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id, from: 'CART' })
        } else {
            if (artwork.is_custom_job == 1) {
                Utility.push('JobDetailViewController', { commission_request_id: artwork.commission_request_id, cart: artwork });
            } else {
                Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id, from: 'CART' })
            }
        }
    }

    updateSelectedDeliveryOption(index, selectedOption) {
        var cartList = this.state.arrCartList
        var cartItem = cartList[index]
        this.selectDispatchSelection(cartItem, index, selectedOption, () => {
            // carItem.selected_shipping_option = selectedOption
            this.setState({ arrCartList: cartList }, () => this.setTotalPrice(this.state.arrCartList))
        })
    }

    //API
    selectDispatchSelection(cartItem, index, shippingOption, completion) {
        var reqParam = {
            'user_id': Utility.getUserId + '',
            'cart_id': cartItem.cart_id + '',
            //'shipping_option': cartItem.selected_shipping_option + ''
            'shipping_option': shippingOption + '',
            'unique_device_id': Utility.deviceId + '',
        }
        this.setState({ spinnerVisible: true });
        // console.log("selectDispatchSelection PARAMS: ", JSON.stringify(reqParam))
        WebClient.postRequest(Settings.URL.ADD_PRODUCT_DELIVERY_TYPE, reqParam, (response, error) => {

            this.setState({ spinnerVisible: false });
            if (error == null) {
                // console.log('option selected', response)
                cartItem.selected_shipping_option = shippingOption
                // var tempArry = [...this.state.arrCartList]
                // tempArry[index] = cartItem
                // this.setState({ arrCartList: tempArry })
                if (completion != undefined) {
                    completion()
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    renderCartViewCell(rowData, secId, rowId, rowMap) {
        var cart = rowData
        var position = rowId;
        return (
            <SwipeRow
                disableRightSwipe={true}
                leftOpenValue={20 + Math.random() * 75}
                rightOpenValue={-75}>
                <View style={styles.rowBack}>
                    <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => this.deleteRow(position, cart, rowMap, `${secId}${rowId}`)}>
                        <Text style={styles.textRemove}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cartItemStyle}>
                    <View style={styles.itemStyle}>
                        {cart.is_custom_job == 1 ? null :
                            <TouchableOpacity onPress={() => this.onArtworkTapped(cart)} activeOpacity={1}>
                                {/* <ProgressiveImage
                                style={styles.artImageStyle}
                                uri={cart.artwork_photos != undefined && cart.artwork_photos.length > 0 ? cart.artwork_photos[0].thumb_name : undefined}
                                placeholderSource={Images.placeholderMediaImage}
                                borderRadius={1} /> */}
                                <CachedImage
                                    style={styles.artImageStyle}
                                    source={{
                                        uri: cart.artwork_photos != undefined && cart.artwork_photos.length > 0 ? cart.artwork_photos[0].thumb_name : undefined
                                    }}
                                    fallbackSource={Images.placeholderMediaImage}
                                />
                            </TouchableOpacity>
                        }
                        <View style={styles.viewArtNameStyle}>
                            <TouchableOpacity onPress={() => this.onArtworkTapped(cart)} activeOpacity={1}>
                                <Text style={styles.textArtName} numberOfLines={1}>
                                    {cart.title}
                                </Text>
                                <Text style={styles.textArtistName} numberOfLines={1}>
                                    {cart.full_name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewPriceCart}>
                            {/*TODO If repetable then show quantity */}
                            {(cart.is_repeatable == 1) ?
                                <View style={styles.viewQuantity}>
                                    <TouchableOpacity onPress={() => Number(cart.quantity) > 1 ? this.btnMinusClick(position) : null} activeOpacity={0.6}>
                                        {/*<Text style={styles.textPlusMinus} onPress={() => this.btnMinusClick(position)}>-</Text>*/}
                                        <Image source={Images.minus} />
                                    </TouchableOpacity>
                                    <Text style={styles.textQuantity} numberOfLines={1}>
                                        {cart.quantity}
                                    </Text>
                                    <TouchableOpacity onPress={() => Number(cart.quantity) < 100 ? this.btnPlusClick(position) : null} activeOpacity={0.6}>
                                        {/*<Text style={styles.textPlusMinus} onPress={() => this.btnPlusClick(position)}>+</Text>*/}
                                        <Image source={Images.plus} />
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                            }
                            <Text style={styles.textPriceCart} numberOfLines={1}>
                                {Utility.DOLLOR}{Utility.parseFloat(cart.price)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.dispatchOptions} >
                        {cart.is_shipping == 1 ? <INTButton
                            title="Shipping"
                            titleStyle={styles.btnTitleOptions}
                            icon={(cart.selected_shipping_option == "shipping") ? Images.radioSelected : Images.radioNotSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => (cart.selected_shipping_option == "shipping") ? null : this.updateSelectedDeliveryOption(position, "shipping")} /> : null}
                        {cart.is_delivery == 1 ? <INTButton
                            title="Delivery"
                            titleStyle={styles.btnTitleOptions}
                            icon={(cart.selected_shipping_option == "delivery") ? Images.radioSelected : Images.radioNotSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => (cart.selected_shipping_option == "delivery") ? null : this.updateSelectedDeliveryOption(position, "delivery")} /> : null}
                        {cart.is_pickup == 1 ? <INTButton
                            title="Pickup"
                            titleStyle={styles.btnTitleOptions}
                            icon={(cart.selected_shipping_option == "pickup") ? Images.radioSelected : Images.radioNotSelected}
                            spaceBetweenIconAndTitle={0}
                            onPress={() => (cart.selected_shipping_option == "pickup") ? null : this.updateSelectedDeliveryOption(position, "pickup")} /> : null}
                    </View>
                </View>
            </SwipeRow>
        );
    }

    /////////////////////////////////////////   CART LIST END  ///////////////////////////////////////////////

    /////////////////////////////////////////   ORDER LIST START  ///////////////////////////////////////////////
    //API
    getPastOrders() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_ORDER_LIST, {
            'user_id': Utility.user.user_id + '',
            "page": this.state.pastOrderPage + ''
        }, (response, error) => {
            this.setState({ isDataReceived: true, spinnerVisible: false });
            if (error == null) {
                this.setState({ arrPastOrderList: this.state.pastOrderPage > 1 ? [...this.state.arrPastOrderList, ...response.result] : response.result, pastOrderTotalRecords: response.totalcount })
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    onEndPastOrderFlatlist() {
        if (this.state.arrArtworkList.length < this.state.totalRecords) {
            this.setState({
                spinnerVisible: true,
                pastOrderPage: this.state.pastOrderPage + 1
            }, this.getPastOrders.bind(this))
        }
    }

    renderPastOrderViewCell(rowData) {
        var order = rowData.item
        // console.log('order', order)
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
                    <View style={styles.viewDateNItemQuantity}>
                        <Text style={styles.textDate} numberOfLines={1}>
                            {Utility.getDateMMMdd(order.order_date)}
                        </Text>
                        <Text style={styles.textItemQuantity} numberOfLines={1}>
                            Item {order.total_items}
                        </Text>
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
    /////////////////////////////////////////   ORDER LIST  END ///////////////////////////////////////////////

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    {/*TOPBAR VIEW*/}
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>CART</Text>
                        </TouchableOpacity>
                    </View>
                    {/*Header View*/}
                    <View style={styles.viewHeader}>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnCurrentClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(CART) ? styles.textSelected : styles.textUnSelected} >Current</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 0.5 }} onPress={() => this.btnPastOrderClick()} activeOpacity={0.6}>
                            <Text style={this.checkCurrentState(PAST_ORDERS) ? styles.textSelected : styles.textUnSelected} >Past Orders</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewLine}>
                    </View>
                    {/*Card And Order Listing*/}
                    <KeyboardAwareScrollView
                        style={{ marginTop: 2 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>

                        {
                            this.checkCurrentState(CART) ?
                                this.state.arrCartList.length > 0 ? // check if records available otherwise show no records label
                                    <SwipeListView
                                        dataSource={this.ds.cloneWithRows(this.state.arrCartList)}
                                        renderRow={(data, secId, rowId, rowMap) => this.renderCartViewCell(data, secId, rowId, rowMap)}
                                    />
                                    :
                                    this.state.isDataReceived ?
                                        <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : null
                                : this.state.arrPastOrderList.length > 0 ? <FlatList // Artwork OR Artist FlatList
                                    style={styles.listViewCellStyle}
                                    data={
                                        this.state.arrPastOrderList
                                    }
                                    renderItem={
                                        this.renderPastOrderViewCell.bind(this)
                                    }
                                    numColumns={1}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index + ''}
                                />
                                    :
                                    this.state.isDataReceived ?
                                        <Text style={styles.noRecordsFoundTextStyle}>No records found</Text>
                                        : null
                        }
                    </KeyboardAwareScrollView>
                    {this.checkCurrentState(CART) ?
                        this.state.arrCartList.length > 0 ?
                            <View style={{ alignItems: 'flex-end', paddingVertical: 10, marginHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Art</Text>
                                    <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.artworkTotalPrice)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4, }}>
                                    <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Shipping</Text>
                                    <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.shippingTotalPrice)}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4, }}>
                                    <Text style={[styles.textTotalPriceTitle, { color: Colors.blueType1 }]}>Delivery</Text>
                                    <Text style={[styles.textTotalPrice, { color: Colors.blueType1 }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.deliveryTotalPrice)}</Text>
                                </View>
                                <View style={styles.viewBetTotalNGrandTotal} />
                                <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 10 }}>
                                    <Text style={[styles.textTotalPriceTitle, { color: Colors.themeColor }]}>Total</Text>
                                    <Text style={[styles.textTotalPrice, { color: Colors.themeColor }]}>{Utility.DOLLOR}{Utility.parseFloat(this.state.grandTotalPrice)}</Text>
                                </View>
                                <INTButton buttonStyle={styles.btnChekout}
                                    title="Checkout"
                                    titleStyle={styles.titleCheckout}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.btnCheckOutTapped()} />
                            </View> : null
                        :
                        <View style={{ alignItems: 'center', paddingVertical: 15, marginHorizontal: 10 }}>
                            <Text style={{ textAlign: 'center', color: Colors.blueType5, marginBottom: 5, fontSize: Utility.NormalizeFontSize(13) }}>Need Help?</Text>
                            <INTButton buttonStyle={styles.btnChekout}
                                title="Contact Us"
                                titleStyle={styles.titleCheckout}
                                spaceBetweenIconAndTitle={0}
                                onPress={() => this.btnContactUsTapped()} />
                        </View>
                    }
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}

export default CartViewController