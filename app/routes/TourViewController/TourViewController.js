import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';
import PageControl from 'react-native-page-control';
import SafeAreaView from '../../component/SafeAreaView';
import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import User from '../../models/User';

class TourViewController extends Component {

    constructor(props) {
        super(props);
        Utility.navigator = this.props.navigator;
        this.state = {
            arrTourData: [{ 'image': Images.artboardLogo, 'text': 'WELCOME TO YOUR LOCAL ART SCENE', 'shortDesc': 'Let us walk you \n through the basics.' }, { 'image': Images.artboardBag, 'text': 'SHOP FROM LOCAL ARTISTS', 'shortDesc': 'Explore a wide variety of \n artists and mediums to \n discover something great.' }, { 'image': Images.artboardPen, 'text': 'COMMISSION UNIQUE WORK', 'shortDesc': 'Communicate directly \n with artists and order a \n custom piece of artwrok!' }, { 'image': Images.artboardCalendar, 'text': 'VIEW UPCOMING EVENTS & CLASSES', 'shortDesc': 'Easily find and sign up \n for events and classes \n in the curated calendar.' }, { 'image': Images.artboardUser, 'text': 'SET UP YOUR PROFILE', 'shortDesc': 'Please create an account \n to purchase artwork. \n This helps protect our \n artists against fraud.' }],
            pageIndex: 0,
            isNextButtonTapped: false,
            from: this.props.from,
        }
    }

    renderTourCell(rowData) {
        var dictItem = rowData.item
        return (
            <View style={styles.listViewCellStyle}>
                <Image style={styles.iconStyle} source={dictItem.image} />
                <Text style={styles.textStyle}>{dictItem.text}</Text>
                <Text style={styles.shortDescStyle}>{dictItem.shortDesc}</Text>
            </View>
        );
    }
    //Action
    onNextTapped() {
        if (this.state.pageIndex == 4) {
            if (this.state.from == 'sidebar') {
                this.props.navigator.pop();
            } else {
                Utility.push('SigninController')
            }
        } else {
            if (this.state.pageIndex >= 0) {
                this.setState({ pageIndex: this.state.pageIndex + 1 }, () => this.flatlistScrollToIndex())
            }
        }
    }

    flatlistScrollToIndex() {
        this.refs.flatListRef.scrollToIndex({ animated: true, index: this.state.pageIndex, viewOffset: 0, viewPosition: 0 });
    }

    onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        var pageNum = Math.floor(contentOffset.x / viewSize.width);

        this.setState({ pageIndex: pageNum })

    }

    render() {
        // { console.log(this.state.pageIndex) }
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref='flatListRef'
                    style={styles.listViewStyle}
                    data={this.state.arrTourData}
                    renderItem={this.renderTourCell.bind(this)}
                    horizontal={true}
                    pagingEnabled
                    initialNumToRender={4}
                    initialScrollIndex={this.state.pageIndex}
                    onScrollToIndexFailed={() => { }}
                    extraData={this.state}
                    keyExtractor={(item, index) => index + ''}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                />
                <PageControl
                    style={{ marginVertical: 15 }}
                    numberOfPages={5}
                    currentPage={this.state.pageIndex}
                    hidesForSinglePage
                    pageIndicatorTintColor='lightgray'
                    currentPageIndicatorTintColor={Colors.themeColor}
                    indicatorStyle={{ borderRadius: 5 }}
                    currentIndicatorStyle={{ borderRadius: 5 }}
                    indicatorSize={{ width: 10, height: 10 }}
                />
                <TouchableOpacity onPress={() => this.onNextTapped()} activeOpacity={0.8}>
                    <View style={styles.viewNextStyle}>
                        <Text style={styles.textNextStyle}>{this.state.pageIndex == 4 ? this.state.from == 'sidebar' ? 'DONE' : 'GET STARTED' : 'NEXT'}</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

}
export default TourViewController