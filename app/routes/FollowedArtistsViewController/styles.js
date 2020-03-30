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
    imageCell: {
        // position: 'absolute',
        flex: 0.9,
        // backgroundColor: 'red'
    },
    imageCellOuter: {
        // position: 'absolute',
        flex: 0.95,
        // backgroundColor: 'green',

    },

    //renderArtistViewCell
    artistViewCellArticleImageStyle: {
        // marginHorizontal: 5,
        // marginTop: 15,
        // minHeight: 100,
        flex: 1,
        // backgroundColor: 'red',
    },
    artistDescriptionStyle: {
        marginHorizontal: 5,
        marginTop: 4,
        // flex: 0.45,
    },
    artistNameContainerView: {
        marginTop: 10,
        flexDirection: 'row',
    },
    artistImageStyle: {
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        // borderWidth: 1,
        // borderColor: 'white',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        marginTop: 125,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: 'white',
        shadowOpacity: 1,
        elevation: 5,
    },
    artistPlaceHolderPhoto: {
        height: 50,
        width: 50,
        // borderWidth: 1,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    artistNameContainerStyle: {
        marginLeft: 5,
        marginRight: 0,
        marginTop: 5,
        flex: 1,
        height: 45,
    },
    artistViewCellArtistNameText: {
        marginTop: 2,
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptMedium,
        color: Colors.black,
        textAlign: 'center',
        // backgroundColor:'green',
    },
    artistViewCellMediumOfWork: {
        color: Colors.grayType2,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(13),
        textAlign: 'center',
        // backgroundColor:'blue',
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
        textAlign: 'center',
        // backgroundColor:'red',
    },
});