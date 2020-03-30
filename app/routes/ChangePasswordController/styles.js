import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: Colors.white
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollView: {},

    mainContainer: {
        padding: 20
    },
    bgImageView: {
        position: 'absolute',
        width: Utility.screenWidth,
        height: Utility.screenHeight,
    },

    inputWrapper: {
        marginVertical: 7
    },

    inputText: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        backgroundColor: Colors.grayType1,
        padding: 6,
        //textAlign: 'center',
        color: Colors.blueType2,
    },

    btnSave: {
        backgroundColor: Colors.blue,
        paddingHorizontal: 30,
        height: 30,
        justifyContent: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 15
    },

    textSave: {
        alignSelf: 'center',
        color: Colors.white,
        fontFamily: Fonts.bold,
        fontSize: 16,
        textAlign: 'center',
        marginHorizontal: 5
    },
    btnSubmit: {
        backgroundColor: Colors.green,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: 140,
        height: 30,
        marginTop: 20,
        marginBottom: 20,
        // borderRadius: 40,
    },
    textSubmit: {
        color: 'white',
        fontSize: 12,
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
    },
});;
