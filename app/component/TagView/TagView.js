
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import TagInput from './TagInput';


export default class TagView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: this.props.tags == undefined ? [] : this.props.tags,
      text: "",
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tags: nextProps.tags });
  }


  /**
   * Initialize default Props
   */
  static defaultProps = {
    /**
     * Set scrolling direction
     * By defualt it's vertical and set true for horizontal
     */
    horizontal: false,
    /**
     * Set false to make Tagview readonly 
     */
    isEditable: true,
    /**
     * Deflaut props of InputView and it apply only when TagView isEditable true
     */
    inputProps: {
      keyboardType: 'default',
      placeholder: 'Write Here',
      autoFocus: false,
      style: {
        fontSize: 14,
      },
    },
    /**
     * InputView width when it is editable true
     */
    inputDefaultWidth: 100,

    /**
     * Set MaxHeight of Tagview, It works only for Vertical scrolling direction
     * horizontal need to be false
     */
    maxHeight: 100,
    /**
     * Set tag style
     */
    tagTextStyle: {
      color: 'black'
    },
    /**
     * Tag Container view style
     */
    tagContainerStyle: {
      backgroundColor: 'grey'
    }
  };


  onChangeTags = (tags) => {
    this.setState({ tags });
  }

  /**
   * Function called every time on Text changed
   */
  onChangeText = (text) => {
    let trimmedText = text.trim();
    this.setState({ text: trimmedText });
    this.addTag(text);
  }

  labelExtractor = (tag) => tag;

  /** 
   * Called when user tap return option in keyboard
  */
  onSubmitEditing() {
    this.addTag(this.state.text + '\n');
  }

  addTag(text) {
    const lastTyped = text.charAt(text.length - 1);
    /** 
     * Set delimiter to make tag when user input one of below character in inputView  
    */
    const parseWhen = [',', ' ', ';', '\n'];

    if (text.trim().length > 0) {
      if (parseWhen.indexOf(lastTyped) > -1) {
        if (this.state.tags.includes(this.state.text) == false) {
          this.setState({
            tags: [...this.state.tags, this.state.text],
            text: "",
          });
          this._tagInput.scrollToEnd();
        }

      }
    }
  }

  render() {
    return (
      <TagInput
        ref={(tagInput) => { this._tagInput = tagInput }}
        value={this.state.tags}
        onChange={this.onChangeTags}
        labelExtractor={this.labelExtractor}
        text={this.state.text}
        onChangeText={this.onChangeText}
        tagColor={this.props.tagColor}
        tagTextColor={this.props.tagTextColor}
        inputProps={this.props.inputProps}
        inputColor={this.props.inputColor}
        horizontal={this.props.horizontal}
        isEditable={this.props.isEditable}
        onTagClick={this.props.onTagClick}
        onSubmitEditing={this.onSubmitEditing.bind(this)}
        tagTextStyle={this.props.tagTextStyle}
        tagContainerStyle={this.props.tagContainerStyle}
        inputDefaultWidth={this.props.inputDefaultWidth}
        maxHeight={this.props.maxHeight}
      />
    );
  }
}
