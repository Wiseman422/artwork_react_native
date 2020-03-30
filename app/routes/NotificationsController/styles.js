import { StyleSheet } from 'react-native';
import Settings from '../../config/Settings';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Images from '../../config/Images';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff'
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
    color: Colors.themeColor,
    fontFamily: Fonts.santanaBlack,
    fontSize: Utility.NormalizeFontSize(22),
    marginLeft: 10
  },

  listContainer: {
    marginTop: 15,
    flex: 1,
  },
  cellContainer: {
    flexDirection: 'row',
    borderRadius: 2,
    borderWidth: 0.8,
    borderColor: Colors.blueType4,
    marginHorizontal: 6,
    backgroundColor: Colors.grayType1,
    marginTop: 6,
    padding: 3
  },
  notificationIcon: {
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  notifContainer: {
    flex: 1,
    marginLeft: 3,
  },
  notificationTitleText: {
    color: Colors.themeColor,
    fontFamily: Fonts.promptMedium,
    fontSize: Utility.NormalizeFontSize(12)
  },
  notificationMessageText: {
    color: Colors.grayTextColor2,
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(10),
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  dateText: {
    fontFamily: Fonts.promptLight,
    fontSize: Utility.NormalizeFontSize(10),
    color: Colors.grayTextColor2,
    marginRight: 5,
  },
  noData: {
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  // noDataText: {
  //   color: Colors.grayTextColor,
  //   fontFamily: Fonts.semibold,
  //   fontSize: 17,
  // },
  //No Record found
  noRecordsFoundTextStyle: {
    fontFamily: Fonts.promptRegular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.lightGray3Color,
    flex: 1,
    textAlign: 'center',
    marginTop: 250,
  },
});