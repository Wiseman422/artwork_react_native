import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    //TopView Style
    topViewStyle: {
        flexDirection: 'row',
        height: Settings.topBarHeight,
    },
    titleView: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
    },
    titleTextStyle: {
        color: Colors.green,
        fontFamily: Fonts.santanaBlack,
        fontSize: Utility.NormalizeFontSize(22),
        marginLeft: 10
    },
    // Calendar
    calendar: {
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
        backgroundColor: '#eee'
    },
    //Event list
    listViewCellStyle: {
        marginTop: 12,
        backgroundColor: Colors.white
    },
    eventItemStyle: {
        height: 66, //Image height 60 and 3 padding
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        padding: 3
    },
    eventImageStyle: {
        height: 60,
        width: 80,
        backgroundColor: Colors.transparent,
    },
    viewEventNameStyle: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
    },
    textEventName: {
        color: Colors.themeColor,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textEventInfo: {
        flex: 1,
        color: Colors.grayTextColor2,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginTop: -4
    },
    viewPriceCart: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    textPriceCart: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'center',
        fontSize: Utility.NormalizeFontSize(11),
        marginHorizontal: 10
    },
    txtNoEventFoundStyle: {
        alignSelf: 'center',
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.grayTextColor,
        marginTop: 100
    },
    markDayTextStyle: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.themeColor,
    },
    markDayContainerStyle: {
        borderColor: Colors.themeColor,
        borderWidth: 1,
        borderRadius: 16
    },
    selectedDayTextStyle: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.white,
    }
});