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
  Modal,
  TouchableOpacity,
  TextInput
} from 'react-native';
import styles from './styles'
import Utility from '../../config/Utility';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Images from '../../config/Images';
import ProgressiveImage from '../../component/ProgressiveImage';
import { CachedImage } from 'react-native-cached-image';
import Colors from '../../config/Colors';
import Spinner from 'react-native-loading-spinner-overlay';
import INTButton from '../../component/INTButton'
import WebClient from '../../config/WebClient';
import { Settings } from '../../config/Settings';
import Fonts from '../../config/Fonts';
import ModalBox from 'react-native-modalbox';
import TagView from '../../component/TagView';

class ArtDetailViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      artwork: undefined,
      artwork_id: this.props.artwork_id,
      from: this.props.from,
      // isMyArtwork: true,
      isAbuseDescriptionVisible: false,
      textAbuseDescription: '',
      arrTagsHorizontal: [],
      isFromHomeScreen: this.props.isFromHomeScreen == undefined ? false : this.props.isFromHomeScreen,
      isDataReceived: false,
      is_product_sold: 0,
    }
  }

  componentDidMount() {
    this.callArtworkDetailAPI()
  }

  onCancelAbuseTapped() {
    this.setState({ isAbuseDescriptionVisible: false })
  }

  onSubmitAbuseTapped() {
    if (this.state.textAbuseDescription.trim().length > 0) {
      this.callReportArtworkAPI()
    } else {
      Utility.showToast(Utility.MESSAGES.please_enter_des)
    }
  }

  showAbuseView() {
    var sizeModelbox = <ModalBox
      coverScreen={false}
      backdropPressToClose={false}
      swipeToClose={false}
      backButtonClose={false}
      onClosed={() => this.setState({ isAbuseDescriptionVisible: false })}
      style={styles.modalContainer}
      isOpen={this.state.isAbuseDescriptionVisible}
      position='center'>
      <View style={styles.joinViewContainer}>
        <View style={styles.abuseInnerContainerView}>
          <TextInput
            style={Utility.isPlatformAndroid ? styles.joinTextInputAndroid : styles.joinTextInput}
            // style={ styles.joinTextInput}
            multiline={true}
            onChangeText={(textAbuseDescription) => this.setState({ textAbuseDescription })}
            value={this.state.textAbuseDescription}
            placeholder={"Please describe here"}
            placeholderTextColor='lightgray'
          />
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
            <INTButton buttonStyle={styles.abuseButtonStyle}
              title='Cancel'
              titleStyle={styles.abuseButtonTextStyle}
              onPress={() => this.onCancelAbuseTapped()}
            />
            <INTButton buttonStyle={styles.abuseButtonStyle}
              title='Submit'
              titleStyle={styles.abuseButtonTextStyle}
              onPress={() => this.onSubmitAbuseTapped()}
            />
          </View>
        </View>
      </View>
    </ModalBox >
    return sizeModelbox;
  }

  //API
  addToCartAPI(navigateToCart) {
    this.setState({ spinnerVisible: true });
    WebClient.postRequest(Settings.URL.ADD_TO_CART, {
      'user_id': Utility.getUserId + '',
      'artwork_id': this.state.artwork != undefined ? this.state.artwork.artwork_id + '' : '',
      'quantity': 1 + '',// default 
      'cart_id': 0 + '',// 0 for new add 
      'unique_device_id': Utility.deviceId + '',
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        Utility.showToast(Utility.MESSAGES.added_to_cart);
        var tempArtwork = { ...this.state.artwork };
        tempArtwork.is_incart = 1;
        tempArtwork.cart_id = response.cart_id
        this.setState({ artwork: tempArtwork });

        if (navigateToCart == true) {
          Utility.push('CartViewController')
        }
      } else {
        Utility.showToast(error.message);
      }
    }, true);
  }

  callReportArtworkAPI() {
    this.setState({ spinnerVisible: true });
    WebClient.postRequest(Settings.URL.REPORT_ARTWORK, {
      'user_id': Utility.user.user_id + '',
      'artwork_id': this.state.artwork != undefined ? this.state.artwork.artwork_id + '' : '',
      'description': this.state.textAbuseDescription + ''
    }, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        Utility.showToast(Utility.MESSAGES.report_added)
        var tempArtwork = this.state.artwork
        tempArtwork.is_reported = 1
        this.setState({ isAbuseDescriptionVisible: false, artwork: tempArtwork })
      } else {
        Utility.showToast(error.message);
      }
    });
  }

  btnBuyNowTapped() {
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
      if (this.state.artwork != undefined) {
        if (this.state.artwork.is_incart == 1) {
          Utility.push('CartViewController')
        } else {
          this.addToCartAPI(true)
        }
      }
    }
  }


  onNavigationCallBack(params) {
    if (params.isSuccess == true) {
      this.callArtworkDetailAPI();
    }
  }

  btnAddToCartTapped() {
    // if (Utility.user == undefined) {
    //   Utility.showLoginAlert();
    // } else {
    if (this.state.artwork != undefined) {
      if (this.state.artwork.is_incart == 1) {
        Utility.showToast(Utility.MESSAGES.already_in_cart);
      } else {
        this.addToCartAPI(false)
      }
    }
    // }
  }

  backBtnTaaped() {
    if (this.state.isFromHomeScreen == true) {
      this.props.childScreenCallback(this.state.artwork)
    }

    Utility.navigator.pop({
      animated: true,
    });
  }

  btnReportTapped() {
    if (Utility.user == undefined) {
      Utility.showLoginAlert();
    } else {
      if (this.state.artwork != undefined) {
        if (this.state.artwork.is_reported == 0) {
          this.setState({ isAbuseDescriptionVisible: true })
        }
      }
    }
  }
  //API
  callArtworkDetailAPI() {
    this.setState({ spinnerVisible: true });
    var params = {
      'user_id': Utility.getUserId + '',
      'artwork_id': this.state.artwork_id + '',
      'unique_device_id': Utility.deviceId + '',
    };
    WebClient.postRequest(Settings.URL.GET_ARTWORK_DETAIL, params, (response, error) => {
      this.setState({ spinnerVisible: false });
      if (error == null) {
        if (response) {
          this.setState({
            artwork: response,
            is_product_sold: response.is_product_sold,
            arrTagsHorizontal: response.tags,
            isMyArtwork: (response.artist_id == Utility.getUserId),
            isDataReceived: true
          })
        }
      } else {
        Utility.showToast(error.message);
      }
    }, true);
  }
  artImageTapped(click_index) {
    if (this.state.artwork != undefined) {
      if (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) {
        Utility.push('ImageFullScreenViewController', { artwork_photos: this.state.artwork.artwork_photos, click_index: click_index })
      }
    }
  }
  renderItem(rowData) {
    var artImageItem = rowData.item;
    var click_index = rowData.index;
    var commentMedia = null;
    commentMedia = <View>
      <TouchableOpacity onPress={this.artImageTapped.bind(this, (click_index + 1))} activeOpacity={0.7}>
        {/* <ProgressiveImage
          style={styles.artImageView}
          placeholderStyle={styles.artPhotoPlaceHolderPhoto}
          uri={artImageItem.image_path}
          placeholderSource={Images.placeholderMediaImage}
          borderRadius={1} /> */}
        <CachedImage
          style={styles.artImageView}
          source={{
            uri: artImageItem.image_path
          }}
          fallbackSource={Images.placeholderMediaImage}
        />
      </TouchableOpacity>
    </View>

    return (<View style={{ marginBottom: 2 }}>
      {commentMedia}
    </View>
    );
  }

  onArtistProfileClick() {
    if (this.state.artwork != undefined) {
      Utility.push('ArtistDetailViewController', { artist_id: this.state.artwork.artist_id });
    }
  }
  render() {
    const { onScroll = () => { } } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>


        <ParallaxScrollView
          //leftIcon
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          headerBackgroundColor={Colors.green}
          stickyHeaderHeight={STICKY_HEADER_HEIGHT}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundSpeed={30}
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
                uri={this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) ? (this.state.artwork.artwork_photos[0]).image_path : null : null}
                placeholderSource={Images.placeholderMediaImage}
                onPress={this.artImageTapped.bind(this, 0)}
              /> */}
                <CachedImage
                  style={{
                    width: Utility.screenWidth,
                    height: PARALLAX_HEADER_HEIGHT,
                    zIndex: 1
                  }}
                  source={{
                    uri: this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 0) ? (this.state.artwork.artwork_photos[0]).image_path : null : null
                  }}
                  fallbackSource={Images.placeholderMediaImage}
                />
                <View style={{
                  top: 0,
                  width: Utility.screenWidth,
                  backgroundColor: 'rgba(0,0,0,.4)',
                  height: PARALLAX_HEADER_HEIGHT
                }} />
              </View>
            </TouchableOpacity>
          )}

          renderStickyHeader={() => (
            <View key="sticky-header" style={parallaxStyles.stickySection}>
              <Text numberOfLines={1} style={parallaxStyles.stickySectionText}>{this.state.artwork != undefined ? this.state.artwork.title : ""}</Text>
            </View>
          )}

          renderFixedHeader={() => (
            <View key="fixed-header" style={parallaxStyles.fixedSection}>
              <TouchableOpacity onPress={() => this.backBtnTaaped()} activeOpacity={0.7} style={parallaxStyles.fixedSectionBackButtonContainer}>
                <Image source={Images.topBarBackTransparent} />
              </TouchableOpacity>
              {
                this.state.from == 'SOLD' ?
                  null :
                  <TouchableOpacity onPress={() => this.btnReportTapped()} activeOpacity={0.7} style={parallaxStyles.fixedSectionReportButtonContainer}>
                    <Image source={this.state.artwork != undefined ? (this.state.artwork.is_reported == 0 ? Images.reportFlag : Images.reportFlagRed) : null} />
                  </TouchableOpacity>
              }
            </View>
          )}
        >
          {this.state.artwork != undefined ?
            (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 1) ?
              <View style={{ height: 120, marginTop: 20, marginBottom: 10 }}>
                <FlatList //associated additional artwork horizontal list.
                  style={{ marginHorizontal: 10, }}
                  ItemSeparatorComponent={() => { return <View style={{ backgroundColor: 'transparent', width: 8, height: 80 }} /> }}
                  data={this.state.artwork != undefined ? (this.state.artwork.artwork_photos.length > 1 ? this.state.artwork.artwork_photos.filter((_, i) => i !== 0) : []) : []}
                  horizontal={true}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={(item, index) => index + ''}
                  showsHorizontalScrollIndicator={false}
                />
              </View> :
              null :
            null}
          {this.state.isDataReceived ?
            <View style={this.state.artwork != undefined ? (this.state.artwork.artwork_photos != undefined && this.state.artwork.artwork_photos.length > 1) ? styles.artDetail : [styles.artDetail, { marginTop: 20 }] : [styles.artDetail, { marginTop: 20 }]}>
              <View style={styles.artistProfile}>
                <TouchableOpacity onPress={() => this.onArtistProfileClick()} activeOpacity={0.9}>
                  <ProgressiveImage
                    style={styles.artistProfilePhoto}
                    placeholderStyle={styles.artistPlaceHolderPhoto}
                    uri={this.state.artwork != null ? (this.state.artwork.profile_pic_thumb != "" ? this.state.artwork.profile_pic_thumb : undefined) : undefined}
                    placeholderSource={Images.input_userphoto}
                    borderRadius={1} />
                </TouchableOpacity>
                <View style={styles.artistProfileNameView}>
                  <Text style={styles.artNameTextStyle}>{this.state.artwork != undefined ? this.state.artwork.title : ""}</Text>
                  <View style={styles.artistNameProfile}>
                    <Text style={styles.artistNameTextStyle}>{this.state.artwork != undefined ? this.state.artwork.full_name : ""}</Text>
                    <Text style={styles.artistArtworkStyleTextStyle}>{this.state.artwork != undefined ? this.state.artwork.preferred_medium : ""}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.artInfoDetail}>
                <Text style={[styles.artInfoTextStyle, { flex: 1.4, alignSelf: 'center' }]}>Project Type: <Text style={styles.artInfoNestedTextStyle}>{this.state.artwork != undefined ? this.state.artwork.project_type : ""}</Text></Text>
                <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'center' }]}>Size: <Text style={styles.artInfoNestedTextStyle}>{this.state.artwork != undefined ? this.state.artwork.size : ""}</Text></Text>
              </View>
              {
                this.state.artwork != undefined ?
                  (this.state.artwork.is_delivery == 0 && this.state.artwork.is_shipping == 0 && this.state.artwork.is_pickup == 0) ?
                    null :
                    < Text style={[styles.artInfoTextStyle, { marginTop: 20, flex: 1, alignSelf: 'flex-start', fontFamily: Fonts.promptRegular, }]} > Delivery Options</Text>
                  : null
              }
              <View style={[styles.artInfoDetail, { alignSelf: 'center', marginTop: 4 }]}>
                {this.state.artwork != undefined ?
                  this.state.artwork.is_shipping == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Shipping</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>{Utility.DOLLOR}{this.state.artwork != undefined ? Utility.parseFloat(this.state.artwork.shipping_cost) : ""}</Text>
                    </View>
                    : null : null
                }
                {this.state.artwork != undefined ?
                  this.state.artwork.is_delivery == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Delivery</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>{Utility.DOLLOR}{this.state.artwork != undefined ? Utility.parseFloat(this.state.artwork.delivery_cost) : ""}</Text>
                    </View>
                    : null : null
                }
                {this.state.artwork != undefined ?
                  this.state.artwork.is_pickup == 1 ?
                    <View style={{ flex: 1, marginEnd: 2 }}>
                      <Text style={[styles.artInfoTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Pickup</Text>
                      <Text style={[styles.artInfoNestedTextStyle, { flex: 1, alignSelf: 'flex-start' }]}>Free</Text>
                    </View>
                    : null : null
                }
              </View>
              <Text style={[styles.artDescriptionTextStyle, { marginTop: 20 }]}>{this.state.artwork != undefined ? this.state.artwork.description : ""}</Text>

              {/* {As per clinet comment remove Tags} */}
              {/* <View style={styles.artTagsView}>
                <Text style={[styles.artInfoTextStyle, { marginTop: 5, marginBottom: 5 }]}>Tags</Text>
                <TagView
                  ref={(tagView) => (this._tagView = tagView)}
                  horizontal={true}
                  isEditable={false}
                  tags={this.state.arrTagsHorizontal}
                  tagTextStyle={styles.tagTextStyle}
                  tagContainerStyle={{ backgroundColor: Colors.grayType1, borderColor: Colors.blueType1, borderWidth: 0, fontSize: Utility.NormalizeFontSize(10), }}
                  maxHeight={120}
                  inputDefaultWidth={100}>
                </TagView>
              </View> */}
            </View>
            : null}
          <Spinner visible={this.state.spinnerVisible} />
        </ParallaxScrollView>
        {
          this.state.isDataReceived ?
            <View style={[styles.addToCartBuyNowView, { marginLeft: 10, marginRight: 5 }]}>
              {/* Button Add to Cart */}
              {this.state.from == 'CART' || this.state.from == 'SOLD' || this.state.is_product_sold == 1 ?
                null
                :
                <INTButton buttonStyle={styles.btnAddToCart} title={(this.state.artwork != undefined && this.state.artwork.is_incart == 1) ? "Added to Cart" : " Add to Cart "}
                  titleStyle={styles.textAddToCart}
                  spaceBetweenIconAndTitle={0}
                  onPress={() => this.btnAddToCartTapped()} />
              }
              {/*Button Price*/}
              {this.state.is_product_sold == 1 ?
                <INTButton buttonStyle={[styles.btnPrice, { borderColor: Colors.transparent, }]}
                  title={"SOLD"}
                  titleStyle={styles.soldText}
                  spaceBetweenIconAndTitle={0} />
                :
                <INTButton buttonStyle={styles.btnPrice}
                  title={Utility.DOLLOR + (this.state.artwork != undefined ? Utility.parseFloat(this.state.artwork.price) + '' : "0")}
                  titleStyle={styles.textPrice}
                  spaceBetweenIconAndTitle={0} />
              }
              {/*Button Buy Now*/}
              {this.state.from == 'CART' || this.state.from == 'SOLD' || this.state.is_product_sold == 1 ?
                null
                :
                <INTButton buttonStyle={styles.btnAddToCart} title="  Buy Now  "
                  titleStyle={styles.textAddToCart}
                  spaceBetweenIconAndTitle={0}
                  onPress={() => this.btnBuyNowTapped()} />
              }
            </View>
            : null
        }
        {this.showAbuseView()}
      </View >
    );
  }
}

const PARALLAX_HEADER_HEIGHT = 220;
const STICKY_HEADER_HEIGHT = Utility.isPlatformAndroid ? 50 : 64;

const parallaxStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green,
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
    width: Utility.screenWidth,
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
    flex: 1,
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: Utility.screenWidth - 20,
    flexDirection: 'row',
  },
  fixedSectionBackButtonContainer: {
    flex: 1,
    width: 20
  },
  fixedSectionReportButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: 20
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

export default ArtDetailViewController;