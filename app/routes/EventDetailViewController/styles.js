import { StyleSheet, Platform } from 'react-native';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Settings from '../../config/Settings';

export default StyleSheet.create({
  eventDetailViewStyle: {
    marginTop: 20,
    marginHorizontal: 20,
    flex: 1,
  },
  artistNameText: {
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.grayTextColor,
    alignItems: 'center',
    fontFamily: Fonts.promptRegular,
  },
  eventProfile: {
    marginTop: 5,
    flexDirection: 'row',
  },
  eventNamePrice: {
    // flex: 1,
    marginTop: 2,
    // paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  eventNameText: {
    flex: 1,
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(23),
    fontFamily: Fonts.promptRegular,
    color: Colors.black,
  },
  viewPriceStyle: {
    flex: 0.25,
    backgroundColor: Colors.themeColor,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'center',
    maxHeight: 25,
    marginLeft: 4,
    alignItems: 'center'
    // marginRight: 5
  },
  txtPriceStyle: {
    fontSize: Utility.NormalizeFontSize(12),
    color: 'white',
    fontFamily: Fonts.promptRegular,
  },
  buttonTitleStyle: {
    color: Colors.white,
    fontSize: Utility.NormalizeFontSize(8),
    fontFamily: Fonts.promptMedium,
  },
  eventDescriptionText: {
    marginTop: 10,
    paddingHorizontal: 10,
    fontSize: Utility.NormalizeFontSize(12),
    minHeight: 80,
    fontFamily: Fonts.promptLight,
  },
  addToCalenderBuyTicketNowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 20,
    marginHorizontal: 20
  },
  btnAddToCalendar: {
    flex: 0.7,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: Colors.blueType1,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  calendarText: {
    color: Colors.green,
    fontSize: Utility.NormalizeFontSize(9),
    fontFamily: Fonts.promptRegular,
    backgroundColor: 'transparent',
  },
  btnBuyTicketNow: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 13,
    borderColor: Colors.themeColor,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  buyTicketText: {
    color: Colors.blueType1,
    fontSize: Utility.NormalizeFontSize(12),
    fontFamily: Fonts.promptRegular,
    backgroundColor: 'transparent',
  },
});