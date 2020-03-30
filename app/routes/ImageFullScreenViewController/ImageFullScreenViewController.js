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
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';

class ImageFullScreenViewController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            artwork_photos: this.props.artwork_photos ? this.props.artwork_photos : [],
            // artwork_photos: [
            //     {
            //         "image_path": "http://52.25.140.200:5011/artwork_images/1354057016177992200.jpg",
            //         "image_name": "1354057016177992200.jpg",
            //         "thumb_name": "http://52.25.140.200:5011/artwork_images/thumb/1354057016177992200_thumb.jpg"
            //     },
            //     {
            //         "image_path": "http://52.25.140.200:5011/artwork_images/1143504134747353000.jpg",
            //         "image_name": "1143504134747353000.jpg",
            //         "thumb_name": "http://52.25.140.200:5011/artwork_images/thumb/1143504134747353000_thumb.jpg"
            //     },
            //     {
            //         "image_path": "http://52.25.140.200:5011/artwork_images/1143504134747353000.jpg",
            //         "image_name": "1143504134747353000.jpg",
            //         "thumb_name": "http://52.25.140.200:5011/artwork_images/thumb/1143504134747353000_thumb.jpg"
            //     },
            //     {
            //         "image_path": "http://52.25.140.200:5011/artwork_images/1354057016177992200.jpg",
            //         "image_name": "1354057016177992200.jpg",
            //         "thumb_name": "http://52.25.140.200:5011/artwork_images/thumb/1354057016177992200_thumb.jpg"
            //     },
            // ],
            pageIndex: this.props.click_index ? this.props.click_index : 0,
            isNextButtonTapped: false,
            from: this.props.from,
        }
    }

    componentDidMount() {
        console.log('artwork_photos', this.state.artwork_photos)
        let wait = new Promise((resolve) => setTimeout(resolve, 1000));  // Smaller number should work
        wait.then(() => {
            this.refs.flatListRef.scrollToIndex({ index: this.state.pageIndex, animated: true });
        });
    }

    renderTourCell(rowData) {
        var dictItem = rowData.item

        return (
            <View style={styles.listViewCellStyle}>
                {/* <ProgressiveImage
                    style={styles.iconStyle}
                    uri={(dictItem.image_path != "" ? dictItem.image_path : undefined)}
                    placeholderSource={Images.placeholderMediaImage}
                    borderRadius={1} /> */}
                <CachedImage
                    style={styles.iconStyle}
                    source={{
                        uri: dictItem.image_path
                    }}
                    fallbackSource={Images.placeholderMediaImage}
                />
            </View>
        );
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
    leftBtnTaaped() {
        Utility.navigator.pop({
            animated: true,
        });
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.titleView}>
                    <TouchableOpacity style={{ padding: 10 }} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                        <Image style={{ margin: 4 }} source={Images.topBarBackGreen} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // ref='flatListRef'
                    //For scroll to selected index
                    ref={(list) => this.flatListRef = list} getItemLayout={(data, index) => ({
                        length: Utility.screenWidth,
                        offset: Utility.screenWidth * index,
                        index
                    })} snapToAlignment={'center'} snapToInterval={Utility.screenWidth.width}
                    style={styles.listViewStyle}
                    data={this.state.artwork_photos}
                    renderItem={this.renderTourCell.bind(this)}
                    horizontal={true}
                    pagingEnabled
                    initialNumToRender={this.state.artwork_photos.length}
                    initialScrollIndex={this.state.pageIndex}
                    onScrollToIndexFailed={() => { }}
                    extraData={this.state}
                    keyExtractor={(item, index) => index + ''}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={this.onScrollEnd.bind(this)}
                />
                <PageControl
                    style={{ marginVertical: 15 }}
                    numberOfPages={this.state.artwork_photos.length}
                    currentPage={this.state.pageIndex}
                    hidesForSinglePage
                    pageIndicatorTintColor='lightgray'
                    currentPageIndicatorTintColor={Colors.themeColor}
                    indicatorStyle={{ borderRadius: 5 }}
                    currentIndicatorStyle={{ borderRadius: 5 }}
                    indicatorSize={{ width: 10, height: 10 }}
                />
                {/* <TouchableOpacity onPress={() => this.onNextTapped()} activeOpacity={0.8}>
                    <View style={styles.viewNextStyle}>
                        <Text style={styles.textNextStyle}>{this.state.pageIndex == 4 ? this.state.from == 'sidebar' ? 'DONE' : 'GET STARTED' : 'NEXT'}</Text>
                    </View>
                </TouchableOpacity> */}
            </SafeAreaView>
        );
    }

}
export default ImageFullScreenViewController