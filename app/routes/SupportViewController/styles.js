import { StyleSheet, Platform } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

export default StyleSheet.create({
  containerViewStyle: {
    marginHorizontal: 20,
    flex: 1,
    backgroundColor: '#ffffff'
  },
  supportText1: {
    color: Colors.themeColor,
    alignSelf: 'center',
    fontFamily: Fonts.promptMedium,
    fontSize: Utility.NormalizeFontSize(14)
  },
  supportText2: {
    marginTop: 8,
    color: Colors.themeColor,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(10)
  },
  supportText3: {
    marginTop: 8,
    color: Colors.themeColor,
    alignSelf: 'center',
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(10)
  },
  applicationFormInnerContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  titleContainer: {
    flex: 1,
  },
  titleStyle: {
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(12),
    color: Colors.themeColor,
  },
  inputText: {
    marginTop: 4,
    backgroundColor: Colors.grayType1,
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptLight,
    padding: 6,
    textAlign: 'center',
    color: Colors.blueType2,
    minHeight: 30,
    maxHeight: 30,
    borderColor: Colors.blueType4,
    borderWidth: 1
  },
  artworkDescriptionStyle: {
    marginTop: 15,
    minHeight: 320,
    paddingHorizontal: 5,
  },
  inputTextDescription: {
    borderColor: Colors.blueType4,
    borderWidth: 1,
    marginTop: 4,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(12),
    backgroundColor: Colors.grayType1,
    padding: 8,
    color: Colors.blueType2,
    minHeight: 290,
  },
  inputTextDescriptionAndroid: {
    borderColor: Colors.blueType4,
    borderWidth: 1,
    marginTop: 4,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(12),
    backgroundColor: Colors.grayType1,
    padding: 8,
    color: Colors.blueType2,
    minHeight: 290,
    textAlignVertical: 'top'
  },
  // New Job Button
  sendButtonView: {
    marginTop: 30,
    backgroundColor: Colors.themeColor,
    width: 110,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
});