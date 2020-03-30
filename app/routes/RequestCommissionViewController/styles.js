import { StyleSheet, Platform } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

export default StyleSheet.create({
  detailViewStyle: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  artistInnerDetailViewStyle: {
    marginTop: 20,
    marginHorizontal: 20,
    flex: 1,
    // backgroundColor:'green'    
  },
  artistProfileViewStyle: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artistPlaceHolderPhoto: {
    height: 60,
    width: 60,
    borderWidth: 0.5,
    borderColor: Colors.blueType2,
    resizeMode: 'cover',
  },
  artistImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.grayTextColor,
  },
  artistNameText: {
    fontSize: Utility.NormalizeFontSize(20),
    color: 'black',
    alignItems: 'center',
    marginLeft: 10,
    fontFamily: Fonts.promptRegular,
  },
  artistNameInnerView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
    marginTop: 2,
  },
  artistProfile: {
    marginTop: 5,
    flexDirection: 'row',
    // alignItems: 'center'
  },
  artistProfilePhoto: {
    height: 60,
    width: 60,
    borderWidth: 0.5,
    borderColor: Colors.blueType2,
    borderRadius: 30,
  },
  artistNameProfile: {
    marginLeft: 20,
    flexDirection: 'row',
  },
  artistCategoryText: {
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.grayType2,
    fontFamily: Fonts.promptRegular,
    marginLeft: 18,
  },
  customArtworkTitle: {
    marginTop: 5,
    color: Colors.themeColor,
    alignSelf: 'center',
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(8)
  },
  detailsTextInput: {
    marginTop: 5,
    backgroundColor: Colors.grayType1,
    color: Colors.blueType2,
    textAlign: 'auto',
    alignContent: 'flex-start',
    padding: 5,
    minHeight: 250,
    fontSize: 12,
    marginHorizontal: 25,
    borderColor: Colors.blueType1,
    borderWidth: 1
  },
  detailsTextInputAndroid: {
    marginTop: 5,
    backgroundColor: Colors.grayType1,
    color: Colors.blueType2,
    textAlign: 'auto',
    alignContent: 'flex-start',
    padding: 5,
    minHeight: 250,
    fontSize: 12,
    marginHorizontal: 25,
    borderColor: Colors.blueType1,
    borderWidth: 1,
    textAlignVertical: 'top'
  },
  buttonTitleStyle: {
    color: Colors.white,
    fontSize: Utility.NormalizeFontSize(8),
    fontFamily: Fonts.promptMedium,
  },
  btnContactForCommissionStyle: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: Colors.themeColor,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  btnContactForCommissionTextStyle: {
    color: 'white',
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptRegular,
  },


  articleImageStyle: {
    marginBottom: 4,
    minWidth: ((Utility.screenWidth) - (20 + 20)) / 3,
    maxWidth: ((Utility.screenWidth) - (20 + 20)) / 3,
    height: 70,
    marginTop: 0,
    marginRight: 10,
    backgroundColor: Colors.grayType1
  },
});
