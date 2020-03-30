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
        // height : 80,        
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    titleTextStyle: {
        marginLeft: 10,
        color: Colors.blueType1,
        fontSize: Utility.NormalizeFontSize(22),
        fontFamily: Fonts.santanaBlack,
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
        color: Colors.blueType1,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(10),
        marginTop: 2,
    },
    //applicationFormContainer    
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
        //paddingHorizontal: 5,
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

    // Artwork Description Style
    artworkDescriptionStyle: {
        marginTop: 15,
        minHeight: 120,
        //paddingHorizontal: 5,
    },
    inputTextDescription: {
        padding: 5,
        marginTop: 6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
        backgroundColor: Colors.grayType1,
        flex: 1,
        minHeight: 100,
    },
    inputTextDescriptionAndroid: {
        padding: 5,
        marginTop: 6,
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.blueType2,
        backgroundColor: Colors.grayType1,
        flex: 1,
        minHeight: 100,
        textAlignVertical: 'top'
    },
    // Completed project banner
    completedProjectView: {
        marginTop: 10,
        paddingHorizontal: 5,
        minHeight: 90,
    },
    buttonContainerView: {
        flexDirection: 'row',
        marginTop: 10,
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
    //Banner Image
    bannerProjectContainer: {
        height: 150,
        backgroundColor: Colors.grayType1,
        justifyContent: 'center',
    },
    bannerProjectText: {
        color: Colors.blueType2,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptLight,
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
    textFieldViewContainer: {
        marginTop: 10,
        flexDirection: 'row',
        minHeight: 48,
        justifyContent: 'space-between',
    },
    //Source Name and Link
    sourceNameAndLinkContainer: {
        flex: 1,
        marginTop: 8,
    },
    sourceNameContainer: {
        flex: 0.5
    },
    linkContainer: {
        flex: 1,
        marginLeft: 10,
    },
    sourceNameAndLinkInnerInputContainer: {
        //marginTop: 5,
        flexDirection: 'row',
        //height: 32,
        justifyContent: 'space-between',
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
    inputLinkInnerText: {
        fontFamily: Fonts.promptLight,
        fontSize: Utility.NormalizeFontSize(12),
        backgroundColor: Colors.grayType1,
        padding: 6,
        textAlign: 'center',
        color: Colors.blueType2,
        minHeight: 30,
    },
    textStyle: {
        color: Colors.themeColor,
        fontSize: 12,
        fontFamily: Fonts.promptRegular,
    },
});