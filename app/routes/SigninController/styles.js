import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  safeAreaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topViewStyle: {
    flexDirection: 'row',
    // height: Settings.topBarHeight,
  },
  bgImageView: {
    position: 'absolute',
    width: Utility.screenWidth,
    height: Utility.screenHeight,
  },

  viewTop: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'rgba(255,255,255, 0.2)',
  },

  viewSignInContainer: {
    // height: 200,
    backgroundColor: 'transparent',
    marginHorizontal: 35,
    marginTop: 1,
    borderRadius: 10,
    justifyContent: 'center',
  },
  viewTextFieldContainer: {
    marginHorizontal: 10,
    marginTop: 5,
    //backgroundColor:'yellow',
  },
  textAppName: {
    marginTop: 50,
  },
  textHint: {
    color: Colors.lightGreen,
    fontFamily: Fonts.santana,
    fontSize: 14
  },
  textForgotpassword: {
    color: Colors.green,
    fontFamily: Fonts.santanaBold,
    fontSize: 12,
    marginTop: 20,
    marginRight: 10,
    textAlign: 'right',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end'
  },
  textSkip: {
    color: Colors.green,
    fontFamily: Fonts.santana,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    // textDecorationLine: 'underline',
    alignSelf: 'flex-end'
  },
  textRememberme: {
    color: Colors.lightGray2Color,
    fontFamily: Fonts.santana,
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 5,
    alignSelf: 'center',
  },

  viewBottom: {
    paddingVertical: 2,
    backgroundColor: 'transparent'
  },
  btnSignUp: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  textSignUp: {
    color: Colors.lightGreen,
    fontFamily: Fonts.santana,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 35
  },

  inputBackround: {
    bottom: 4,
    width: '100%',
    resizeMode: Utility.isPlatformAndroid ? null : 'contain'
  },
  viewLoginNFbGPlusContainer: {
    // backgroundColor: 'transparent',
    flexDirection: 'column',
    alignSelf: 'center',
    marginVertical: 20,
    //height: 140,
    justifyContent: 'space-between',
  },
  // Login Button
  btnLogin: {
    backgroundColor: Colors.green,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    minHeight: 30,
    //marginBottom: 20,
    borderRadius: 20,
  },
  textOrLoginWith: {
    color: Colors.green,
    fontFamily: Fonts.santana,
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center'
  },
  titleLogin: {
    color: 'white',
    fontSize: 12,
    fontFamily: Fonts.promptLight,
    backgroundColor: 'transparent',
  },
  viewFbGPlusContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginHorizontal: 35,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  btnFB: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    minWidth: 90,
    marginHorizontal: 10,
    paddingVertical: 6,
    borderColor: Colors.green,
    borderWidth: 0.5,
    borderRadius: 20,
  },
  textFB: {
    color: Colors.green,
    fontFamily: Fonts.promptMedium,
    fontSize: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
    alignSelf: 'center'
  },
  bottomLine: {
    borderBottomColor: Colors.lightGreen,
    borderBottomWidth: 0.5,
    marginTop: -20,
  },
  inputText: {
    flex: 1,
    paddingVertical: 6,
    fontFamily: Fonts.promptLight,
    color: Colors.blueType2,
    fontSize: Utility.NormalizeFontSize(15),
  },
  inputWrapper: {
    height: 48
  }
});
