/*Replace the Whole Code*/

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    ListView,
    Platform,
    Keyboard,
} from 'react-native';

import styles from './styles'

import Utility, { cmsType } from '../../config/Utility';
import WebClient from '../../config/WebClient';
import TopbarView from '../../component/TopbarView'
import SafeAreaView from '../../component/SafeAreaView';
import { WebView } from 'react-native';
import Settings from '../../config/Settings';
import Spinner from 'react-native-loading-spinner-overlay';

class CMSViewController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // cmsURL: "https://www.google.co.in/?gfe_rd=cr&dcr=0&ei=hSl8WrXxO4jT8geVvLfgDQ",
            cmsTitle: '',
            cmsContent: '',
            cmsType: this.props.type,
            spinnerVisible: false,
        };
    }
    componentDidMount() {
        // console.log("Cmstype ", this.state.cmsType)
        this.getCMS();
    }

    onBtnPress() {
        this.props.navigator.pop();
    }

    // ProfileInfo API
    getCMS() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.CMS, {
            'type': this.state.cmsType,
        }, (response, error) => {
            if (error == null) {
                this.setState({ cmsTitle: response.title, cmsContent: response.content, spinnerVisible: false });

            } else {
                this.setState({ spinnerVisible: false });
                Utility.showToast(error.message);
            }
        });
    }

    render() {
        // var cmsTitle = ""
        // if (this.state.cmsType == Utility.cmsType.PrivacyPolicy) {
        //     cmsTitle = "Privacy policy"
        // }
        // else if (this.state.cmsType == Utility.cmsType.TermsOfUse) {
        //     cmsTitle = "Terms of use"
        // }

        return (
            <View style={styles.container}>
                <SafeAreaView>
                    <TopbarView title={this.state.cmsTitle} isLeftItemTypeLogo={false} showSearchBtn={false} showOptionsBtn={false} >
                    </TopbarView>
                </SafeAreaView>
                <SafeAreaView style={{ backgroundColor: 'transparent', flex: 1 }}>
                    <WebView
                        // source={{ uri: this.state.cmsURL }}
                        source={{ html: this.state.cmsContent }}
                        style={{ marginTop: 0, marginHorizontal: 8 }}
                    />
                </SafeAreaView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>

        );
    }
}

export default CMSViewController

