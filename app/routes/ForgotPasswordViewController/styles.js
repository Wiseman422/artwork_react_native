import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bgImageView: {
    position: 'absolute',
    width: Utility.screenWidth,
    height: Utility.screenHeight,
  },
  viewTop: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgba(255,255,255, 0.2)',
  },
  textAppName: {
    color: Colors.green,
    fontFamily: Fonts.santana,
    marginTop: 100,
    fontSize: 35
  },
  // logoImage: {
  //   resizeMode: 'contain'
  // },
  viewSignInContainer: {
    minHeight: 100,
    backgroundColor: 'transparent',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  viewTextFieldContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    //backgroundColor:'yellow',
  },
  btnSubmit: {
    backgroundColor: Colors.green,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 30,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 40,
  },
  textSubmit: {
    color: 'white',
    fontSize: 12,
    fontFamily: Fonts.promptRegular,
    backgroundColor: 'transparent',
  },
  textHint: {
    color: Colors.lightGreen,
    fontFamily: Fonts.santana,
    fontSize: 14
  },
  bottomLine: {
    borderBottomColor: Colors.lightGreen,
    borderBottomWidth: 0.5,
   // marginTop: -20,
  },
  inputText: {
    flex: 1,
    paddingVertical: 6,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(15),
  },
});
