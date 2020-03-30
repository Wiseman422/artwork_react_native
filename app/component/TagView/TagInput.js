
  
  import * as React from 'react';
  import PropTypes from 'prop-types';
  import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    ScrollView,
    ViewPropTypes,
    Platform,
  } from 'react-native';

  import invariant from 'invariant';

  import styles from './styles'
  import Tag from './Tag'
  
  
  const windowWidth = Dimensions.get('window').width;
  
  type KeyboardShouldPersistTapsProps =
    "always" | "never" | "handled" | false | true;

  
  class TagInput extends React.PureComponent {
    
    constructor(props) {
      super(props);
      this.state = {
        inputWidth: props.inputDefaultWidth,
        wrapperHeight: 26,
      }
    }

    wrapperWidth = windowWidth;
    spaceLeft = 0;
    // scroll to bottom
    contentHeight = 0;

    // refs
    tagInput = null;
    scrollView = null;
  
    static defaultProps = {
      tagColor: 'blue',
      tagTextColor: '#777777',
      inputDefaultWidth: 100,
      inputColor: '#777777',
      maxHeight: 100,    
      wrapperStyle : styles.wrapper,            
      isEditable : true 
    };
  
    static inputWidth(text, spaceLeft, inputDefaultWidth, wrapperWidth) {
      if (text === "") {
        return inputDefaultWidth;
      } else if (spaceLeft >= 100) {
        return spaceLeft - 10;
      } else {
        return wrapperWidth;
      }
    }     
  
    componentWillReceiveProps(nextProps) {
      const inputWidth = TagInput.inputWidth(
        nextProps.text,
        this.spaceLeft,
        nextProps.inputDefaultWidth,
        this.wrapperWidth,
      );

      if (inputWidth !== this.state.inputWidth) {
        this.setState({ inputWidth });
      }
      const wrapperHeight = Math.min(
        nextProps.maxHeight,
        this.contentHeight,
      );
      if (wrapperHeight !== this.state.wrapperHeight) {
        this.setState({ wrapperHeight });
      }
    }
  
    componentWillUpdate(nextProps, nextState) {
      if (
        this.props.onHeightChange &&
        nextState.wrapperHeight !== this.state.wrapperHeight
      ) {
        this.props.onHeightChange(nextState.wrapperHeight);
      }
    }
  
    measureWrapper = (event) => {
      this.wrapperWidth = event.nativeEvent.layout.width;
      const inputWidth = TagInput.inputWidth(
        this.props.text,
        this.spaceLeft,
        this.props.inputDefaultWidth,
        this.wrapperWidth,
      );
      if (inputWidth !== this.state.inputWidth) {
        this.setState({ inputWidth });
      }
    }
  
    onBlur = (event) => {
      invariant(Platform.OS === "ios", "only iOS gets text on TextInput.onBlur");
      this.props.onChangeText(event.nativeEvent.text);
    }
  
    onKeyPress = (event) => {
      if (this.props.text !== '' || event.nativeEvent.key !== 'Backspace') {
        return;
      }
      const tags = [...this.props.value];
      tags.pop();
      this.props.onChange(tags);
      this.scrollToEnd();
      this.focus();
    }
  
    focus = () => {
      if (this.props.isEditable == true) {
        invariant(this.tagInput, "should be set");
        this.tagInput.focus();
      }       
    }
  
    deleteTag = (index) => {
      // const tags = [...this.props.value];
      // tags.splice(index, 1);
      // this.props.onChange(tags);

      if (this.props.onTagClick != undefined) {
        this.props.onTagClick(index)
      }
    }
  
    scrollToEnd = () => {      
      const scrollView = this.scrollView;
      invariant(
        scrollView,
        "Assign this.scrollView ref before call scrollToEnd",
      );
      setTimeout(() => {
        scrollView.scrollToEnd({ animated: true });
      }, 0);
    }
  
    render() {
 

      const tags = this.props.value.map((tag, index) => (
        <Tag
          index={index}
          label={this.props.labelExtractor(tag)}
          isLastTag={this.props.value.length === index + 1}
          onLayoutLastTag={this.onLayoutLastTag}
          onPress={this.deleteTag}
          tagColor={this.props.tagColor}
          tagTextColor={this.props.tagTextColor}
          tagContainerStyle={this.props.tagContainerStyle}
          tagTextStyle={this.props.tagTextStyle}
          key={index}
          
        />
      ));
  
      return (
        <TouchableWithoutFeedback
          onPress={this.focus}
          style={styles.container}
          onLayout={this.measureWrapper}>
          <View style={[this.props.wrapperStyle, { height: this.state.wrapperHeight }]}>
            <ScrollView
              ref={this.scrollViewRef}
              style={styles.tagInputContainerScroll}
              showsHorizontalScrollIndicator = {false}
              horizontal = {this.props.horizontal}
              onContentSizeChange={this.onScrollViewContentSizeChange}
              keyboardShouldPersistTaps={
                ("handled": KeyboardShouldPersistTapsProps)
              }
              {...this.props.scrollViewProps}>

              <View style={styles.tagInputContainer}>
                {tags}
                {this.props.isEditable == true 
                ? <View style={[
                    styles.textInputContainer,
                    { width: this.state.inputWidth }]}>                
                      <TextInput
                          ref={this.tagInputRef}
                          blurOnSubmit={false}
                          onKeyPress={this.onKeyPress}
                          value={this.props.text}
                          style={[styles.textInput, {
                            width: this.state.inputWidth,
                            color: this.props.inputColor}]}
                          onBlur={Platform.OS === "ios" ? this.onBlur : undefined}
                          onChangeText={this.props.onChangeText}
                          autoCapitalize="none"
                          autoCorrect={false}
                          placeholder="Start typing"
                          returnKeyType="done"
                          keyboardType="default"
                          maxLength = {40}
                          onSubmitEditing = {this.props.onSubmitEditing}
                          underlineColorAndroid="rgba(0,0,0,0)"
                          {...this.props.inputProps}>
                      </TextInput>
                  </View> 
                : null}               
              </View>              
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>)
    }
  
    tagInputRef = (tagInput) => {
      invariant(typeof tagInput === "object", "TextInput ref is object");
      this.tagInput = tagInput;
    }
  
    scrollViewRef = (scrollView) => {
      invariant(typeof scrollView === "object", "ScrollView ref is object");
      this.scrollView = scrollView;
    }
  
    onScrollViewContentSizeChange = (w, h) => {
      if (this.contentHeight === h) {
        return;
      }
      const nextWrapperHeight = Math.min(this.props.maxHeight, h);
      if (nextWrapperHeight !== this.state.wrapperHeight) {
        this.setState(
          { wrapperHeight: nextWrapperHeight },
          this.contentHeight < h ? this.scrollToEnd : undefined,
        );
      } else if (this.contentHeight < h) {
        this.scrollToEnd();
      }
      this.contentHeight = h;
    }
  
    onLayoutLastTag = (endPosOfTag) => {
      const margin = 3;
      this.spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
      const inputWidth = TagInput.inputWidth(
        this.props.text,
        this.spaceLeft,
        this.props.inputDefaultWidth,
        this.wrapperWidth,
      );
      if (inputWidth !== this.state.inputWidth) {
        this.setState({ inputWidth });
      }
    }
  
  }  
  export default TagInput;