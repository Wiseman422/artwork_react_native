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
        color: Colors.themeColor,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack,
    },
    textSelected: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(15),
        flex: 1,
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
    //Cart Item View 
    cartItemStyle: {
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        padding: 3
    },
    btnPlusMinus: {
        backgroundColor: 'transparent',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPlusMinus: {
        color: Colors.blueType1,
        fontSize: 18,
        textAlign: 'center',
        padding: 4,
        fontFamily: Fonts.promptLight,
        //backgroundColor: 'blue',
    },
    viewArtNameStyle: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10
    },
    textArtName: {
        color: Colors.themeColor,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textArtistName: {
        color: Colors.grayTextColor2,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4
    },
    viewPriceCart: {
        //flex: 0.5,
        paddingHorizontal: 10,
        minWidth: 80,
        justifyContent: 'center',
        alignItems: 'flex-end',
        //backgroundColor: 'red',
    },
    textPriceCart: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'right',
        fontSize: Utility.NormalizeFontSize(11),
        marginRight: 8,
    },
    viewQuantity: {
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    textQuantity: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 10,
        minWidth: 20,
        marginHorizontal: 2,
        //backgroundColor: 'green',
    },
    //Past Order
    orderItemStyle: {
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        paddingHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        padding: 3
    },
    viewArtistInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    textArtworkName: {
        color: Colors.themeColor,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textItemArtistName: {
        color: Colors.grayTextColor2,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4
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
    btnChat: {
        backgroundColor: Colors.blueType1,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 60,
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginTop: 6,
    },
    titleChat: {
        color: Colors.white,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(12),
        textAlign: 'center',
        alignSelf: 'center'
    },

});