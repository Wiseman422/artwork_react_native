import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: Utility.screenWidth,
    backgroundColor: Colors.green,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topViewContainer: {
    height: Utility.isiPhoneX ? 260 : 230,
    //backgroundColor: 'red',    
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  topViewContainerBgImage: {
    position: 'absolute',
    width: Utility.screenWidth,
    height: '100%',
  },

  viewSafeArea: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    //backgroundColor :'purple'
  },
  viewProfileDataContainer: {
    //backgroundColor : 'blue',
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },

  btnClose: {
    //position:'absolute', 
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    //backgroundColor : 'red'

  },

  imgViewProfileImage: {
    flex: 1,
    //backgroundColor : 'purple'
  },
  
  bottomViewContiner: {
    flex: 0.1,
    backgroundColor: Colors.white,    
    //marginTop: 20,
  },
  scrollView: {
    paddingLeft: 25,
    paddingRight: 25,
  },

  bgImageView: {
    position: 'absolute',
    width: Utility.screenWidth,
    height: Utility.screenHeight,
  },
  viewMenuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  viewFriendsMenuContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },



  subContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  ////////
  NavigationMenuItemBlockStyle: {    
    flex: 1,
    flexDirection:'row',    
    marginHorizontal: 40,
    marginVertical: 6,
    backgroundColor: Colors.white
  },
  NavigationMenuFlatListComponentStyle: {
    marginTop: 2,
  },
  NavigationMenuItemStyle: {
    color: Colors.green,
    padding: 10,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(18),
    justifyContent: 'flex-start',
  },
  topViewStyle: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: Colors.transparent
  },
  titleView: {
    flex: 1,
    marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  titleTextStyle: {
    marginLeft: 10,
    color: Colors.green,
    fontFamily: Fonts.santanaBlack,
    fontSize: Utility.NormalizeFontSize(20),
  },
  profilePicView: {
    marginTop: 5,
    flexDirection: 'row',
    // flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profilePicEditView: {
    marginRight: 15,
    // flexDirection: 'row',
    // flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editTextStyle: {
    color: Colors.green,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(10),
    marginTop: 2,
  },
  profileImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  placeHolderPhotoStyle: {
    height: 60,
    width: 60,    
    borderColor: Colors.blueType2,
    resizeMode: 'cover',        
  },
  forwardArrow: {
    marginBottom: 15,
    marginRight: 5
  },
  //Bottom View
  txtLogOut: {
    color: Colors.green,
    fontSize: Utility.NormalizeFontSize(18),
    fontFamily: Fonts.promptLight,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  btnLogout: {
    justifyContent: 'flex-start',
    marginHorizontal: 40,
    height: 45,
    marginBottom: 30
  },
});
