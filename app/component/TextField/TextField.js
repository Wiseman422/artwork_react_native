'use strict';
import React, { Component } from "react";
import PropTypes from 'prop-types';

import { View, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";

// import Underline from './Underline';

export default class TextField extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false,
            text: props.value,
            height: props.height
        };
    }
    focus() {
        this.refs.input.focus();
    }
    blur() {
        this.refs.input.blur();
    }
    isFocused() {
        return this.state.isFocused;
    }

    rightIconTapped() {
        if (this.props.onRightIconAction != undefined) {
            this.props.onRightIconAction()
        }
    }

    measureLayout(...args) {
        this.refs.wrapper.measureLayout(...args)
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.text !== nextProps.value) {
            this.setState({ text: nextProps.value });
        }
        if (this.props.height !== nextProps.height) {
            this.setState({ height: nextProps.height });
        }
    }

    render() {
        let {
            label,
            highlightColor,
            duration,
            labelColor,
            borderColor,
            textColor,
            textFocusColor,
            textBlurColor,
            onFocus,
            onBlur,
            onChangeText,
            onChange,
            value,
            inputStyle,
            wrapperStyle,
            labelStyle,
            height,
            autoGrow,
            multiline,
            leftIcon,
            rightIcon,

            ...props
        } = this.props;
        return (
            <View style={[
                styles.wrapper, this.state.height
                    ? {
                        height: undefined
                    }
                    : {},
                wrapperStyle
            ]} ref="wrapper">
                {leftIcon
                    ? <Image style={styles.leftIcon} source={leftIcon} />
                    : null}

                <TextInput style={[
                    styles.textInput, {
                        color: textColor
                    },
                    (this.state.isFocused && textFocusColor)
                        ? {
                            color: textFocusColor
                        }
                        : {},
                    (!this.state.isFocused && textBlurColor)
                        ? {
                            color: textBlurColor
                        }
                        : {},
                    inputStyle,
                    this.state.height
                        ? {
                            height: this.state.height
                        }
                        : {}
                ]} multiline={multiline} onFocus={() => {
                    this.setState({ isFocused: true });
                    // this.refs.underline.expandLine();
                    onFocus && onFocus();
                }} onBlur={() => {
                    this.setState({ isFocused: false });
                    // this.refs.underline.shrinkLine();
                    onBlur && onBlur();
                }} onChangeText={(text) => {
                    this.setState({ text });
                    onChangeText && onChangeText(text);
                }} onChange={(event) => {
                    if (autoGrow) {
                        this.setState({ height: event.nativeEvent.contentSize.height });
                    }
                    onChange && onChange(event);
                }} ref="input" value={this.state.text} {...props}></TextInput>
                {rightIcon
                    ? <TouchableOpacity style={styles.rightIcon} onPress={this.rightIconTapped.bind(this)} activeOpacity={0.7}>
                        <Image source={rightIcon} />
                    </TouchableOpacity>
                    : null}

                {this.props.onPress
                    ? <TouchableOpacity style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0)'
                    }} onPress={this.props.onPress}></TouchableOpacity>
                    : null}

            </View>
        );
    }
}

TextField.propTypes = {
    duration: PropTypes.number,
    label: PropTypes.string,
    highlightColor: PropTypes.string,
    labelColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    textFocusColor: PropTypes.string,
    textBlurColor: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    inputStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    multiline: PropTypes.bool,
    autoGrow: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.oneOf(undefined), PropTypes.number])
};

TextField.defaultProps = {
    duration: 200,
    labelColor: '#9E9E9E',
    borderColor: '#e5e5e5',
    textColor: '#000000',
    value: '',
    underlineColorAndroid: 'rgba(0,0,0,0)',
    multiline: false,
    autoGrow: false,
    height: undefined
};

const styles = StyleSheet.create({
    wrapper: {
        height: 30, //fixed height unneccesary height issue previously set 48
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        //alignItems: 'center',
        //backgroundColor:'blue'        
    },

    textInput: {
        flex: 1,
        fontSize: 14,
        height: 30,
        //lineHeight: 34,
        textAlignVertical: 'center',
        //paddingVertical: 5,
        // backgroundColor: 'orange'
    },
    leftIcon: {
        // backgroundColor: 'red',
        marginRight: 15,
        marginLeft: 15,
    },
    rightIcon: {
        //backgroundColor: 'red',
        marginLeft: 0,
        padding: 4,
    }

});
