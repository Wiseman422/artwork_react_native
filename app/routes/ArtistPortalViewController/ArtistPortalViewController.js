import React, { Component } from 'react';
import { Text, View, Platform, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Fonts from '../../config/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TextField from '../../component/TextField'
import INTButton from '../../component/INTButton'
import SafeAreaView from '../../component/SafeAreaView';
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressiveImage from '../../component/ProgressiveImage';
import ModalBox from 'react-native-modalbox';
import RNGooglePlaces from 'react-native-google-places';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import User from '../../models/User';
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');
var options = {
    title: 'Select Photo',
    //customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class ArtistPortalViewController extends Component {
    constructor(props) {
        super(props);
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            artist_access_code: "",
            full_name: Utility.user != undefined ? Utility.user.full_name : "",
            email: Utility.user != undefined ? Utility.user.email : "",
            bio: Utility.user != undefined ? (Utility.user.bio != undefined ? (Utility.user.bio != 'undefined' ? Utility.user.bio : '') : "") : "",
            preferred_medium: Utility.user != undefined ? Utility.user.preferred_medium : "",
            preferred_medium_id: Utility.user != undefined ? Utility.user.preferred_medium_id : "",
            address: Utility.user != undefined ? Utility.user.address : "",
            latitude: Utility.user != undefined ? Utility.user.latitude : 0,
            longitude: Utility.user != undefined ? Utility.user.longitude : 0,
            photoIDUrl1: undefined,
            photo1: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 0) ? Utility.user.completed_project_list[0].image_path : undefined : undefined,
            photoIDUrl2: undefined,
            photo2: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 1) ? Utility.user.completed_project_list[1].image_path : undefined : undefined,
            photoIDUrl3: undefined,
            photo3: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 2) ? Utility.user.completed_project_list[2].image_path : undefined : undefined,
            artist_completed_projects: "",
            arrPreferredMediumList: [],
            preferedMediumModalVisible: false,
            spinnerVisible: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            hasLocationAccessPermission: undefined,
        };
    }

    // onNavigatorEvent(event) {
    //     switch (event.id) {
    //         case 'willAppear':
    //             if (Utility.user != undefined && (Utility.user.latitude == 0 || Utility.user.longitude == 0)) {
    //                 this.updateAddressAlert();
    //             }
    //             break;
    //         case 'didAppear':
    //             break;
    //         case 'willDisappear':
    //             break;
    //         case 'didDisappear':
    //             break;
    //         case 'willCommitPreview':
    //             break;
    //     }
    // }

    componentDidMount() {
        if (Utility.getAWSData == undefined) {
            Utility.getAWS();
        }
        // if (Utility.user != undefined && (Utility.user.latitude == 0 || Utility.user.longitude == 0)) {
        // } else {
        Utility._checkCameraPermission().then((hasCameraPermission) => {
            this.setState({ hasCameraPermission });
            if (!hasCameraPermission) return;
            else {
                Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                    this.setState({ hasWritePermission });
                    if (!hasWritePermission) return;
                });
            }
        });
        this.getPreferedMedium();
        // }
    }
    // updateAddressAlert() {
    //     Alert.alert(
    //         'Address not available',
    //         'Please update your address from your profile',
    //         [
    //             // { text: 'Cancel', onPress: () => this.leftBtnTaaped(), style: 'cancel' },
    //             { text: 'Update Address', onPress: () => Utility.push('EditProfileViewController') },
    //         ],
    //         { cancelable: false }
    //     )
    // }

    leftBtnTaaped() {
        Utility.navigator.pop({
            animated: true,
            //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    //API
    getPreferedMedium() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
            'type': 'preferred_medium',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.length > 0) {
                    this.setState({ arrPreferredMediumList: response })
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    preferedMediumClick() {
        Utility.hideKeyboard();
        this.setState({ preferedMediumModalVisible: true });
    }
    preferedMediumItemClick(item) {
        this.setState({ preferred_medium: item.name });
        this.setState({ preferred_medium_id: item.id });
        this.setState({ preferedMediumModalVisible: false });
    }
    popUpClose() {
        this.setState({ preferedMediumModalVisible: false });
    }
    openLocationSelectionScreen() {
        Utility._checkLocationPermission().then((hasLocationAccessPermission) => {
            this.setState({ hasLocationAccessPermission });
            if (!hasLocationAccessPermission) return;
            else {
                if (this.state.hasLocationAccessPermission) {
                    // RNGooglePlaces.openPlacePickerModal({
                    RNGooglePlaces.openPlacePickerModal({
                        type: 'establishment',
                        //   country: 'CA',
                        latitude: this.state.latitude != 0 ? this.state.latitude : 0.0,
                        longitude: this.state.longitude != 0 ? this.state.longitude : 0.0,
                        radius: 10
                    })
                        .then((place) => {
                            // console.log("PLACE>>> " + JSON.stringify(place));
                            this.setState({ address: place.name });
                            this.setState({ latitude: place.latitude });
                            this.setState({ longitude: place.longitude });
                        })
                        .catch(error => console.log(error.message));  // error is a Javascript Error object
                } else {

                }
            }
        });
    }
    //Image Selection
    btnSelectImageTapped(number) {
        switch (number) {
            case 2:
                if ((this.state.photoIDUrl1 != undefined && this.state.photoIDUrl1 != null) || (this.state.photo1 != null && this.state.photo1 != '')) {
                } else
                    return;
                break;
            case 3:
                if ((this.state.photoIDUrl2 != undefined && this.state.photoIDUrl2 != null) || (this.state.photo2 != null && this.state.photo2 != '')) {
                } else
                    return;
                break;
        }
        if (this.state.hasCameraPermission && this.state.hasWritePermission) {
            ImagePicker.showImagePicker(options, (response) => {
                // console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    let source = {
                        uri: response.uri
                    };
                    // console.log("uri >>>>> " + response.uri);
                    switch (number) {
                        case 1:
                            this.setState({ photoIDUrl1: response.uri });
                            break;
                        case 2:
                            this.setState({ photoIDUrl2: response.uri });
                            break;
                        case 3:
                            this.setState({ photoIDUrl3: response.uri });
                            break;
                    }
                }
            });
        }
    }

    saveArtistTapped() {
        Utility.hideKeyboard();
        if (Utility.user == undefined) {
            return;
        }
        if (Utility.user.is_artist_approved == 3) {
            if (this.state.artist_access_code.toString().trim() == '') {
                Utility.showToast(Utility.MESSAGES.please_enter_access_code)
            } else {
                this.saveArtist();
            }
        } else {
            if (this.state.artist_access_code.toString().trim() == '') {
                if (this.state.full_name.trim() == "") {
                    Utility.showToast(Utility.MESSAGES.please_enter_your_name)
                }
                else if (this.state.preferred_medium.trim() == "") {
                    Utility.showToast(Utility.MESSAGES.please_select_preffered_medium)
                }
                else if ((this.state.latitude == 0 || this.state.longitude == 0)) {
                    Utility.showToast(Utility.MESSAGES.please_enter_your_address)
                }
                else if (this.state.bio.toString().trim() == "") {
                    Utility.showToast(Utility.MESSAGES.please_describe_your_artwork)
                }
                else if (this.state.photoIDUrl1 == undefined && this.state.photoIDUrl2 == undefined && this.state.photoIDUrl3 == undefined) {
                    Utility.showToast(Utility.MESSAGES.please_add_your_artwork_project)
                }
                else if (this.state.photoIDUrl1 != null && this.state.photoIDUrl1 != undefined) {
                    this.uploadImage(1)
                }
                else if (this.state.photoIDUrl2 != null && this.state.photoIDUrl2 != undefined) {
                    this.uploadImage(2)
                }
                else if (this.state.photoIDUrl3 != null && this.state.photoIDUrl3 != undefined) {
                    this.uploadImage(3)
                } else {
                    // this.saveArtist();
                }
            } else {
                this.saveArtist();
            }
        }
    }
    uploadImage(number) {
        if (Utility.getAWSData == undefined) {
            return;
        }
        var photo = {};
        switch (number) {
            case 1:
                photo = {
                    uri: this.state.photoIDUrl1,
                    type: 'image/*',
                    name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
                };
                break;
            case 2:
                photo = {
                    uri: this.state.photoIDUrl2,
                    type: 'image/*',
                    name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
                };
                break;
            case 3:
                photo = {
                    uri: this.state.photoIDUrl3,
                    type: 'image/*',
                    name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
                };
                break;
        }
        // var photo = {
        //     uri: this.state.photoIDUrl1,
        //     type: 'image/*',
        //     name: 'photo.jpg'
        // };

        const options = {
            keyPrefix: Utility.getAWSData.folder_projectpic + '/',
            bucket: "locart",
            region: Utility.getAWSData.region,
            accessKey: Utility.getAWSData.access_key,
            secretKey: Utility.getAWSData.secret_key,
            successActionStatus: 201
        }
        this.setState({ spinnerVisible: true });
        RNS3.put(photo, options).then(response => {
            this.setState({ spinnerVisible: false });
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            else {
                // console.log('UPLOAD RESPONSE', response.body);
                switch (number) {
                    case 1:
                        this.setState({ photo1: photo.name });
                        if (this.state.photoIDUrl2 != null && this.state.photoIDUrl2 != undefined) {
                            this.uploadImage(2)
                        } else if (this.state.photoIDUrl3 != null && this.state.photoIDUrl3 != undefined) {
                            this.uploadImage(3)
                        } else {
                            this.saveArtist();
                        }
                        break;
                    case 2:
                        this.setState({ photo2: photo.name });
                        if (this.state.photoIDUrl3 != null && this.state.photoIDUrl3 != undefined) {
                            this.uploadImage(3)
                        } else {
                            this.saveArtist();
                        }
                        break;
                    case 3:
                        this.setState({ photo3: photo.name });
                        this.saveArtist();
                        break;
                }
            }
        });
        // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
        //     'type': 'completed_project_pic', //'type': 'artwork_images',
        //     'media_file': photo,
        // }, (response, error) => {
        //     //this.setState({ spinnerVisible: false });
        //     if (error == null) {
        //         console.log(response)
        //         switch (number) {
        //             case 1:
        //                 this.setState({ photo1: response.filename });
        //                 if (this.state.photoIDUrl2 != null && this.state.photoIDUrl2 != undefined) {
        //                     this.uploadImage(2)
        //                 } else if (this.state.photoIDUrl3 != null && this.state.photoIDUrl3 != undefined) {
        //                     this.uploadImage(3)
        //                 } else {
        //                     this.saveArtist();
        //                 }
        //                 break;
        //             case 2:
        //                 this.setState({ photo2: response.filename });
        //                 if (this.state.photoIDUrl3 != null && this.state.photoIDUrl3 != undefined) {
        //                     this.uploadImage(3)
        //                 } else {
        //                     this.saveArtist();
        //                 }
        //                 break;
        //             case 3:
        //                 this.setState({ photo3: response.filename });
        //                 this.saveArtist();
        //                 break;
        //         }
        //     } else {
        //         Utility.showToast(error.message);
        //         this.setState({ spinnerVisible: false });
        //         //Utility.showAlert('Error', error.message);
        //     }
        // });
    }

    getCommasapredPhotoString() {
        var tempCompletedProject = "";
        if (this.state.photo1 != null && this.state.photo1 != "") {
            if (tempCompletedProject == "") {
                tempCompletedProject = this.state.photo1;
            } else {
                tempCompletedProject = tempCompletedProject + ',' + this.state.photo1;
            }
        }
        if (this.state.photo2 != null && this.state.photo2 != "") {
            if (tempCompletedProject == "") {
                tempCompletedProject = this.state.photo2;
            } else {
                tempCompletedProject = tempCompletedProject + ',' + this.state.photo2;
            }
        }
        if (this.state.photo3 != null && this.state.photo3 != "") {
            if (tempCompletedProject == "") {
                tempCompletedProject = this.state.photo3;
            } else {
                tempCompletedProject = tempCompletedProject + ',' + this.state.photo3;
            }
        }
        console.log('tempCompletedProject>>>>> ' + tempCompletedProject)
        return tempCompletedProject;
    }
    saveArtist() {
        this.setState({ spinnerVisible: true });
        this.setState({ artist_completed_projects: this.getCommasapredPhotoString() });
        WebClient.postRequest(Settings.URL.REQUEST_FOR_ARTIST, {
            'user_id': Utility.user.user_id + '',
            'full_name': this.state.full_name + '',
            'address': this.state.address + '',
            'latitude': this.state.latitude + '',
            'longitude': this.state.longitude + '',
            'bio': this.state.bio != undefined ? this.state.bio : "",
            'preferred_medium_id': this.state.preferred_medium_id + '',
            'artist_access_code': this.state.artist_access_code + '',
            'artist_completed_projects': this.state.artist_completed_projects + '',
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response.user_id) {
                    if (response.artist_access_code == 1) {
                        Utility.showToast(Utility.MESSAGES.now_you_are_artist);
                    } else if (response.artist_access_code == 3) {
                        Utility.showToast(Utility.MESSAGES.artist_request_successfully);
                    }
                    User.save(response);
                    Utility.user = new User(response);
                    setTimeout(() => {
                        Utility.resetTo('HomeViewController')
                    }, 500);
                }
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }
    render() {
        var preferedMediumModelbox = <ModalBox
            coverScreen={false}
            swipeToClose={false}
            backdropPressToClose={false}
            swipeToClose={false}
            backButtonClose={true}
            onClosed={() => this.setState({ preferedMediumModalVisible: false })}
            style={styles.modalContainer}
            isOpen={this.state.preferedMediumModalVisible}
            position='bottom'>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={[styles.prefferedMediumHeaderTextStyle]}>Select Medium</Text>
                    <TouchableOpacity onPress={this.popUpClose.bind(this)} activeOpacity={0.7}>
                        <Text style={styles.closeTextStyle} >Close</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ marginTop: 5 }}
                    data={this.state.arrPreferredMediumList}
                    keyExtractor={(item, index) => index + ''}
                    renderItem={({ item, index }) =>
                        <View style={{ marginHorizontal: 8 }} >
                            <Text style={styles.prefferedMediumTextStyle} onPress={this.preferedMediumItemClick.bind(this, item)} >
                                {item.name}
                            </Text>
                            <View style={styles.viewBottom} />
                        </View>}
                    numColumns={1}
                />
            </View>
        </ModalBox >
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackBlue} />
                                <Text style={styles.titleTextStyle}>ARTIST PORTAL</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"} automaticallyAdjustContentInsets={true} bounces={true} showsVerticalScrollIndicator={false}>
                        <View style={styles.approvalCodeContainerView}>
                            <Text style={styles.txtApprovalCode}>Approval Code</Text>
                            <View style={styles.approvalCodeInnerView}>
                                <TextField
                                    inputStyle={styles.inputTextApprovalCode}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    textColor={Colors.grayType3}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(artist_access_code) => this.setState({ artist_access_code })}
                                    value={this.state.artist_access_code.toUpperCase() + ''}
                                />
                            </View>
                        </View>
                        {
                            Utility.user != undefined ?
                                Utility.user.is_artist_approved == 3 ?
                                    null :
                                    <View >
                                        <View style={styles.subTitleView}>
                                            <Text style={styles.txtIntrested}>Interested in selling your artwork?</Text>
                                            <Text style={styles.txtFillOut}>Fill out the application form below and will get back to you shortly!</Text>
                                        </View>
                                        <View style={styles.applicationFormContainer}>
                                            <View style={styles.applicationFormInnerContainer}>
                                                <View style={styles.titleContainerLeft}>
                                                    {/*<View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.smallTitleStyle}>(or Business Name)</Text>
                                </View>*/}
                                                    <Text style={styles.titleStyle}>First & Last Name</Text>
                                                    <TextField
                                                        inputStyle={styles.inputText}
                                                        autoCorrect={false}
                                                        placeholder={""}
                                                        selectionColor={Colors.blueType1}
                                                        onChangeText={(full_name) => this.setState({ full_name })}
                                                        value={this.state.full_name}
                                                    />
                                                </View>
                                                <View style={styles.titleContainerRight}>
                                                    <Text style={styles.titleStyle}>Email</Text>
                                                    <TextField
                                                        inputStyle={styles.inputText}
                                                        autoCorrect={false}
                                                        keyboardType={'email-address'}
                                                        maxLength={255}
                                                        editable={false}
                                                        onChangeText={(email) => this.setState({ email })}
                                                        value={this.state.email}
                                                        autoCapitalize={'none'}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.applicationFormInnerContainer}>
                                                <View style={styles.titleContainerLeft}>
                                                    <TouchableOpacity onPress={() => this.preferedMediumClick()} activeOpacity={0.7}>
                                                        <Text style={styles.titleStyle}>Preferred Medium</Text>
                                                        <TextField
                                                            inputStyle={styles.inputText}
                                                            autoCorrect={false}
                                                            placeholder={""}
                                                            selectionColor={Colors.blueType1}
                                                            //onChangeText={(preferred_medium) => this.setState({ preferred_medium })}
                                                            onPress={() => this.preferedMediumClick()}
                                                            value={this.state.preferred_medium}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.titleContainerRight}>
                                                    <Text style={styles.titleStyle}>Town</Text>
                                                    <TextField
                                                        inputStyle={styles.inputText}
                                                        placeholderTextColor={Colors.grayTextColor}
                                                        borderColor={'transparent'}
                                                        autoCorrect={false}
                                                        placeholder={""}
                                                        selectionColor={Colors.blueType1}
                                                        editable={true}
                                                        onChangeText={(address) => this.setState({ address })}
                                                        value={this.state.address}
                                                        rightIcon={Images.addressIcon}
                                                        onRightIconAction={() => this.openLocationSelectionScreen()}
                                                    />
                                                </View>
                                            </View>
                                            <View style={styles.artworkDescriptionStyle}>
                                                <Text style={styles.titleStyle}>Breifly describe your artwork</Text>
                                                <TextField
                                                    inputStyle={Utility.isPlatformAndroid ? styles.inputTextDescriptionAndroid : styles.inputTextDescription}
                                                    autoCorrect={false}
                                                    placeholder={""}
                                                    selectionColor={Colors.blueType1}
                                                    multiline={true}
                                                    onChangeText={(bio) => this.setState({ bio })}
                                                    value={this.state.bio + ''}
                                                />
                                            </View>
                                            <View style={styles.completedProjectView}>
                                                <Text style={styles.titleStyle}>Please provide 3 examples of completed projects</Text>
                                                <View style={styles.buttonContainerView}>
                                                    <View>
                                                        {((this.state.photoIDUrl1 != undefined && this.state.photoIDUrl1 != null) || (this.state.photo1 != null && this.state.photo1 != ''))
                                                            ?
                                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(1)}>
                                                                <ProgressiveImage
                                                                    style={styles.projectImage}
                                                                    uri={(this.state.photoIDUrl1 != undefined && this.state.photoIDUrl1 != null) ?
                                                                        this.state.photoIDUrl1 : this.state.photo1 != null ? this.state.photo1 : undefined}
                                                                    placeholderSource={Images.placeholderMediaImage}
                                                                />
                                                            </TouchableOpacity>
                                                            :
                                                            <INTButton
                                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                                icon={Images.cloudIconLight}
                                                                onPress={() => this.btnSelectImageTapped(1)}
                                                            />
                                                        }
                                                    </View>
                                                    <View>
                                                        {((this.state.photoIDUrl2 != undefined && this.state.photoIDUrl2 != null) || (this.state.photo2 != null && this.state.photo2 != ''))
                                                            ?
                                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(2)}>
                                                                <ProgressiveImage
                                                                    style={styles.projectImage}
                                                                    uri={(this.state.photoIDUrl2 != undefined && this.state.photoIDUrl2 != null) ?
                                                                        this.state.photoIDUrl2 : this.state.photo2 != null ? this.state.photo2 : undefined}
                                                                    placeholderSource={Images.placeholderMediaImage}
                                                                />
                                                            </TouchableOpacity>
                                                            :
                                                            <INTButton
                                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                                icon={Images.cloudIconLight}
                                                                onPress={() => this.btnSelectImageTapped(2)}
                                                            />
                                                        }
                                                    </View>
                                                    <View>
                                                        {((this.state.photoIDUrl3 != undefined && this.state.photoIDUrl3 != null) || (this.state.photo3 != null && this.state.photo3 != ''))
                                                            ?
                                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(3)}>
                                                                <ProgressiveImage
                                                                    style={styles.projectImage}
                                                                    uri={(this.state.photoIDUrl3 != undefined && this.state.photoIDUrl3 != null) ?
                                                                        this.state.photoIDUrl3 : this.state.photo3 != null ? this.state.photo3 : undefined}
                                                                    placeholderSource={Images.placeholderMediaImage}
                                                                />
                                                            </TouchableOpacity>
                                                            :
                                                            <INTButton
                                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                                icon={Images.cloudIconLight}
                                                                onPress={() => this.btnSelectImageTapped(3)}
                                                            />
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                : null
                        }
                        <View style={{ marginTop: 25, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <INTButton buttonStyle={{ paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                title='Send'
                                titleStyle={styles.buttonTitleStyle}
                                onPress={() => this.saveArtistTapped()}
                            />
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {preferedMediumModelbox}
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
}
export default ArtistPortalViewController