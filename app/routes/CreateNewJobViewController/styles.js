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
        paddingHorizontal: 20,
        paddingBottom: 10
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
        color: Colors.blueType1,
        fontFamily: Fonts.santanaBlack,
        fontSize: Utility.NormalizeFontSize(22),
        marginLeft: 3
    },

    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: Colors.transparent,
        marginRight: 10,
        marginVertical: 5

    },
    artistPlaceHolderPhoto: {
        height: 40,
        width: 40,
        borderColor: Colors.blueType2,
    },

    //innerView for client name and project name
    innerViewContainer1: {
        marginTop: 10,
        flexDirection: 'row',
    },
    clientNameContainer: {
        flex: 1,
        marginRight: 12,
    },

    projectNameContainer: {
        flex: 1,
        marginLeft: 12,
    },
    textStyle: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
    },
    inputText: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        backgroundColor: Colors.grayType1,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,
    },

    // Project Detail Container
    detailsContainer: {
        marginTop: 20,
    },
    detailsTextInput: {
        marginTop: 5,
        backgroundColor: Colors.grayType1,
        color: Colors.blueType2,
        textAlign: 'auto',
        alignContent: 'flex-start',
        padding: 5,
        minHeight: 150,
        fontSize: Utility.NormalizeFontSize(12),
    },
    detailsTextInputAndroid: {
        marginTop: 5,
        backgroundColor: Colors.grayType1,
        color: Colors.blueType2,
        textAlign: 'auto',
        alignContent: 'flex-start',
        padding: 5,
        minHeight: 150,
        fontSize: Utility.NormalizeFontSize(12),
        textAlignVertical: 'top'
    },
    viewTextType: {
        padding: 6,
        backgroundColor: Colors.grayType1,
    },

    // Type frame and Project Type
    innerViewContainer2: {
        marginTop: 20,
        flexDirection: 'row',
    },
    TypeFrameContainer: {
        flex: 1,
        marginRight: 12,
    },
    projectTypeContainer: {
        flex: 1,
        marginLeft: 12,
    },
    textType: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        textAlign: 'center',
        color: Colors.blueType2,
    },
    // Payment Type Component
    PaymentDetailsContainer: {
        marginTop: 10,
    },
    segmentControllerStyle: {
        marginTop: 10,
        height: 26,
        backgroundColor: Colors.white,
    },
    segmentTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
    },
    segmentSelectedTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
    },
    // Send Button
    sendButtonView: {
        marginTop: 30,
        backgroundColor: Colors.blueType1,
        width: 110,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
    },

    //ModalBox
    modalContainer: {
        backgroundColor: Colors.white,
        width: Utility.screenWidth - 20,
        height: Utility.screenHeight - 250,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    modalHeaderTextStyle: {
        color: Colors.black,
        fontSize: Utility.NormalizeFontSize(18),
        fontFamily: Fonts.santanaBold,
        paddingVertical: 8,
    },
    modalTextStyle: {
        color: Colors.grayTextColor,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptLight,
    },
    closeTextStyle: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.santanaBold,
        padding: 6,
    },
    viewBottom: {
        borderBottomColor: Colors.lightGray2Color,
        borderBottomWidth: 0.5,
    },
    // Unique and repeatable
    btnUniqueRepeatable: {
        marginTop: 15,
    },
    btnTitleOptions: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
    },
    btnDeliveryPickup: {
        // marginTop: 15,
        // marginRight:25,
        flex: 1,
        justifyContent: 'center'
    },
    shippingCostDeliveryCostContainer: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
});