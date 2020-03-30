import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image, Alert } from 'react-native';
import styles from './styles';
import Images from '../../config/Images';
import Colors from '../../config/Colors';
import TextField from '../../component/TextField'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import INTButton from '../../component/INTButton'
import Utility from '../../config/Utility';
import ProgressiveImage from '../../component/ProgressiveImage';
import SafeAreaView from '../../component/SafeAreaView';
class ArtistHomeViewController extends Component {

    constructor(props) {
        super(props);
    }

    leftBtnTaaped() {
        Utility.navigator.pop({
            animated: true,
        });
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
    postNewArtworkTapped() {
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
        Utility.push("NewArtworkViewController");
    }
    paymentTapped() {
        Utility.push("PaymentaArtistViewController");
    }
    inventoryTapped() {
        Utility.push("InventoryViewController");
    }
    commisionsTapped() {
        Utility.push("CommisionsViewController");
    }
    bankInfoTapped() {
        Utility.push("BankInfoViewController");
    }
    //Edit Profile Click
    editProfileTapped() {
        Utility.push('ArtistProfileViewController');
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle} numberOfLines={2}>
                                {(Utility.user.full_name + "").toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.profilePicView}>
                            <TouchableOpacity onPress={this.editProfileTapped.bind(this)} activeOpacity={0.7}>
                                <ProgressiveImage
                                    style={styles.profileImage}
                                    uri={Utility.user != undefined ? Utility.user.profile_pic : undefined}
                                    placeholderSource={Images.input_userphoto}
                                    placeholderStyle={styles.artistPlaceHolderPhoto}
                                    borderRadius={1} />
                                <Text style={styles.editTextStyle}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.innerContainerView}>
                        <Text style={styles.artistPortalText}>Artist Portal</Text>
                        <View style={styles.viewButtonsStyle1}>
                            <INTButton buttonStyle={[styles.buttonStyle, { marginRight: 6 }]}
                                title='Post New Artwork'
                                icon={Images.postNewArtwork}
                                iconPosition='top'
                                spaceBetweenIconAndTitle={15}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => { this.postNewArtworkTapped() }}
                            />
                            <INTButton buttonStyle={[styles.buttonStyle, { marginLeft: 6 }]}
                                title='Manage Inventory'
                                icon={Images.manageInventoryIcon}
                                iconPosition='top'
                                spaceBetweenIconAndTitle={15}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => { this.inventoryTapped() }}
                            />
                        </View>
                        <View style={styles.viewButtonsStyle2}>
                            <INTButton buttonStyle={[styles.buttonStyle, { marginRight: 6 }]}
                                title='View Payments'
                                icon={Images.viewPaymentsIcon}
                                iconPosition='top'
                                spaceBetweenIconAndTitle={15}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => this.paymentTapped()}
                            />
                            <INTButton buttonStyle={[styles.buttonStyle, { marginLeft: 6 }]}
                                title='See Commissions'
                                icon={Images.seeCommissionsIcon}
                                iconPosition='top'
                                spaceBetweenIconAndTitle={15}
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => this.commisionsTapped()}
                            />
                        </View>
                        <INTButton buttonStyle={[styles.buttonBankInfo]}
                            title='Bank Details'
                            titleStyle={styles.buttonTitleStyle}
                            onPress={() => this.bankInfoTapped()}
                        />
                    </View>
                </SafeAreaView>
            </View>
        );

    }
}
export default ArtistHomeViewController