import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10
    },
    surfaceView: {
        flex: 1,
    },

    //TopView Style
    topViewStyle: {
        marginTop: 10,
        flexDirection: 'row',
        height: Utility.isPlatformAndroid ? (Settings.topBarHeight + 30) : (Settings.topBarHeight + 20),//+20 Because of Profile picture
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleTextStyle: {
        marginLeft: 10,
        color: Colors.green,
        fontSize: Utility.NormalizeFontSize(20),
        fontFamily: Fonts.santanaBlack
    },

    profilePicView: {
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profilePicEditView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage: {
        marginTop: 5,
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: Colors.transparent,
    },
    placeHolderPhotoStyle: {
        height: 60,
        width: 60,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    editTextStyle: {
        color: Colors.green,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginTop: 2,
    },

    textFieldViewContainer: {
        marginTop: 10,
        flexDirection: 'row',
        minHeight: 48,
        justifyContent: 'space-between',
    },
    nameContainer: {
        flex: 1,
    },
    emailContainer: {
        flex: 1,
    },
    phoneContainer: {
        flex: 1,
        marginLeft: 10,
    },

    inputText: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        backgroundColor: Colors.grayType1,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,
    },
    textType: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        textAlign: 'center',
        color: Colors.blueType2,
        marginVertical: 5,
        marginLeft: 5,
        flex: 1,
    },
    viewAddressType: {
        backgroundColor: Colors.grayType1,
        flexDirection: 'row',
        flex: 1
    },
    textStyle: {
        color: Colors.themeColor,
        fontSize: 12,
        fontFamily: Fonts.promptRegular,
    },
    locationAndArtworkStyleContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    modalContainer: {
        backgroundColor: Colors.white,
        width: Utility.screenWidth - 20,
        height: Utility.screenHeight - 250,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    closeTextStyle: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.santanaBold,
        padding: 6,
    },
    viewBottom: {
        borderBottomColor: Colors.lightGray2Color,
        borderBottomWidth: 0.5,
    },
    buttonTitleStyle: {
        color: 'white',
        fontFamily: Fonts.promptRegular,
    },
    textChangepassword: {
        color: Colors.green,
        fontFamily: Fonts.promptRegular,
        fontSize: 12,
        marginTop: 10,
        marginRight: 10,
        textAlign: 'center',
        alignSelf: 'center',
        textDecorationLine: 'underline',
        alignSelf: 'center',

    },
});