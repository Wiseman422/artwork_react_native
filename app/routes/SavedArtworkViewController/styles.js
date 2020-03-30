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
    },
    subContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },

    // Search Component    
    searchView: {
        height: Settings.topBarHeight,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        marginTop: Utility.isPlatformAndroid ? 0 : Utility.isiPhoneX ? 40 : 20
    },
    inputWrapper: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    inputText: {
        flex: 1,
        fontFamily: Fonts.promptRegular,
        color: Colors.blueType2,
        padding: 4,
    },
    btnClose: {
        padding: 0,
        justifyContent: 'center',
    },

    //AutoSuggestionList
    autoSuggestionContainer: {
        position: 'absolute',
        width: Utility.screenWidth - 80,
        marginHorizontal: 40,
        marginTop: 71,
        maxHeight: 150
    },
    autoSuggestionRowItem: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 10
    },
    saperatorStyle: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.grayBorderColor
    },
    // Category Component
    segmentControllerStyle: {
        marginTop: 10,
        height: 26,
        backgroundColor: Colors.white,
        marginHorizontal: 15,
    },
    segmentTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.categoryTextGray,
    },
    segmentSelectedTitle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
        color: Colors.white,
    },

    noRecordsFoundTextStyle: {
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(16),
        color: Colors.lightGray3Color,
        flex: 1,
        textAlign: 'center',
        marginTop: 200,
    },

    // Flatlist Component
    gridViewComponentStyle: {
        marginTop: 30,
        marginHorizontal: 12,
    },
    gridViewCellStyle: {
        minWidth: ((Utility.screenWidth) - (24 + 10)) / 2,
        maxWidth: ((Utility.screenWidth) - (24 + 10)) / 2,
        height: 250,
        marginTop: 0,
        marginRight: 10,
        marginBottom: 8,
        backgroundColor: Colors.grayType1
    },

    //renderArtworkViewCell
    articleImageStyle: {
        // marginHorizontal: 5,
        // marginTop: 5,
        flex: 0.45,
        // backgroundColor: 'white',
    },
    articleDescriptionStyle: {
        marginHorizontal: 12,
        flex: 0.55,
    },
    nameContainerView: {
        marginTop: 10,
    },
    projectNameView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    projectNameText: {
        flex: 1,
        fontSize: Utility.NormalizeFontSize(16),
        fontFamily: Fonts.promptRegular
    },
    priceText: {
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
        justifyContent: 'flex-end',
        color: Colors.themeColor,
        marginHorizontal: 5
    },
    artistNameText: {
        marginLeft: 8,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.grayType2,
    },
    articleIconView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 5,
        marginVertical: 12,
    },
    articleTypeText: {
        fontFamily: Fonts.promptRegular,
        alignSelf: 'center',
        justifyContent: 'center',
        color: Colors.grayType3,
        width: "100%",
        textAlign: 'center',
    },

    //renderArtistViewCell
    artistViewCellArticleImageStyle: {
        marginHorizontal: 5,
        marginTop: 15,
        flex: 0.45,
        backgroundColor: 'white',
    },
    artistNameContainerView: {
        marginTop: 10,
        flexDirection: 'row',
    },
    artistImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: Colors.grayTextColor,
        marginLeft: 5,
    },
    artistPlaceHolderPhoto: {
        height: 50,
        width: 50,
        // borderWidth: 1,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    artistNameContainerStyle: {
        marginLeft: 10,
        marginRight: 0,
        marginTop: 5,
        flex: 1,
        height: 45,
    },
    artistViewCellArtistNameText: {
        fontSize: Utility.NormalizeFontSize(16),
        fontFamily: Fonts.promptRegular,
        color: Colors.black,
    },
    artistViewCellMediumOfWork: {
        marginLeft: 6,
        color: Colors.grayType2,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(10),
    },
    artistDescriptionView: {
        marginTop: 10,
        marginHorizontal: 10,
        height: 40,
    },
    artistShortDescText: {
        alignSelf: 'center',
        justifyContent: 'center',
        color: Colors.grayType2,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(10),
    },
    artistTypeText: {
        alignSelf: 'center',
        justifyContent: 'center',
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(12),
        color: Colors.lightGray4Color,
        width: "100%",
        textAlign: 'center'
    },
});