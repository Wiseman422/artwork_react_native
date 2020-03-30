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
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack,
    },
    textSelected: {
        backgroundColor: Colors.blueType1,
        color: Colors.white,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(13),
        minWidth: 70,
        paddingHorizontal: 3,
        paddingVertical: 2,
        textAlign: 'center',
        alignSelf: 'center'
    },
    textUnSelected: {
        backgroundColor: Colors.transparent,
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(13),
        minWidth: 70,
        paddingHorizontal: 3,
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
    // New Request list
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
    //Ongoing Job Style
    onGoingJobContainerStyle: {
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,        
    },
    onGoingJobItemStyle: {
        flexDirection: 'row',        
    },
    textRemoveCart: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(8),
        color: 'red',
        alignSelf: 'flex-end',
        backgroundColor:'pink'
    },

    jobItemStyle: {
        flexDirection: 'row',
        borderRadius: 2,
        borderWidth: 0.8,
        borderColor: Colors.blueType4,
        marginHorizontal: 6,
        backgroundColor: Colors.grayType1,
        marginTop: 6,
        padding: 3,
    },
    //button chat
    btnChat: {
        backgroundColor: Colors.blueType1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginTop: 6,
        marginRight: 5
    },

    btnDisable: {
        backgroundColor: Colors.blueTypeDisable,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginTop: 6,
        marginRight: 5
    },

    titleChat: {
        color: Colors.white,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(12),
        textAlign: 'center',
        alignSelf: 'center'
    },
    viewJobTitleNCustomeName: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 70,
        minHeight: 70,
    },
    textArtworkJobName: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14)
    },
    textCustomerName: {
        color: Colors.grayType6,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4,
    },
    textOrderDate: {
        color: Colors.grayType6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginLeft: 6,
        marginTop: -4,
    },
    viewJobDate: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textJobDate: {
        color: Colors.blueType2,
        fontFamily: Fonts.promptLight,
        textAlign: 'right',
        fontSize: Utility.NormalizeFontSize(11),
    },

    // New Job Button
    sendButtonView: {
        marginTop: 10,
        backgroundColor: Colors.blueType1,
        width: 110,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },

    ///////
    backTextWhite: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },
    rowFront: {
        alignItems: 'center',
        justifyContent: 'center',
        // minHeight: 50,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        //paddingLeft: 15,
    },
    backLeftBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        marginLeft: 8,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        right: 75
    },
    backRightBtnRight: {
        right: 0
    },
});