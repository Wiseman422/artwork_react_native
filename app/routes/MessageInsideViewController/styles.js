import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    surfaceView: {
        flex: 1,
    },

    //TopView Style
    topViewStyle: {
        flexDirection: 'row',
        height: Settings.topBarHeight,
    },
    titleView: {
        marginTop: 25,
        flex: 1,
        flexDirection: 'row',
    },
    titleTextStyle: {
        color: Colors.green,
        fontFamily: Fonts.santanaBlack,
        fontSize: Utility.NormalizeFontSize(22),
        marginLeft: 10
    },

    //Chat UI
    bubbleContainer: {
        flex: 1,
        paddingTop: 8 // justify date height and make container center.
    },
    bubbleMessageContainer: {
        flexDirection: 'row',
    },
    UserDisplayImageStyle: {
        height: 54,
        width: 54,
        borderRadius: 27,
        borderWidth: 1,
        borderColor: Colors.grayType1
    },
    senderTextContainer: {
        backgroundColor: Colors.themeColor,
        //opacity: 0.65,
        padding: 8,
        borderRadius: 5,
        marginLeft: 10
    },
    bubbleImageStyle: {
        height: 100,
        width: 120
    },
    receiverTextContainer: {
        backgroundColor: Colors.blueType1,
        //opacity: 0.55,
        padding: 8,
        borderRadius: 5,
        marginRight: 10
    },
    textStyle: {
        color: 'white',
        // backgroundColor: 'black',
        fontSize: 12
    },
    dateTextStyle: {
        fontSize: 8
    },
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
    },
    chatAttachmentContainer: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    }

});