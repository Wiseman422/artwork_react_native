/*
 * This example demonstrates how to use ParallaxScrollView within a ScrollView component.
 */
import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ListView,
  PixelRatio,
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import styles from './styles'
import Utility from '../../config/Utility';
import Settings from '../../config/Settings';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Images from '../../config/Images';
import INTButton from '../../component/INTButton'
import SafeAreaView from '../../component/SafeAreaView';
import INTSegmentControl from '../../component/INTSegmentControl';
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import WebClient from '../../config/WebClient';
import Spinner from 'react-native-loading-spinner-overlay';
import Fonts from '../../config/Fonts';

class ArtistDetailViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artist_id: this.props.artist_id,
      artist: null,
      spinnerVisible: false,
      arrSegmentText: [],
      isDataReceived: false,
    };
  }

  componentDidMount() {
    this.getArtistDetailAPI();
  }
  addhttp(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  }
  openURL(url) {
    // console.log("url>>" + url);
    Linking.openURL(this.addhttp(url));
  }

  //API
  getArtistDetailAPI() {
    this.setState({ spinnerVisible: true });
    WebClient.postRequest(Settings.URL.GET_ARTIST_DETAIL, {
      'user_id': Utility.getUserId + '',
      'artist_id': this.state.artist_id,
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        if (response) {
          var arrTempSegment = [];

          if (!!response.source_name_1) {
            arrTempSegment.push(response.source_name_1);
          }
          if (!!response.source_name_2) {
            arrTempSegment.push(response.source_name_2);
          }
          if (!!response.source_name_3) {
            arrTempSegment.push(response.source_name_3);
          }
          if (!!response.source_name_4) {
            arrTempSegment.push(response.source_name_4);
          }
          this.setState({
            artist: response,
            arrSegmentText: arrTempSegment,
            isDataReceived: true,
          });
        }
      } else {
        Utility.showToast(error.message);
      }
    }, true);
  }

  renderArtworkViewCell(rowData) {
    var artwork = rowData.item
    return (
      <TouchableOpacity onPress={() => this.onArtworkTapped(artwork)} activeOpacity={0.9}>
        {/* <ProgressiveImage
          style={styles.articleImageStyle}
          uri={(artwork.artwork_images != "" ? artwork.artwork_images : undefined)}
          placeholderSource={Images.placeholderMediaImage}
          borderRadius={1} /> */}
        <CachedImage
          style={styles.articleImageStyle}
          source={{
            uri: artwork.artwork_images
          }}
          fallbackSource={Images.placeholderMediaImage}
        />
      </TouchableOpacity>
    );
  }

  openSelectedUrl(selectedIndex) {
    if (this.state.artist != undefined) {
      var selectedItem = this.state.arrSegmentText[selectedIndex];
      if (selectedItem == this.state.artist.source_name_1) {
        this.openURL(this.state.artist.source_name_1_url);
      } else if (selectedItem == this.state.artist.source_name_2) {
        this.openURL(this.state.artist.source_name_2_url);
      } else if (selectedItem == this.state.artist.source_name_3) {
        this.openURL(this.state.artist.source_name_3_url);
      } else if (selectedItem == this.state.artist.source_name_4) {
        this.openURL(this.state.artist.source_name_4_url);
      }
    }
  }

  followButtonTapped() {
    if (Utility.user == undefined) {
      Utility.showLoginAlert(() => {
        Utility.closeSideMenu();
        // Utility.resetTo('SigninController')
        Utility.push('SigninController', {
          isFromNotLogin: true,
          onNavigationCallBack: this.onNavigationCallBack.bind(this)
        })
      });
    } else {
      //this.setState({ spinnerVisible: true });
      WebClient.postRequest(Settings.URL.FOLLOW_ARTIST, {
        'user_id': Utility.user.user_id,
        'artist_id': this.state.artist.artist_id,
      }, (response, error) => {
        //this.setState({ spinnerVisible: false });
        if (error == null) {
          let artistInfo = this.state.artist;
          artistInfo.is_following = artistInfo.is_following == 0 ? 1 : 0;
          this.setState({ artist: artistInfo });
        } else {
          Utility.showToast(error.message);
        }
      }, true);
    }
  }

  requestForCommissionTapped() {
    if (Utility.user == undefined) {
      Utility.showLoginAlert(() => {
        Utility.closeSideMenu();
        // Utility.resetTo('SigninController')
        Utility.push('SigninController', {
          isFromNotLogin: true,
          onNavigationCallBack: this.onNavigationCallBack.bind(this)
        })
      });
    } else {
      Utility.push("RequestCommissionViewController", { artist: this.state.artist })
    }
  }

  onNavigationCallBack(params) {
    if (params.isSuccess == true) {
      this.getArtistDetailAPI();
    }
  }

  leftBtnTaaped() {
    if (this.props.from) {
      this.props.handleCallback();
    }
    Utility.navigator.pop({
      animated: true,
    });
  }

  onArtworkTapped(artwork) {
    Utility.push('ArtDetailViewController', { artwork_id: artwork.artwork_id })
  }

  artImageTapped(click_index) {
    var artwork_photos = [];
    if (this.state.artist != null) {
      var params = {
        "image_path": this.state.artist.profile_banner_photo,
      }
      artwork_photos.push(params);
      Utility.push('ImageFullScreenViewController', { artwork_photos: artwork_photos, click_index: click_index })
    }
  }

  render() {
    const { onScroll = () => { } } = this.props;
    return (
      <ParallaxScrollView
        onScroll={onScroll}
        showsVerticalScrollIndicator={false}
        headerBackgroundColor={Colors.blueType2}
        stickyHeaderHeight={STICKY_HEADER_HEIGHT}
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        backgroundColor={Colors.themeColor}
        renderForeground={() => (
          <TouchableOpacity onPress={this.artImageTapped.bind(this, 0)} activeOpacity={0.7}>
            <View style={{ width: Utility.screenWidth, height: PARALLAX_HEADER_HEIGHT }} />
          </TouchableOpacity>
        )}
        renderBackground={() => (
          <TouchableOpacity onPress={this.artImageTapped.bind(this, 0)} activeOpacity={0.7}>
            <View key="background">
              {/* <ProgressiveImage
              style={{
                width: Utility.screenWidth,
                height: PARALLAX_HEADER_HEIGHT
              }}
              uri={this.state.artist != null ? this.state.artist.profile_banner_photo : undefined}
              placeholderSource={Images.placeholderMediaImage}
            /> */}
              <CachedImage
                style={{
                  width: Utility.screenWidth,
                  height: PARALLAX_HEADER_HEIGHT,
                }}
                source={{
                  uri: this.state.artist != null ? this.state.artist.profile_banner_photo : undefined
                }}
                fallbackSource={Images.placeholderMediaImage}
              />
            </View>
          </TouchableOpacity>
        )}

        renderStickyHeader={() => (
          <View key="sticky-header" style={parallaxStyles.stickySection}>
            <Text style={parallaxStyles.stickySectionText}>{this.state.artist != null ? this.state.artist.full_name : ""}</Text>
          </View>
        )}

        renderFixedHeader={() => (
          <View key="fixed-header" style={parallaxStyles.fixedSection}>
            <TouchableOpacity onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
              <Image source={Images.topBarBackTransparent} />
            </TouchableOpacity>
          </View>
        )}
      >
        {this.state.isDataReceived ?
          <View style={styles.detailViewStyle}>
            <View style={styles.artistInnerDetailViewStyle}>
              <View style={styles.artistProfile}>
                <ProgressiveImage
                  style={styles.artistProfilePhoto}
                  uri={this.state.artist != null ? (this.state.artist.profile_pic != "" ? this.state.artist.profile_pic : undefined) : undefined}
                  placeholderSource={Images.input_userphoto}
                  placeholderStyle={styles.artistPlaceHolderPhoto}
                  borderRadius={1} />
                <View style={{ flex: 1, marginEnd: 10 }}>
                  <Text style={styles.artistNameText} >{this.state.artist != null ? this.state.artist.full_name : ""}</Text>
                  <View style={styles.artistNameProfile}>
                    <Text style={styles.artistCategoryText} >{this.state.artist != null ? (this.state.artist.preferred_medium + ",") : ""} {this.state.artist != null ? this.state.artist.address : ""}</Text>
                    {(this.state.artist != null && Utility.user != undefined) ?
                      (this.state.artist.artist_id == Utility.user.user_id) ?
                        null :
                        <INTButton
                          buttonStyle={styles.followButtonStyle}
                          title={this.state.artist != null ? (this.state.artist.is_following == 0 ? " Follow " : "UnFollow") : " Follow "}
                          titleStyle={styles.buttonTitleStyle}
                          onPress={() => this.followButtonTapped()}
                        /> :
                      null
                    }
                  </View>
                </View>
              </View>
              <Text style={styles.artistProfileDescriptionText}>{this.state.artist != null ? this.state.artist.bio ? this.state.artist.bio : "" : ""}</Text>
              <INTButton
                buttonStyle={styles.btnContactForCommissionStyle}
                title='Contact for Commission'
                titleStyle={styles.btnContactForCommissionTextStyle}
                onPress={() => this.requestForCommissionTapped()}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.segmentContainerView}>
                <INTSegmentControl
                  controllStyle={styles.segmentControllerStyle}
                  arrSegment={this.state.arrSegmentText}
                  segmentWidthStyle='dynamic'
                  titleStyle={styles.segmentTitle}
                  onSelectionDidChange={(selectedIndex) => {
                    this.openSelectedUrl(selectedIndex);
                  }}
                />
              </View>
              <FlatList
                style={styles.artworkPhotosStyle}
                data={this.state.artist != null ? this.state.artist.artwork_data : []}
                renderItem={this.renderArtworkViewCell.bind(this)}
                numColumns={3}
              />
            </View>
          </View>
          : null}
        <Spinner visible={this.state.spinnerVisible} />
      </ParallaxScrollView>
    );
  }
}

const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = Utility.isPlatformAndroid ? 50 : 64;

const parallaxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Utility.screenWidth,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: Utility.screenWidth,//300,
    justifyContent: 'flex-end',
    marginEnd: 6,
  },
  stickySectionText: {
    color: 'white',
    fontSize: Utility.NormalizeFontSize(20),
    marginVertical: 6,
    marginLeft: 40,
    alignContent: 'flex-start',
    fontFamily: Fonts.promptRegular
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    left: 10
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 100
  },
  sectionSpeakerText: {
    color: 'white',
    fontSize: 24,
    paddingVertical: 5
  },
  sectionTitleText: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 5
  },
});

export default ArtistDetailViewController;