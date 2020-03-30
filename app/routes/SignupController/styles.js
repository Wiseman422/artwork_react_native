import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility, { screenWidth } from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Images from '../../config/Images';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bgImageView: {
    position: 'absolute',
    width: Utility.screenWidth,
    height: Utility.screenHeight,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  viewsignup: {
    //backgroundColor:'blue',
    // height: 150,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30
  },
  txtSignup: {
    fontSize: Utility.NormalizeFontSize(24),
    fontFamily: Fonts.santana,
    color: Colors.green
  },
  viewmaincontainer: {
    //backgroundColor:'white',
    height: 650,
    paddingTop: 20
  },
  viewsubcontainer: {
    backgroundColor: 'transparent',
    paddingTop: 80,
    height: 550,
    marginHorizontal: 35,
    borderRadius: 10,
  },
  viewTextFieldContainer: {
    marginHorizontal: 20,
    marginTop: 5,
  },
  inputText: {
    flex: 1,
    paddingVertical: 6,
    fontFamily: Fonts.promptLight,
    color: Colors.blueType2,
    fontSize: Utility.NormalizeFontSize(15),
  },
  bottomLine: {
    borderBottomColor: Colors.lightGreen,
    borderBottomWidth: 0.5,
    //marginTop: -20,
  },
  textHint: {
    color: Colors.lightGreen,
    fontFamily: Fonts.santana,
    fontSize: 14
  },
  //Agreement Section
  viewAgreeTerms: {
    flexDirection: 'row',
    paddingVertical: 10,
    //backgroundColor: 'red',
    marginHorizontal: 15,
    marginTop: 10
  },
  btnAgree: {
    flexDirection: 'row',
    alignSelf: 'center'
    //backgroundColor: 'blue'
  },
  textAgreeTerms: {
    color: Colors.greenType1,
    fontFamily: Fonts.santana,
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 5,
    //backgroundColor:'red',
    marginTop: 3
  },
  textPrivacy: {
    color: Colors.greenType1,
    fontFamily: Fonts.santanaBlack,
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  textSubmit: {
    color: 'white',
    fontSize: 12,
    fontFamily: Fonts.promptLight,
    backgroundColor: 'transparent',
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
  imgPhoto: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
    borderRadius: 40
  },
  placeHolderPhotoStyle: {
    height: 80,
    width: 80,
    borderColor: Colors.blueType2,
    resizeMode: 'cover',
  },
  viewBottom: {
    paddingVertical: 2,
    //backgroundColor:'red'
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
    fontFamily: Fonts.promptLight,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 5
  },
});