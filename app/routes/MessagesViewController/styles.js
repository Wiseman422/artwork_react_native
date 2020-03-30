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
        backgroundColor: '#ffffff',
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

    // Category Component
    segmentControllerStyle: {
        marginTop: 25,
        height: 26,
        backgroundColor: Colors.white,
        // marginHorizontal: 15,
    },
    segmentTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.blueType5,
    },
    segmentSelectedTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.white,
    },

    //FlatList
    userListComponentStyle: {
        backgroundColor: 'white',
        marginTop: 15
    },
    saperatorStyle: {
        width: '100%',
        height: 5,
        backgroundColor: 'white'
    },
    userCellStyle: {
        backgroundColor: Colors.grayType1,
        borderColor: Colors.blueType1,
        borderWidth: 1,
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 10
    },
    artistImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: Colors.grayTextColor,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.grayType1
    },
    artistPlaceHolderPhoto: {
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    // user infromation view
    userInformationStyle: {
        flexDirection: 'row',
    },
    userNameTextStyle: {
        flex: 1,
        fontFamily: Fonts.promptMedium,
        color: Colors.greenType1,
        fontSize: Utility.NormalizeFontSize(15),
    },
    roundViewAndTimeStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    roundViewStyle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: Colors.greenType1,
        marginRight: 8
    },
    timeTextStyle: {
        fontFamily: Fonts.montserratLight,
        fontSize: Utility.NormalizeFontSize(10),
        color: 'black'
    },
    messageTextStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.grayType6
    },
    noRecordsFoundTextStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.lightGray3Color,
        flex: 1,
        textAlign: 'center',
        marginTop: 200,
    },
});