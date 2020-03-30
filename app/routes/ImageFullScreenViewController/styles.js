import { StyleSheet, Platform } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    listViewStyle: {
        flex: 1,
    },
    listViewCellStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'center',
        width: Utility.screenWidth
    },
    iconStyle: {
        flex: 1,
        // width: Utility.screenWidth,
        // height: Utility.screenWidth,
        marginVertical: 20,
        justifyContent: 'center',
        resizeMode: 'contain',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1
    },
    textStyle: {
        color: Colors.themeColor,
        fontSize: Utility.NormalizeFontSize(16),
        fontFamily: Fonts.promptMedium,
    },
    shortDescStyle: {
        marginTop: 10,
        fontSize: Utility.NormalizeFontSize(14),
        fontFamily: Fonts.promptLight,
        textAlign: 'center',
        // maxWidth : 180
    },
    viewNextStyle: {
        backgroundColor: Colors.themeColor,
        marginHorizontal: 50,
        minHeight: 40,
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textNextStyle: {
        color: '#fff',
        fontSize: Utility.NormalizeFontSize(15),
        fontWeight: 'bold',
    },
    titleView: {
        marginHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
})