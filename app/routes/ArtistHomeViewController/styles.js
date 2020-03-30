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
        marginTop: 10,
        flexDirection: 'row',
        height: Settings.topBarHeight + 25,//+20 Because of Profile picture
    },
    titleView: {
        //marginTop: 25,
        marginRight: 5,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleTextStyle: {
        marginLeft: 10,
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack
    },
    profilePicView: {
        marginTop: 5,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: Colors.transparent,
        marginHorizontal: 8,
    },
    editTextStyle: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginTop: 2,
        textAlign: 'center',
    },
    artistPlaceHolderPhoto: {
        height: 60,
        width: 60,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    // Artist Portal Container
    innerContainerView: {
        marginTop: 20,
        alignItems: 'center',
        flex: 1,
        marginBottom: 30,
    },
    artistPortalText: {
        fontSize: Utility.NormalizeFontSize(23.5),
        fontFamily: Fonts.santanaBold,
        color: Colors.blueType1,
    },
    viewButtonsStyle1: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    buttonStyle: {
        backgroundColor: Colors.grayType1,
        borderColor: Colors.blueType4,
        borderWidth: 0.5,
        flex: 1,
        justifyContent: 'center'
    },
    buttonTitleStyle: {
        fontSize: Utility.NormalizeFontSize(16),
        fontFamily: Fonts.promptLight,
        color: Colors.blueType2,
        textAlign: 'center'
    },
    viewButtonsStyle2: {
        flex: 1,
        marginTop: 10,
        flexDirection: 'row',
    },
    buttonBankInfo: {
        backgroundColor: Colors.grayType1,
        borderColor: Colors.blueType4,
        borderWidth: 0.5,
        marginTop: 10,
        paddingVertical: 6,
        width: Utility.screenWidth,
        marginHorizontal: 8,
        justifyContent: 'center'
    },
});
