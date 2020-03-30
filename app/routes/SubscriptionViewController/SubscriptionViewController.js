import React, { Component } from 'react';
import { Text, View, Platform, Image, TouchableOpacity, Alert, NativeModules, FlatList } from 'react-native';
import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import INTButton from '../../component/INTButton'
import SafeAreaView from '../../component/SafeAreaView';
import Spinner from 'react-native-loading-spinner-overlay';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import User from '../../models/User';
const InAppBilling = require("react-native-billing");
const { InAppUtils } = NativeModules
import iapReceiptValidator from 'iap-receipt-validator';

const YEARLY_SUBSCRIPTION_IDENTIFIER_IOS = 'com.artwork.yearly';
const identifiers = [
    YEARLY_SUBSCRIPTION_IDENTIFIER_IOS,
];
// const YEARLY_SUBSCRIPTION = 'com.locart.premiumscbscription';
// const YEARLY_SUBSCRIPTION = 'com.locart.yearlysubscription';
const YEARLY_SUBSCRIPTION = 'com.locart.annualsubscription';
class SubscriptionViewController extends Component {
    constructor(props) {
        super(props);
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            artist_access_code: "",
            subscription_type: Utility.user != undefined ? Utility.user.subscription_type : "",
            expiry_date: Utility.user != undefined ? Utility.user.expiry_date : 0,
            spinnerVisible: false,
            isSubscribe: true,//Defalut true
            featuresList: [
                { name: 'Post your artworks for sale' },
                { name: 'Receive commission request ' },
                { name: 'Manage your business       ' },
                { name: 'Transfer profits into your bank account' },
            ]
        };
    }

    componentDidMount() {
        var context = this;
        if (Utility.isPlatformAndroid) {
            InAppBilling.open();
            InAppBilling.getSubscriptionTransactionDetails(YEARLY_SUBSCRIPTION).then(
                details => {
                    console.log('SUBSCRIPTION CHECK FIRSTTIME ', details);
                    this.setState({ isSubscribe: details.autoRenewing })

                    if (Utility.user != undefined) {
                        context.subscriptionAPI(context.getAndroidParams(details));
                    }
                    return InAppBilling.close();
                }).catch(function (rej) {
                    //here when you reject the promise
                    console.log('REJECT', rej);
                    this.setState({ isSubscribe: false })
                    return InAppBilling.close();
                });
        }
        // else {
        //     this.getiOSReceiptData();
        // }
    }

    leftBtnTaaped() {
        if (this.props.isFromNotSubscribe) {
            if (this.props.isFromNotSubscribe == true) {
                this.props.onSubscriptionCallBack({ isSuccess: true })
                this.props.navigator.pop({ animated: true, });
            } else {
                Utility.navigator.pop({ animated: true, });
            }
        } else {
            Utility.navigator.pop({ animated: true, });
        }
    }

    subscribeTapped() {
        // InAppBilling.subscribe("your.inapp.productid").then(details => {
        //     console.log('SUBSCRIPTION DETAILS ', details);
        // });
        this.setState({ spinnerVisible: true });
        var context = this;
        if (Utility.isPlatformAndroid) {
            InAppBilling.open()
                .then(() => InAppBilling.subscribe(YEARLY_SUBSCRIPTION))
                .then(details => {
                    console.log("You purchased: ", details);
                    context.setState({ isSubscribe: details.autoRenewing, spinnerVisible: false })
                    context.subscriptionAPI(context.getAndroidParams(details));
                    return InAppBilling.close();
                })
                .catch(function (rej) {
                    //here when you reject the promise
                    console.log('REJECT', rej);
                    context.setState({ isSubscribe: false, spinnerVisible: false })
                    return InAppBilling.close();
                });
        } else {
            this.iOSSubscription();
        }
    }

    iOSSubscription() {
        var context = this;
        InAppUtils.canMakePayments((enabled) => {
            if (enabled) {
                InAppUtils.loadProducts(identifiers, (error, products) => {
                    console.log(products);
                    console.log('products error', error);
                    InAppUtils.canMakePayments((canMakePayments) => {
                        if (!canMakePayments) {
                            context.setState({ spinnerVisible: false })
                            Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
                        } else {
                            InAppUtils.purchaseProduct(identifiers[0], (error, response) => {
                                // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                                console.log('purchaseProduct error', error)
                                if (response && response.productIdentifier) {
                                    // Alert.alert('Purchase Successful', 'Your Transaction ID is ' + response.transactionIdentifier);
                                    //unlock store here.
                                    console.log('*************** iOS ****************')
                                    context.getiOSReceiptData();
                                } else {
                                    context.setState({ spinnerVisible: false })
                                }
                            })
                        }
                    })
                });
            } else {
                Alert.alert('IAP disabled');
            }
        });
    }

    getiOSReceiptData() {
        try {
            InAppUtils.receiptData((error, receiptData) => {
                console.log('*************** receiptData ****************', receiptData)
                if (error) {
                    console.log('receiptData error', error)
                } else {
                    this.getiOSSubscriptionReceipt(receiptData);
                }
            });
        } catch (err) {
            console.log('InAppUtils.receiptData Error', err.valid, err.error, err.message)
        }
    }

    getiOSSubscriptionReceipt(receiptData) {
        var context = this;
        context.setState({ spinnerVisible: true })
        const password = '351f741ddd95410290d72df3a1a5615f'; // Shared Secret from iTunes connect
        const production = false; // use sandbox or production url for validation
        const validateReceipt = iapReceiptValidator(password, production);
        console.log('*************** validate ****************')
        try {
            const validationData = validateReceipt(receiptData);
            var today = new Date().getTime()
            validationData
                .then(function (result) {
                    console.log("*************** controller unmatched: ", result.latest_receipt_info[result.latest_receipt_info.length - 1].expires_date_ms, today);
                    if (result.latest_receipt_info[result.latest_receipt_info.length - 1].expires_date_ms > today) {
                        console.log('*************** Subscribed ****************', result)
                        context.subscriptionAPI(context.getiOSParams(result.latest_receipt_info[result.latest_receipt_info.length - 1]));
                        //Do something with subscribed
                    } else {
                        //Do something with unsubscribed
                        console.log('*************** Un - Subscribed ****************')
                        context.setState({})
                    }
                    context.setState({ spinnerVisible: false })
                })
                .catch(function (rej) {
                    //here when you reject the promise
                    console.log('REJECT', rej);
                    context.setState({ spinnerVisible: false })
                });
            // check if Auto-Renewable Subscription is still valid
            // validationData['latest_receipt_info'][0].expires_date > today
        } catch (err) {
            console.log('validationData error', err.valid, err.error, err.message)
            context.setState({ spinnerVisible: false })
        }
    }
    restoreSubscribeTapped() {
        var context = this;
        context.setState({ spinnerVisible: true })
        var isOneTimeCall = false;
        InAppUtils.restorePurchases((error, response) => {
            if (error) {
                context.setState({ spinnerVisible: false })
                Alert.alert('itunes Error', 'Could not connect to itunes store.');
            } else {
                // Alert.alert('Restore Successful', 'Successfully restores all your purchases.');

                if (response.length === 0) {
                    context.setState({ spinnerVisible: false })
                    Alert.alert('No Purchases', "We didn't find any purchases to restore.");
                    return;
                }

                response.forEach((purchase) => {
                    if (purchase.productIdentifier === YEARLY_SUBSCRIPTION_IDENTIFIER_IOS) {
                        console.log('RESTORED RESPONSE: ', JSON.stringify(purchase))
                        // var purchaseData = JSON.stringify(purchase);
                        // Alert.alert('Restored Success', purchaseData);
                        // this.getiOSSubscriptionReceipt(purchaseData.transactionReceipt);
                        if (isOneTimeCall == false) {
                            isOneTimeCall = true;
                            this.getiOSReceiptData();
                        }
                        // Handle purchased product.
                    }
                });
            }
        });
    }
    getiOSParams(subscriptiondata) {
        var params = {};
        params.order_id = subscriptiondata.original_transaction_id + '';
        params.product_id = subscriptiondata.product_id + '';
        params.is_subscription_running = '';
        params.subscription_date = subscriptiondata.original_purchase_date_ms + '';
        params.purchase_token = '';
        params.expiry_date = subscriptiondata.expires_date_ms + '';
        params.transaction_id = subscriptiondata.transaction_id + '';
        params.device_type = Platform.OS + ''
        params.user_id = Utility.user.user_id + '';
        return params;
    }
    getAndroidParams(subscriptiondata) {
        var params = {};
        params.order_id = subscriptiondata.orderId + '';
        params.product_id = subscriptiondata.productId + '';
        params.is_subscription_running = subscriptiondata.autoRenewing + '';
        var myDate = new Date(subscriptiondata.purchaseTime);
        var result = myDate.getTime();
        params.subscription_date = result + '';
        params.purchase_token = subscriptiondata.purchaseToken + '';
        params.expiry_date = '';
        params.transaction_id = '';
        params.device_type = Platform.OS + ''
        params.user_id = Utility.user.user_id + '';
        return params;
    }
    subscriptionAPI(params) {
        // var params = {};
        // if (Utility.isPlatformAndroid) {
        //     params.order_id = subscriptiondata.orderId + '';
        //     params.product_id = subscriptiondata.productId + '';
        //     params.is_subscription_running = subscriptiondata.autoRenewing + '';
        //     params.subscription_date = subscriptiondata.purchaseTime + '';
        //     params.purchase_token = subscriptiondata.purchaseToken + '';
        //     params.expiry_date = '';
        //     params.transaction_id = '';
        // }
        // params.device_type = Platform.OS + ''
        // params.user_id = Utility.user.user_id + '';
        this.setState({ spinnerVisible: true });

        WebClient.postRequest(Settings.URL.ADD_SUBSCRIPTION, params, (response, error) => {
            // this.setState({ spinnerVisible: false });
            if (error == null) {
                // Utility.showToast('You ');
            } else {
                Utility.showToast(error.message);
            }
            setTimeout(() => {
                this.getProfileInfo();
            }, 500);
        }, true);
    }
    // ProfileInfo API
    getProfileInfo() {
        // this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_PROFILE_INFO, {
            'user_id': Utility.user.user_id + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    User.save(response);
                    Utility.user = new User(response);
                    this.setState({
                        subscription_type: Utility.user.subscription_type,
                        expiry_date: Utility.user.expiry_date,
                    })
                }
            } else {
                Utility.showToast(error.message);
                if (error.code == -1) {
                    setTimeout(() => {
                        this.removeUser();
                    }, 3000);
                }
            }
            // this.setState({ spinnerVisible: false });
        }, true);
    }
    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackBlue} />
                                <Text style={styles.titleTextStyle}>SUBSCRIPTION</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView
                        extraScrollHeight={20}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 10, flex: 1 }}>
                            <View style={{ marginHorizontal: 5 }}>
                                {this.state.subscription_type != Utility.SUBSCRIPTION_TYPE.NOT_SUBSCRIBE ?
                                    <View>
                                        <Text style={styles.txtDateTitle}>{this.state.subscription_type == Utility.SUBSCRIPTION_TYPE.FREE_TRIAL ? "Free Trial" : "Subscription"} Expire on</Text>
                                        <Text style={styles.txtDate}>{Utility.getFormatedDate(this.state.expiry_date)}</Text>
                                    </View>
                                    : null
                                }
                                <View style={{ marginTop: 30 }}>
                                    <Text style={styles.txtFeaturesTitle}>Enjoy Below Premium Features</Text>
                                    <Text style={styles.txtFeaturesTitle}>for Only $49.99/Year</Text>
                                </View>
                                <View style={{ marginTop: 20, alignItems: 'center' }}>
                                    {this.getFlatListOf(this.state.featuresList)}
                                    {/* <Text style={styles.txtBullet}>{`\u2022`}<Text style={styles.txtFeatures}>  Post your artworks for sale</Text></Text>
                                    <Text style={styles.txtBullet}>{`\u2022`}<Text style={styles.txtFeatures}>  Receive commission request </Text></Text>
                                    <Text style={styles.txtBullet}>{`\u2022`}<Text style={styles.txtFeatures}>  Manage your business       </Text></Text>
                                    <Text style={styles.txtBullet}>{`\u2022`}<Text style={styles.txtFeatures}>  Transfer profits into your bank account</Text></Text> */}
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    {
                        this.state.subscription_type == Utility.SUBSCRIPTION_TYPE.NOT_SUBSCRIBE ?
                            <View style={{ marginTop: 25, alignItems: 'flex-end', paddingVertical: 10, flexDirection: 'row' }}>
                                < INTButton buttonStyle={{ marginHorizontal: 2, flex: 1, paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                    title='Subscribe'
                                    titleStyle={styles.buttonTitleStyle}
                                    onPress={() => this.subscribeTapped()}
                                />
                                {
                                    Utility.isPlatformAndroid ? null : <INTButton buttonStyle={{ marginHorizontal: 2, flex: 1, paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                        title='Restore'
                                        titleStyle={styles.buttonTitleStyle}
                                        onPress={() => this.restoreSubscribeTapped()}
                                    />
                                }
                            </View>
                            : null
                    }
                    {
                        Utility.isPlatformAndroid ?
                            null :
                            <Text style={styles.txtIOSDeclaration}>*Payment will be changed to your iTunes Account at confirmation of purchase. Account will be changed for renewal within 24-hours prior to the end of the subscription period. Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period. Auto-renewable subscription settings may be turned off by going to your account settings after purchase.</Text>
                    }
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
    getFlatListOf(array) {
        return (<FlatList
            style={{ alignSelf: 'center' }}
            data={array}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />)
    }
    renderItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.paraTxtItemDot}>{'\u2022 '}</Text>
                <Text style={styles.paraTxtItem}>{item.name}</Text>
            </View>
        )
    }
}
export default SubscriptionViewController