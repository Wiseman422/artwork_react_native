import { StyleSheet, Platform } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

export default StyleSheet.create({
  detailViewStyle: {
    flex: 1,
  },
  artistInnerDetailViewStyle: {
    marginTop: 20,
    marginHorizontal: 25,
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
    marginRight: 30, // Why it's not looks like 30 margin
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
    marginTop: 2,
    marginLeft: 15,
    marginRight: 6,
    flexDirection: 'row',
    // backgroundColor:'red'
    // alignItems: 'center'
  },
  artistCategoryText: {
    fontSize: Utility.NormalizeFontSize(12),
    color: Colors.grayType2,
    fontFamily: Fonts.promptRegular,
    marginRight: 4,
  },
  followButtonStyle: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: Colors.blueType1,
    marginLeft: 1,
    height: 20,
    alignSelf: 'baseline'
  },
  buttonTitleStyle: {
    color: Colors.white,
    fontSize: Utility.NormalizeFontSize(10),
    fontFamily: Fonts.promptMedium,
  },
  artistProfileDescriptionText: {
    marginTop: 10,
    fontSize: Utility.NormalizeFontSize(14),
    minHeight: 80,
    fontFamily: Fonts.promptLight,
  },
  btnContactForCommissionStyle: {
    marginTop: 10,
    backgroundColor: 'white',
    borderColor: Colors.blueType1,
    borderWidth: 1,
    borderRadius: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  btnContactForCommissionTextStyle: {
    color: Colors.themeColor,
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptRegular,
  },

  //Segment Style
  segmentContainerView: {
    marginTop: 10,
    marginHorizontal: 10,
    height: 28,
    justifyContent: 'center',
    backgroundColor: Colors.blueType1
  },
  segmentControllerStyle: {
    height: 27,
    backgroundColor: Colors.white,
  },
  segmentTitle: {
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(12),
    color: Colors.blueType1,
    // backgroundColor: 'blue'
  },

  artworkPhotosStyle: {
    marginTop: 6,
    marginHorizontal: 10,
    // backgroundColor : 'gray'                      
  },
  articleImageStyle: {
    marginBottom: 4,
    minWidth: ((Utility.screenWidth) - (20 + 20)) / 3,
    maxWidth: ((Utility.screenWidth) - (20 + 20)) / 3,
    height: ((Utility.screenWidth) - (20 + 20)) / 3,
    marginTop: 0,
    marginRight: 10,
    backgroundColor: Colors.grayType1
  },
});
