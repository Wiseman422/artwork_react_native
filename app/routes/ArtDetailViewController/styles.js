import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';

export default StyleSheet.create({
    container: {
        // flex: 1,        
        //backgroundColor: '#ffffff',
    },
    // safeAreaView: {
    //     flex: 1,
    //     backgroundColor: 'transparent',
    //     paddingBottom: 10,
    // },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    artImageView: {
        width: 120,
        height: 120,
        // resizeMode:'center'
    },
    artDetail: {
        // flex: 1,
        marginHorizontal: 20,
    },
    artistProfile: {
        marginTop: 5,
        flexDirection: 'row',
        // marginRight: 10,
        // alignItems: 'center'
    },
    artistProfileNameView: {
        marginLeft: 10,
        paddingVertical: 8,
        marginRight: 10,
    },
    artistProfilePhoto: {
        height: 61,
        width: 61,
        borderWidth: 1,
        borderColor: Colors.blueType2,
        borderRadius: 30,
    },
    artistPlaceHolderPhoto: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderColor: Colors.blueType2,
        resizeMode: 'cover',
    },
    artPhotoPlaceHolderPhoto: {
        width: 120,
        height: 120,
        resizeMode: 'stretch',
    },
    artNameTextStyle: {
        color: Colors.black,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(26),
        paddingRight: 20,
        marginRight: 10
        // backgroundColor: 'red',
    },
    artistNameProfile: {
        marginTop: 5,
        marginLeft: 7,
        flexDirection: 'row',
        // alignItems: 'center'
    },
    artInfoDetail: {
        marginTop: 8,
        marginLeft: 5,
        flexDirection: 'row',
        // alignItems: 'center'
    },
    artTagsView: {
        marginLeft: 7,
        // alignItems: 'center'
    },
    artInfoTextStyle: {
        color: Colors.grayTextColor,
        fontFamily: Fonts.promptMedium,
        fontSize: Utility.NormalizeFontSize(14),
    },
    artInfoNestedTextStyle: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(13),
    },
    artistNameTextStyle: {
        color: Colors.grayTextColor,
        fontFamily: Fonts.promptRegular,
        fontSize: Utility.NormalizeFontSize(14),
    },
    artistArtworkStyleTextStyle: {
        color: Colors.blueType1,
        fontFamily: Fonts.promptRegular,
        marginLeft: 10,
        marginTop: 2,
        justifyContent: 'center',
        fontSize: Utility.NormalizeFontSize(13),
    },

    artDescriptionTextStyle: {
        color: Colors.black,
        fontFamily: Fonts.promptLight,
        marginTop: 10,
        marginLeft: 5,
        justifyContent: 'space-around',
        fontSize: Utility.NormalizeFontSize(16),
        marginBottom: 10,
        minHeight: 50,
    },
    //Add to Cart Buy Now Button
    addToCartBuyNowView: {
        marginHorizontal: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
        // backgroundColor: 'white',
        // height: 50,
    },
    //Add to Cart
    btnAddToCart: {
        backgroundColor: Colors.blueType1,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 4,
        marginVertical: 10,
        // marginHorizontal: 4,
        borderRadius: 40,
    },
    textAddToCart: {
        color: 'white',
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
    },
    // Price
    btnPrice: {
        // flex: 0.5,
        backgroundColor: Colors.white,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        // width: 140,
        height: 30,
        minWidth: 90,
        // marginVertical: 20,
        marginHorizontal: 4,
        borderRadius: 40,
        borderColor: Colors.blueType1,
        borderWidth: 0.5,
    },
    textPrice: {
        color: Colors.green,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptRegular,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },

    // JoinTextboxView Style
    modalContainer: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    joinViewContainer: {
        alignItems: 'center',
    },
    abuseInnerContainerView: {
        marginTop: 100,
        borderRadius: 10,
        backgroundColor: Colors.grayType1,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    joinTextInput: {
        marginTop: 5,
        marginHorizontal: 5,
        height: 150,
        width: Utility.screenWidth - 50,
        backgroundColor: 'white',
        borderColor: Colors.grayBorderColor,
        borderWidth: 1,
        textAlign: 'auto',
        borderRadius: 2,
        padding: 5,
    },
    joinTextInputAndroid: {
        marginTop: 5,
        marginHorizontal: 5,
        height: 150,
        width: Utility.screenWidth - 50,
        backgroundColor: 'white',
        borderColor: Colors.grayBorderColor,
        borderWidth: 1,
        textAlign: 'auto',
        borderRadius: 2,
        padding: 5,
        textAlignVertical: 'top',
    },
    abuseButtonStyle: {
        backgroundColor: Colors.blueType1,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 10
    },
    abuseButtonTextStyle: {
        textAlign: 'center',
        color: 'white',
        marginHorizontal: 15,
    },
    tagTextStyle: {
        color: Colors.blueType2,
        fontSize: Utility.NormalizeFontSize(12),
        fontFamily: Fonts.promptLight,
    },
    soldText: {
        fontSize: Utility.NormalizeFontSize(15),
        fontFamily: Fonts.promptRegular,
        justifyContent: 'flex-end',
        color: Colors.blueType1,
        marginHorizontal: 5
    }
});