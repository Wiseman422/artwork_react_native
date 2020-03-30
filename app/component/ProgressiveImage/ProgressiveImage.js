/*'use strict';
import React, {Component, PropTypes} from "react";
import {View, TextInput, StyleSheet, Image, TouchableOpacity,Animated} from "react-native";
import Colors from '../../config/Colors';

export default class progressiveImage extends Component{
    constructor(props){
        super(props);
        this.state = {
             thumbnailOpacity: new Animated.Value(0)
        }
    }
    onLoad(){
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 0,
            duration : 250
        }).start()

    }
    onThumbnailLoad(){
        Animated.timing(this.state.thumbnailOpacity,{
            toValue: 1,
            duration: 250
        }).start();
    }
    render(){
    var imageUrl=undefined
    if(this.props.url!=undefined)
    {
      imageUrl=this.props.url.trim() == "" ? undefined :this.props.url;
    }

        return (
            <View
            // width={this.props.style.width}
            // height={this.props.style.height}
            backgroundColor={Colors.transparent}
            >

                <Animated.Image
                resizeMode={'contain'}
                 key={this.props.key}
                 style={[
                     {
                         opacity: this.state.thumbnailOpacity,
                         overflow:'hidden'
                     },
                     this.props.style
                 ]}
                 source={this.props.thumbnail}
                 onLoad={(event) => this.onThumbnailLoad(event)}
                 />
                 <Animated.Image

                    key = {this.props.key}
                    style = {[
                        {
                            position: 'absolute'
                        },
                        this.props.style
                    ]}

                    source = {{uri:imageUrl}}
                    onLoad = {(event)=>this.onLoad(event)}
                 />
            </View>
        )
    }
}
*/


import React from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, ActivityIndicator, View } from 'react-native';

class ProgressiveImage extends React.Component {
  static propTypes = {
    isShowActivity: PropTypes.bool,
  };

  static defaultProps = {
    isShowActivity: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isError: false,
      isLoadComplete: false
    };
  }


  componentWillReceiveProps(nextProps) {

  }
  onLoadEnd(a) {
    this.setState({
      isLoaded: true,
    });
  }

  onError(a) {
    this.setState({
      isError: true,

    });
  }

  render() {
    const {
      style, uri, image, resizeMode, borderRadius, backgroundColor, children,
      loadingStyle, placeholderSource, placeholderStyle,
      customImagePlaceholderDefaultStyle
    } = this.props;

    var source = undefined;
    if (uri != undefined) {
      source = uri.length > 0 ? { uri: uri } : undefined
    } else if (image != undefined) {
      source = image
    }
    var isLoadingError = this.state.isError;
    if (uri != undefined) {
      if (uri.startsWith('http') == false) {
        isLoadingError = false
      }
    }

    return (
      <ImageBackground
        onLoadEnd={this.onLoadEnd.bind(this)}
        onError={this.onError.bind(this)}
        style={[styles.backgroundImage, style]}
        source={source}
        resizeMode={resizeMode}
        borderRadius={borderRadius}
      >
        {
          (this.state.isLoaded && isLoadingError == false)
            ? children
            : <View
              style={[styles.viewImageStyles, { borderRadius: borderRadius }, backgroundColor ? { backgroundColor: backgroundColor } : {}]}
            >
              {
                (this.props.isShowActivity && !isLoadingError && source != undefined) ?
                  <ActivityIndicator
                    style={styles.activityIndicator}
                    size={loadingStyle ? loadingStyle.size : 'small'}
                    color={loadingStyle ? loadingStyle.color : 'gray'}
                  />
                  : null
              }
              <Image
                style={placeholderStyle ? placeholderStyle : [styles.imagePlaceholderStyles, customImagePlaceholderDefaultStyle]}
                source={placeholderSource ? placeholderSource : null}
              >
              </Image>
            </View>
        }
        {
          this.props.children &&
          <View style={styles.viewChildrenStyles}>
            {
              this.props.children
            }
          </View>
        }
      </ImageBackground>
    );
  }
}

const styles = {
  backgroundImage: {
    position: 'relative',
    overflow: 'hidden'
  },
  activityIndicator: {
    position: 'absolute',
    margin: 'auto',
    zIndex: 9,
  },
  viewImageStyles: {
    flex: 1,
    backgroundColor: '#e9eef1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderStyles: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewChildrenStyles: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
  }
}

export default ProgressiveImage;