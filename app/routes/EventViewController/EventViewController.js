import React, { Component } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity } from 'react-native';

import styles from './styles'

import ProgressiveImage from '../../component/ProgressiveImage';
import SafeAreaView from '../../component/SafeAreaView';

import Settings from '../../config/Settings';
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';

import Spinner from 'react-native-loading-spinner-overlay';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Fonts from '../../config/Fonts';


class EventViewController extends Component {

    constructor(props) {
        super(props);
        console.disableYellowBox = true;
        // Utility.navigator = this.props.navigator;
        this.state = {
            arrMonthEventList: [],
            dictMarkedMonthDays: [],
            arrMonthEventDates: [],
            spinnerVisible: false,

        };
        LocaleConfig.locales['en_us'] = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        };
        LocaleConfig.defaultLocale = 'en_us';
    }

    componentDidMount() {
        var reqParam = {
            'user_id': Utility.user.user_id + '',
            'page': 1 + '',
            'month': Utility.getCurrentMonthNumber() + '',
            'year': Utility.getCurrentYear() + '',
        }
        this.callEventList(reqParam)
    }

    //API
    callEventList(reqParam) {
        // console.log(reqParam)
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_EVENT_LIST, reqParam, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.setupMarkedEvents(response.result)
            } else {
                Utility.showToast(error.message);
            }
        });
    }

    setupMarkedEvents(responseEvents) {
        let arrEventDates = responseEvents.map(function (d) { return d['event_datetime']; })
        var dictMarkedDate = {}
        var dictCustomStyle = { 'container': styles.markDayContainerStyle, 'text': styles.markDayTextStyle }
        var dictCalenderOptions = { 'selected': false, 'customStyles': dictCustomStyle }
        arrEventDates.map((timestamp) => {
            var eventDate = Utility.getFormatedDate(timestamp)
            dictMarkedDate[eventDate] = dictCalenderOptions

        })
        this.setState({ dictMarkedMonthDays: dictMarkedDate, arrMonthEventList: responseEvents })
    }

    renderEventListViewCell(rowData) {
        var event = rowData.item
        return (
            <TouchableOpacity onPress={() => this.goEventDetailScreen(event)} activeOpacity={1}>
                <View style={styles.eventItemStyle}>
                    <ProgressiveImage
                        style={styles.eventImageStyle}
                        uri={event.event_photo}
                        placeholderSource={Images.placeholderMediaImage}
                        borderRadius={1} />
                    <View style={styles.viewEventNameStyle}>
                        <Text style={styles.textEventName} numberOfLines={1}>
                            {event.title}
                        </Text>
                        <Text style={styles.textEventInfo}>
                            {Utility.getEventFormatDate(event.event_datetime) + " - " + event.address}
                        </Text>
                    </View>
                    <View style={styles.viewPriceCart}>
                        <Text style={styles.textPriceCart} numberOfLines={1}>
                            {Utility.DOLLOR}{Utility.parseFloat(event.price)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    backBtnTapped() {
        Utility.navigator.pop({
            animated: true,
        });
    }

    goEventDetailScreen(event) {
        Utility.push('EventDetailViewController', { eventId: event.id })
    }
    onMonthChange(object) {
        var reqParam = {
            'user_id': Utility.user.user_id,
            'page': 1,
            'month': object.month,
            'year': object.year
        }
        this.callEventList(reqParam)
    }
    onDayChange(object) {
        // var reqParam = {
        //     'user_id': Utility.user.user_id,
        //     'page': 1,
        //     // 'month': object.month,
        //     // 'year': object.year
        //     'date':object.dateString
        // }
        // this.callEventList(reqParam)
        const indexx = this.state.arrMonthEventList.findIndex(item => Utility.getEventDateYYYYMMDD(item.event_datetime) === object.dateString);
        if (indexx >= 0)
            this.list.scrollToIndex({ index: indexx })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topViewStyle}>
                    <TouchableOpacity onPress={this.backBtnTapped.bind(this)} activeOpacity={0.7}>
                        <View style={styles.titleView}>
                            <Image source={Images.topBarBackGreen} />
                            <Text style={styles.titleTextStyle}>EVENTS AND CLASSES</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Calendar
                    style={styles.calendar}
                    onDayLongPress={this.onDayLongPress}
                    onMonthChange={(object) => this.onMonthChange(object)}
                    hideExtraDays
                    minDate={'2017-01-01'}
                    markingType={'custom'}
                    markedDates={this.state.dictMarkedMonthDays}
                    hideArrows={false}
                    onDayPress={(object) => this.onDayChange(object)}
                    theme={{
                        dayTextColor: Colors.themeColor,
                        textSectionTitleColor: Colors.themeColor,
                        textDayHeaderFontFamily: Fonts.promptRegular,
                        selectedDayBackgroundColor: Colors.themeColor,
                        todayTextColor: Colors.blueType2,
                        arrowColor: 'black',
                        monthTextColor: Colors.blueType2,
                        textDayFontFamily: Fonts.promptRegular,
                        textDayFontSize: 14,
                        textMonthFontFamily: Fonts.promptBold,
                        textMonthFontWeight: '600',
                        textMonthFontSize: 14,
                    }}
                />
                {this.state.arrMonthEventList.length > 0 ?
                    <FlatList
                        style={styles.listViewCellStyle}
                        data={
                            this.state.arrMonthEventList
                        }
                        renderItem={
                            this.renderEventListViewCell.bind(this)
                        }
                        numColumns={1}
                        extraData={this.state}
                        keyExtractor={(item, index) => index + ''}
                        ref={el => this.list = el}
                    /> :
                    <Text style={styles.txtNoEventFoundStyle}>No events found</Text>}

                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }
}
export default EventViewController