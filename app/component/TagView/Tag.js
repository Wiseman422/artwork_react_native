  
  import * as React from 'react';
  
  import {
    View,
    Text,  
    TouchableOpacity,    
    TouchableWithoutFeedback,
    ScrollView,
    ViewPropTypes,
    Platform,
    TextInput,
  } from 'react-native';

  import styles from './styles'

  class Tag extends React.PureComponent {
    curPos = null;  
    componentWillReceiveProps(nextProps) {
      if (
        !this.props.isLastTag &&
        nextProps.isLastTag &&
        this.curPos !== null &&
        this.curPos !== undefined
      ) {
        this.props.onLayoutLastTag(this.curPos);
      }
    }
  
    render() {
      return (
        <TouchableOpacity
          onPress={this.onPress}
          onLayout={this.onLayoutLastTag}
          activeOpacity = {0.9}
          style={[
            styles.tag,
            { backgroundColor: this.props.tagColor},
            this.props.tagContainerStyle,
          ]}>          
          <Text style={[
            styles.tagText,
            { color: this.props.tagTextColor },
            this.props.tagTextStyle,
          ]}>
            {this.props.label}
            {/* for close we add below html character */}
            {/* &nbsp;&times;  */}
          </Text>         
        </TouchableOpacity>  
        );
    }
  
    onPress = () => {     
      this.props.onPress(this.props.index);
    }
  
    onLayoutLastTag = (event) => {
      const layout = event.nativeEvent.layout;
      this.curPos = layout.width + layout.x;
      if (this.props.isLastTag) {
        this.props.onLayoutLastTag(this.curPos);
      }
    }
  
  } 
 
  export default Tag;