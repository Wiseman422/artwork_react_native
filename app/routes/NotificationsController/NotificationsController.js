import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import WebClient from '../../config/WebClient';
import Fonts from '../../config/Fonts';
import TopbarView from '../../component/TopbarView';
import SafeAreaView from '../../component/SafeAreaView';
import Spinner from 'react-native-loading-spinner-overlay';

class NotificationsController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsData: [],
      totalRecords: 0,
      page: 1,
      spinnerVisible: false,
      isDataReceived: false,
    }
  }

  componentDidMount() {
    this.getNotifications()
  }

  btnBackTapped() {
    Utility.navigator.pop({
      animated: true,
    });
  }

  getNotifications() {
    WebClient.postRequest(Settings.URL.GET_NOTIFICATIONS_LIST, {
      "user_id": Utility.user.user_id + '',
      "page": this.state.page + '',
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        this.setState({ isDataReceived: true, notificationsData: this.state.page > 1 ? [...this.state.notificationsData, ...response.result] : response.result, totalRecords: response.totalcount })
      } else {
        Utility.showToast(error.message);
      }
    });
  }

  endNotification() {
    if (this.state.notificationsData.length < this.state.totalRecords) {
      this.setState({
        spinnerVisible: true,
        page: this.state.page + 1
      }, this.getNotifications.bind(this))
    }
  }

  renderItem(rowData) {
    var rowItem = rowData.item
    var rowIndex = rowData.index;

    var date = new Date(rowItem.created_date);
    return (
      <TouchableOpacity style={styles.cellContainer} activeOpacity={1.0} >
        <Image style={styles.notificationIcon} source={Images.bellNotificationIcon}></Image>
        <View style={styles.notifContainer}>
          <Text style={styles.notificationTitleText}>{rowItem.title}</Text>
          <Text style={styles.notificationMessageText}>{rowItem.notification_text}</Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{Utility.getDateMMMdd(rowItem.notification_date)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    var noView = <View style={styles.noData}>
      {this.state.isDataReceived ?
        <Text style={styles.noRecordsFoundTextStyle}>No notification found</Text>
        : null
      }
    </View>
    var listView = <FlatList onEndReachedThreshold={0.5} onEndReached={() => this.endNotification()} style={styles.listContainer} showsVerticalScrollIndicator={false} data={this.state.notificationsData} extraData={this.state} renderItem={this.renderItem.bind(this)} keyExtractor={(item, index) => index + ''} />
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.topViewStyle}>
          <TouchableOpacity onPress={this.btnBackTapped.bind(this)} activeOpacity={0.7}>
            <View style={styles.titleView}>
              <Image source={Images.topBarBackGreen} />
              <Text style={styles.titleTextStyle}>NOTIFICATIONS</Text>
            </View>
          </TouchableOpacity>
        </View>
        {this.state.notificationsData.length > 0 ? listView : noView}
        <Spinner visible={this.state.spinnerVisible} />
      </SafeAreaView>
    );
  }
}
export default NotificationsController
