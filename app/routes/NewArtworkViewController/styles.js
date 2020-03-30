import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import { Platform } from 'react-native';


export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
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
    color: Colors.blueType1,
    fontFamily: Fonts.santanaBlack,
    fontSize: Utility.NormalizeFontSize(22),
    marginLeft: 10
  },
  textArtworkPhotos: {
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(12),
    color: Colors.blueType1,
    marginLeft: 6
  },
  viewDetailContainer: {

  },
  gridViewComponentStyle: {
    marginTop: 3,
    //backgroundColor : 'blue'     
  },
  defaultCompletedProjectButton: {
    height: 65,
    width: 65,
    backgroundColor: Colors.grayType5,
    borderColor: Colors.grayType4,
    borderWidth: 1.5,
    justifyContent: 'center',
    margin: 6
  },
  artworkImage: {
    margin: 6,
    height: 65,
    width: 65,
    //marginHorizontal: 10,
    backgroundColor: Colors.transparent,
  },
  //applicationFormContainer    
  applicationFormContainer: {
    marginTop: 10,
  },
  titleContainer: {
    flex: 1,
  },
  applicationFormInnerContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  titleStyle: {
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(11),
    color: Colors.blueType1,
  },
  inputText: {
    marginTop: 6,
    backgroundColor: Colors.grayType1,
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptLight,
    padding: 6,
    textAlign: 'center',
    color: Colors.blueType2,
    minHeight: 30,
    maxHeight: 30,
  },
  dropDownText: {
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptLight,
    textAlign: 'center',
    color: Colors.blueType2,
  },
  dropDownView: {
    marginTop: 6,
    backgroundColor: Colors.grayType1,
    padding: 6,
    minHeight: 30,
    maxHeight: 30,
  },
  //Project Detail Style
  artworkDescriptionStyle: {
    marginTop: 5,
    minHeight: 180,
    paddingHorizontal: 5,
  },
  inputTextDescription: {
    marginTop: 6,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(12),
    backgroundColor: Colors.grayType1,
    padding: 8,
    color: Colors.blueType2,
    minHeight: 150,
  },
  inputTextDescriptionAndroid: {
    marginTop: 6,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(12),
    backgroundColor: Colors.grayType1,
    padding: 8,
    color: Colors.blueType2,
    minHeight: 150,
    textAlignVertical: 'top',
  },

  //tagContainer
  tagContainerView: {
    marginTop: 5,
    flex: 1,
    paddingHorizontal: 5,
  },
  tagTextStyle: {
    color: Colors.blueType2,
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptLight,
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
    paddingVertical: 12,
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
  viewSizeProjectTypeArtworkPrice: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  btnUniqueRepeatable: {
    // marginTop: 22,
    flex: 1,
  },
  btnDeliveryPickup: {
    marginTop: 15,
    // marginRight:25
    flex: 1,
  },
  btnTitleOptions: {
    color: Colors.blueType1,
    fontSize: Utility.NormalizeFontSize(11),
    fontFamily: Fonts.promptRegular,
    backgroundColor: 'transparent',
  },
});