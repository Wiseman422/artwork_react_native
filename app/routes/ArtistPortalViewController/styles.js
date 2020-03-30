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
        paddingHorizontal: 15
    },
    surfaceView: {
        flex: 1,
    },
    //TopView Style
    topViewStyle: {
        flexDirection: 'row',
        // height : 80,        
    },
    titleView: {
        marginTop: 25,
        paddingVertical: 6,
        flexDirection: 'row',
    },
    titleTextStyle: {
        marginLeft: 10,
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack,
    },
    // ApprovalCodeContainer
    approvalCodeContainerView: {
        width: Utility.screenWidth,
        marginTop: 20,
        flex: 1,
        alignSelf: 'center',
    },
    approvalCodeInnerView: {
        marginTop: 8,
        backgroundColor: Colors.grayType1,
        borderColor: Colors.blueType1,
        marginHorizontal: 50,
        padding: 4,
        borderWidth: 0.5,
    },
    txtApprovalCode: {
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(16),
        fontFamily: Fonts.promptRegular,
        textAlign: 'center',
    },
    inputTextApprovalCode: {
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: Utility.NormalizeFontSize(20),
        padding: 2,
        fontFamily: Fonts.promptMedium,
        color: Colors.blueType1,
    },
    //SubTitleView
    subTitleView: {
        marginTop: 60,
        // height: 60,
    },
    txtIntrested: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },
    txtFillOut: {
        marginTop: 10,
        fontSize: 11,
        textAlign: 'center',
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },

    //applicationFormContainer    
    applicationFormContainer: {
        marginTop: 5,
    },
    titleContainerLeft: {
        flex: 0.5,
    },
    titleContainerRight: {
        marginLeft: 10,
        flex: 0.5,
    },
    applicationFormInnerContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    titleStyle: {
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },
    smallTitleStyle: {
        fontSize: Utility.NormalizeFontSize(8),
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
    },
    inputText: {
        fontSize: Utility.NormalizeFontSize(12),
        backgroundColor: Colors.grayType1,
        fontFamily: Fonts.promptLight,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,
        minHeight: 30,
    },
    // Artwork Description Style
    artworkDescriptionStyle: {
        marginTop: 15,
        minHeight: 100,
        paddingHorizontal: 5,
    },
    inputTextDescription: {
        padding: 5,
        marginTop: 6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
        backgroundColor: Colors.grayType1,
        flex: 1,
        minHeight: 70,
    },
    inputTextDescriptionAndroid: {
        padding: 5,
        marginTop: 6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
        backgroundColor: Colors.grayType1,
        flex: 1,
        minHeight: 70,
        textAlignVertical: 'top'
    },
    // Completed project banner
    completedProjectView: {
        marginTop: 15,
        paddingHorizontal: 5,
        minHeight: 90,
    },
    buttonContainerView: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        alignSelf: 'center',
        // width: 280,
    },
    defaultCompletedProjectButton: {
        height: 65,
        width: 65,
        backgroundColor: Colors.grayType5,
        borderColor: Colors.grayType4,
        borderWidth: 1.5,
        padding: 10,
        marginHorizontal: 10,
    },
    projectImage: {
        height: 65,
        width: 65,
        marginHorizontal: 10,
        backgroundColor: Colors.transparent,
    },
    buttonTitleStyle: {
        color: 'white',
        fontFamily: Fonts.promptRegular,
    },
    viewBottom: {
        borderBottomColor: Colors.lightGray2Color,
        borderBottomWidth: 0.5,
    },
    prefferedMediumHeaderTextStyle: {
        color: Colors.black,
        fontSize: Utility.NormalizeFontSize(18),
        fontFamily: Fonts.santanaBold,
        paddingVertical: 8,
    },
    prefferedMediumTextStyle: {
        color: Colors.grayTextColor,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptLight,
        paddingVertical: 12,
    },
    modalContainer: {
        // width: Utility.screenWidth - 20,
        // maxHeight:Utility.screenHeight-150,
        // minHeight:Utility.screenHeight-300, 
        //marginRight:10, 
        //marginLeft:10, 
        // borderTopLeftRadius:5,
        // paddingTop:20,
        // borderTopRightRadius:5,
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
});