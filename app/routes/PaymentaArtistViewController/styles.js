import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 15,
    },
    surfaceView: {
        flex: 1,
    },
    //TopView Style
    topViewStyle: {
        flexDirection: 'row',
    },
    titleView: {
        marginTop: 25,
        paddingVertical: 6,
        flexDirection: 'row',
    },
    viewHeader: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    titleTextStyle: {
        marginLeft: 6,
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack,
    },
    textSelected: {
        backgroundColor: Colors.blueType1,
        color: Colors.white,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(15),
        minWidth: 70,
        paddingHorizontal: 10,
        paddingVertical: 2,
        textAlign: 'center',
        alignSelf: 'center'
    },
    textUnSelected: {
        backgroundColor: Colors.transparent,
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(15),
        minWidth: 70,
        paddingHorizontal: 10,
        paddingVertical: 2,
        textAlign: 'center',
        alignSelf: 'center'
    },
    viewLine: {
        height: 0.7,
        backgroundColor: Colors.blueType4,
        marginTop: 6
    },
    //No Record found
    noRecordsFoundTextStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.lightGray3Color,
        flex: 1,
        textAlign: 'center',
        marginTop: 200,
    },
    //ListView
    listViewCellStyle: {
        marginBottom: 8,
        backgroundColor: Colors.white
    },
    artImageStyle: {
        height: 60,
        width: 80,
        backgroundColor: Colors.transparent,
    },

    //Pending Payment
    orderItemStyle: {
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        padding: 3
    },
    viewOrderNumberNShippingStatus: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    textOrderNumber: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textShippingStatus: {
        color: Colors.grayType6,
        fontFamily: Fonts.promptBold,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4,
    },
    textOrderDate: {
        color: Colors.grayType6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4,
    },
    viewPriceOrder: {
        //flex: 0.5,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPriceOrder: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'right',
        fontSize: Utility.NormalizeFontSize(11),
    },
    textTotalPriceTitle: {
        minWidth: 90,
        textAlign: 'right',
        fontSize: Utility.NormalizeFontSize(13),
        fontFamily: Fonts.montserratLight
    },
    textTotalPrice: {
        minWidth: 90,
        opacity: 0.8,
        textAlign: 'right',
        fontSize: Utility.NormalizeFontSize(13),
        fontFamily: Fonts.montserratLight
    },
    //View
    viewBetTotalNGrandTotal: {
        height: 0.7,
        width: Utility.screenWidth - 40,
        marginTop: 10,
        alignSelf: 'center',
        backgroundColor: Colors.blueType4,
    },
    //Deliver Pickup
    btnDeliveryPickup: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        flex: 1,
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
    },
    titleDeliveryPickup: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
    },
    // Checkout Button
    btnChekout: {
        backgroundColor: Colors.themeColor,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    titleCheckout: {
        color: 'white',
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
    },
    ///////
    backTextWhite: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },
    rowFront: {
        alignItems: 'center',
        justifyContent: 'center',
        // minHeight: 50,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        right: 75
    },
    backRightBtnRight: {
        right: 0
    },
    ///Checkout Modal
    modalContainer: {
        // width: Utility.screenWidth - 20,
        // maxHeight:Utility.screenHeight-150,
        // minHeight:Utility.screenHeight-300, 
        //marginRight:10, 
        //marginLeft:10, 
        // borderTopLeftRadius:5,
        // paddingTop:20,
        // borderTopRightRadius:5,
        backgroundColor: Colors.white,
        width: Utility.screenWidth - 20,
        maxHeight: Utility.screenHeight - 250,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    modalHeaderTextStyle: {
        color: Colors.themeColor,
        fontSize: Utility.NormalizeFontSize(18),
        fontFamily: Fonts.santanaBold,
        alignSelf: 'center',
        paddingVertical: 8,
    },
    closeTextStyle: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.santanaBold,
        padding: 6,
    },
    textGrandTotalCheckout: {
        textAlign: 'center',
        fontSize: Utility.NormalizeFontSize(13),
        fontFamily: Fonts.promptMedium
    },
    titleContainer: {
        flex: 1,
    },
    titleStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType1,
    },
    inputText: {
        marginTop: 6,
        backgroundColor: Colors.grayType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptLight,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,
        // minHeight: 30,
        // maxHeight: 30,
    },
    cardExpiryNCVVContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    // TransferToBank Button
    btnTransferToBank: {
        backgroundColor: Colors.themeColor,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        paddingVertical: 4,
        flex: 1,
    },
    titleTransferToBank: {
        color: 'white',
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
        textAlign:'center'
    },
});