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
        maxHeight: Utility.screenHeight - 70,
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
    lableNTextfieldViewContainer: {
        justifyContent: 'space-between',
        marginHorizontal: 5,
        marginTop: 15,
    },
    inputText: {        
        backgroundColor: Colors.grayType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptLight,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,        
    },
    cardExpiryNCVVContainer: {
        marginTop: 10,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingHorizontal: 5,
        // backgroundColor: 'red'
    },
    // Checkout Button
    btnChekout: {
        marginTop : 30,
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
    textType: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        textAlign: 'center',
        color: Colors.blueType2,
    },
    viewTextType: {
        padding: 6,
        backgroundColor: Colors.grayType1,
    },
});