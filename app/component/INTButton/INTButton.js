
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image
} from 'react-native';
import styles from './styles';



const IconPosition = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom'
}


export default class INTButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title || '',
      titleSelected: this.props.titleSelected || '',
      icon: this.props.icon || null,
      iconSelected: this.props.iconSelected || null,
      backgroundImage: this.props.backgroundImage || null,
      backgroundImageSelected: this.props.backgroundImageSelected || null,
      isSelected: this.props.isSelected || false,
      isDisable: this.props.isDisable || false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title != undefined) {
      this.setState({ title: nextProps.title })
    }
    if (nextProps.titleSelected != undefined) {
      this.setState({ titleSelected: nextProps.titleSelected })
    }
    if (nextProps.icon != undefined) {
      this.setState({ icon: nextProps.icon })
    }
    if (nextProps.iconSelected != undefined) {
      this.setState({ iconSelected: nextProps.iconSelected })
    }
    if (nextProps.isSelected != undefined) {
      this.setState({ isSelected: nextProps.isSelected })
    }
    if (nextProps.isDisable != undefined) {
      this.setState({ isDisable: nextProps.isDisable })
    }

  }

  componentDidMount() {

  }

  static defaultProps = {
    iconPosition: IconPosition.Left,
    spaceBetweenIconAndTitle: 10,
    buttonStyle: {}, //Optional
    buttonStyleSelected: {}, //optional
    titleStyle: {},//optional
    titleStyleSelected: {},//optional
    isTextOnlySegment: true,
    backgroundImage: undefined,
    backgroundImageSelected: undefined

  };

  onPress() {
    if (this.props.onPress != undefined) {
      this.props.onPress();
    }
  }


  render() {

    var isTextOnly = this.props.icon == undefined ? true : false

    var arrStyle = [styles.button];
    var arrTitleStyle = [styles.title]
    var title = this.state.title;
    var icon = this.state.icon
    var backgroundImage = this.state.backgroundImage

    // Add custome style provided dynamically provided by dev
    arrStyle.push(this.props.buttonStyle)
    arrTitleStyle.push(this.props.titleStyle)



    // Add flex direction as per icon position 
    if (this.props.iconPosition == IconPosition.Left || this.props.iconPosition == IconPosition.Right) {
      arrStyle.push({ flexDirection: 'row' })
    } else {
      arrStyle.push({ flexDirection: 'column' })
    }

    //Change style and icon for selected button state    

    if (this.state.isSelected == true) {
      arrTitleStyle.push(this.props.titleStyleSelected)
      arrStyle.push(this.props.buttonStyleSelected)
      icon = this.state.iconSelected || this.state.icon
      title = this.state.titleSelected || this.state.title
      backgroundImage = this.state.backgroundImageSelected || this.state.backgroundImage
    }

    // Add icon and space view if isTextOnly = false default value is true
    var iconView = <Image key={1} source={icon}></Image>
    var viewSpaceBetween = <View key={2} style={{ width: this.props.spaceBetweenIconAndTitle, height: this.props.spaceBetweenIconAndTitle }}></View>

    if (isTextOnly == true) {
      iconView = null
      viewSpaceBetween = null
    } else if (this.state.title.length == 0) {
      viewSpaceBetween = null
    }



    return (
      <TouchableOpacity style={arrStyle} onPress={() => this.onPress()} activeOpacity={0.70} disabled={this.state.isDisable}>
        <Image style={styles.backgroundImage} source={backgroundImage} />

        {(this.props.iconPosition == IconPosition.Left || this.props.iconPosition == IconPosition.Top)
          ? [iconView, viewSpaceBetween]
          : null}

        {this.props.title ? <Text style={arrTitleStyle}> {title}</Text> : null}

        {(this.props.iconPosition == IconPosition.Right || this.props.iconPosition == IconPosition.Bottom)
          ? [viewSpaceBetween, iconView]
          : null}

      </TouchableOpacity>
    );
  }
}
