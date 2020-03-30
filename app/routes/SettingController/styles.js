import { StyleSheet } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Settings } from '../../config/Settings';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff'
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
        color: Colors.themeColor,
        fontFamily: Fonts.santanaBlack,
        fontSize: Utility.NormalizeFontSize(22),
        marginLeft: 10
    },
    //
    subTabContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subText: {
        flex: 1,
        marginLeft: 15,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(15),
        color: Colors.themeColor,
    },
    switchImage: {
        marginRight: 15,
        height: 25,
        width: 40,
    },
    arrowImage: {
        marginRight: 15,
    },
    viewSeperator: {
        width: Utility.screenWidth,
        height: 1,
        backgroundColor: Colors.blueType2
    },
});
