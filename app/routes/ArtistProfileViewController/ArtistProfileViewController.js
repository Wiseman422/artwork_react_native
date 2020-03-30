import React, { Component } from 'react';
import { Text, View, Platform, Image, TouchableOpacity, FlatList } from 'react-native';
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
import RNAccountKit, { Color, StatusBarStyle } from 'react-native-facebook-account-kit'
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');
var PROFILE_PHOTO = 1;
var COVER_PHOTO = 2;
// var COMPLETED_PROJECT = 3;
class ArtistProfileViewController extends Component {
    constructor(props) {
        super(props);
        this.state = {
            full_name: Utility.user != undefined ? Utility.user.full_name : "",
            email: Utility.user != undefined ? Utility.user.email : "",
            phone: Utility.user != undefined ? Utility.user.phone : "",
            country_code: Utility.user != undefined ? Utility.user.country_code : "",
            bio: Utility.user != undefined ? Utility.user.bio : "",
            preferred_medium: Utility.user != undefined ? Utility.user.preferred_medium : "",
            preferred_medium_id: Utility.user != undefined ? Utility.user.preferred_medium_id : "",
            address: Utility.user != undefined ? Utility.user.address : "",
            latitude: Utility.user != undefined ? Utility.user.latitude : 0,
            longitude: Utility.user != undefined ? Utility.user.longitude : 0,
            // photoIDUrl1: undefined,
            // photoURL1: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 0) ? Utility.user.completed_project_list[0].image_path : undefined : undefined,
            // photoName1: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 0) ? Utility.user.completed_project_list[0].image_name : undefined : undefined,
            // photoIDUrl2: undefined,
            // photoURL2: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 1) ? Utility.user.completed_project_list[1].image_path : undefined : undefined,
            // photoName2: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 1) ? Utility.user.completed_project_list[1].image_name : undefined : undefined,
            // photoIDUrl3: undefined,
            // photoURL3: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 2) ? Utility.user.completed_project_list[2].image_path : undefined : undefined,
            // photoName3: Utility.user != undefined ? (Utility.user.completed_project_list != null && Utility.user.completed_project_list.length > 2) ? Utility.user.completed_project_list[1].image_name : undefined : undefined,
            photoIDUrl: undefined,
            profilePhoto: "",
            photoIDUrlCover: undefined,
            profileCoverPhoto: "",

            sourceName1: Utility.user.sourceName1 != undefined ? Utility.user.sourceName1 : "",
            sourceName1Value: Utility.user.sourceName1Url != undefined ? Utility.user.sourceName1Url : "",

            sourceName2: Utility.user.sourceName2 != undefined ? Utility.user.sourceName2 : "",
            sourceName2Value: Utility.user.sourceName2Url != undefined ? Utility.user.sourceName2Url : "",

            sourceName3: Utility.user.sourceName3 != undefined ? Utility.user.sourceName3 : "",
            sourceName3Value: Utility.user.sourceName3Url != undefined ? Utility.user.sourceName3Url : "",

            sourceName4: Utility.user.sourceName4 != undefined ? Utility.user.sourceName4 : "",
            sourceName4Value: Utility.user.sourceName4Url != undefined ? Utility.user.sourceName4Url : "",

            // artist_completed_projects: "",
            arrPreferredMediumList: [],
            preferedMediumModalVisible: false,
            spinnerVisible: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,
            hasLocationAccessPermission: undefined,
        };
    }

    componentDidMount() {
        if (Utility.getAWSData == undefined) {
            Utility.getAWS();
        }
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

        // console.log('User', Utility.user)
    }

    leftBtnTaaped() {
        if (this.props.isFromNewArtWork) {
            if (this.props.isFromNewArtWork == true) {
                this.props.onNavigationCallBack({ isSuccess: false })
                this.props.navigator.pop({ animated: true, });
            } else {
                this.props.navigator.pop({ animated: true, });
            }
        } else {
            this.props.navigator.pop({ animated: true, });
        }

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
                    // RNGooglePlaces.openAutocompleteModal({
                    RNGooglePlaces.openPlacePickerModal({
                        type: 'establishment',
                        //   country: 'CA',
                        latitude: this.state.latitude != 0 ? this.state.latitude : 0.0,
                        longitude: this.state.longitude != 0 ? this.state.longitude : 0.0,
                        radius: 10
                    })
                        .then((place) => {
                            // console.log("PLACE>>> ", place);
                            this.setState({ address: place.name });
                            this.setState({ latitude: place.latitude });
                            this.setState({ longitude: place.longitude });
                        })
                        .catch(error => console.log(error.message));  // error is a Javascript Error object
                } else {
                    console.log('Permission not granted')
                }
            }
        });
    }
    //Image Selection
    btnSelectImageTapped(UPLOAD_TYPE, number) {
        // if (UPLOAD_TYPE == COMPLETED_PROJECT) {
        //     switch (number) {
        //         case 2:
        //             if ((this.state.photoIDUrl1 != undefined) || (this.state.photoName1 != undefined)) {
        //             } else
        //                 return;
        //             break;
        //         case 3:
        //             if ((this.state.photoIDUrl2 != undefined) || (this.state.photoName2 != undefined)) {
        //             } else
        //                 return;
        //             break;
        //     }
        // }
        if (this.state.hasCameraPermission && this.state.hasWritePermission) {
            ImagePicker.showImagePicker({
                title: 'Select Photo',
                //customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
                storageOptions: {
                    skipBackup: true, path: 'images'
                }
            }, (response) => {
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
                    if (UPLOAD_TYPE == PROFILE_PHOTO) {
                        this.setState({ photoIDUrl: response.uri });
                    } else if (UPLOAD_TYPE == COVER_PHOTO) {
                        this.setState({ photoIDUrlCover: response.uri });
                    }
                    //  else if (UPLOAD_TYPE == COMPLETED_PROJECT) {
                    //     switch (number) {
                    //         case 1:
                    //             this.setState({ photoIDUrl1: response.uri, photoName1: undefined });
                    //             break;
                    //         case 2:
                    //             this.setState({ photoIDUrl2: response.uri, photoName2: undefined });
                    //             break;
                    //         case 3:
                    //             this.setState({ photoIDUrl3: response.uri, photoName3: undefined });
                    //             break;
                    //     }
                    // }
                }
            });
        }
    }

    saveArtistTapped() {
        if (this.state.full_name.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_your_name)
        } else if (Utility.user != undefined && Utility.user.phone != this.state.phone) {
            this.checkPhoneExist();
        } else {
            this.validateAndSendRequest();
        }
        // else if (this.state.photoIDUrl1 != undefined) {
        //     this.uploadImage(COMPLETED_PROJECT, 1)
        // } else if (this.state.photoIDUrl2 != undefined) {
        //     this.uploadImage(COMPLETED_PROJECT, 2)
        // } else if (this.state.photoIDUrl3 != undefined) {
        //     this.uploadImage(COMPLETED_PROJECT, 3)
        // }
    }
    uploadImage(UPLOAD_TYPE, number) {
        // else if (UPLOAD_TYPE == COMPLETED_PROJECT) {
        //     switch (number) {
        //         case 1:
        //             photo = {
        //                 uri: this.state.photoIDUrl1,
        //                 type: 'image/*',
        //                 name: 'photo.jpg'
        //             };
        //             break;
        //         case 2:
        //             photo = {
        //                 uri: this.state.photoIDUrl2,
        //                 type: 'image/*',
        //                 name: 'photo.jpg'
        //             };
        //             break;
        //         case 3:
        //             photo = {
        //                 uri: this.state.photoIDUrl3,
        //                 type: 'image/*',
        //                 name: 'photo.jpg'
        //             };
        //             break;
        //     }
        // }
        if (Utility.getAWSData == undefined) {
            return;
        }
        var photo = {};
        var options = {};
        if (UPLOAD_TYPE == PROFILE_PHOTO) {
            photo = {
                uri: this.state.photoIDUrl,
                type: 'image/*',
                name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
            };
            options = {
                keyPrefix: Utility.getAWSData.folder_profile + '/',
                bucket: "locart",
                region: Utility.getAWSData.region,
                accessKey: Utility.getAWSData.access_key,
                secretKey: Utility.getAWSData.secret_key,
                successActionStatus: 201
            }
        } else if (UPLOAD_TYPE == COVER_PHOTO) {
            photo = {
                uri: this.state.photoIDUrlCover,
                type: 'image/*',
                name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
            };
            options = {
                keyPrefix: Utility.getAWSData.folder_feedpic + '/',

                bucket: "locart",
                region: Utility.getAWSData.region,
                accessKey: Utility.getAWSData.access_key,
                secretKey: Utility.getAWSData.secret_key,
                successActionStatus: 201
            }
        }

        this.setState({ spinnerVisible: true });

        RNS3.put(photo, options).then(response => {
            this.setState({ spinnerVisible: false });
            if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
            else {
                // console.log('UPLOAD RESPONSE', response.body);
                if (UPLOAD_TYPE == PROFILE_PHOTO) {
                    this.setState({ profilePhoto: photo.name });
                    if (this.state.photoIDUrlCover != undefined) {
                        this.uploadImage(COVER_PHOTO, 0)
                    }
                    else {
                        this.saveArtist();
                    }
                } else if (UPLOAD_TYPE == COVER_PHOTO) {
                    this.setState({ profileCoverPhoto: photo.name });
                    this.saveArtist();
                }
            }
        });

        // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
        //     // 'type': (UPLOAD_TYPE == COMPLETED_PROJECT) ? 'completed_project_pic' : (UPLOAD_TYPE == COVER_PHOTO) ? 'artwork_images' : 'profile_pic', //'type': 'artwork_images',
        //     'type': (UPLOAD_TYPE == COVER_PHOTO) ? 'artwork_images' : 'profile_pic', //'type': 'artwork_images',
        //     'media_file': photo,
        // }, (response, error) => {
        //     //this.setState({ spinnerVisible: false });
        //     if (error == null) {
        //         console.log(response)
        //         if (UPLOAD_TYPE == PROFILE_PHOTO) {
        //             this.setState({ profilePhoto: response.filename });
        //             if (this.state.photoIDUrlCover != undefined) {
        //                 this.uploadImage(COVER_PHOTO, 0)
        //             }
        //             //  else if (this.state.photoIDUrl1 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 1)
        //             // } else if (this.state.photoIDUrl2 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 2)
        //             // } else if (this.state.photoIDUrl3 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 3)
        //             // } 
        //             else {
        //                 this.saveArtist();
        //             }
        //         } else if (UPLOAD_TYPE == COVER_PHOTO) {
        //             this.setState({ profileCoverPhoto: response.filename });
        //             // if (this.state.photoIDUrl1 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 1)
        //             // } else if (this.state.photoIDUrl2 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 2)
        //             // } else if (this.state.photoIDUrl3 != undefined) {
        //             //     this.uploadImage(COMPLETED_PROJECT, 3)
        //             // } else {
        //             //     this.saveArtist();
        //             // }
        //             this.saveArtist();
        //         }
        //         // else if (UPLOAD_TYPE == COMPLETED_PROJECT) {
        //         //     switch (number) {
        //         //         case 1:
        //         //             this.setState({ photoName1: response.filename });
        //         //             if (this.state.photoIDUrl2 != undefined) {
        //         //                 this.uploadImage(COMPLETED_PROJECT, 2)
        //         //             } else if (this.state.photoIDUrl3 != undefined) {
        //         //                 this.uploadImage(COMPLETED_PROJECT, 3)
        //         //             } else {
        //         //                 this.saveArtist();
        //         //             }
        //         //             break;
        //         //         case 2:
        //         //             this.setState({ photoName2: response.filename });
        //         //             if (this.state.photoIDUrl3 != undefined) {
        //         //                 this.uploadImage(COMPLETED_PROJECT, 3)
        //         //             } else {
        //         //                 this.saveArtist();
        //         //             }
        //         //             break;
        //         //         case 3:
        //         //             this.setState({ photoName3: response.filename });
        //         //             this.saveArtist();
        //         //             break;
        //         //     }
        //         // }
        //     } else {
        //         Utility.showToast(error.message);
        //         //Utility.showAlert('Error', error.message);
        //         this.setState({ spinnerVisible: false });
        //     }
        // });
    }

    // determindSequenceForCompletedPrjectUploadImage(number) {
    //     if (this.state.photoIDUrl1 != undefined) {
    //         this.uploadImage(COMPLETED_PROJECT, 1)
    //     } else if (this.state.photoIDUrl2 != undefined) {
    //         this.uploadImage(COMPLETED_PROJECT, 2)
    //     } else if (this.state.photoIDUrl3 != undefined) {
    //         this.uploadImage(COMPLETED_PROJECT, 3)
    //     } else {
    //         this.saveArtist();
    //     }
    // }

    // getCommasapredPhotoString() {
    //     var tempCompletedProject = "";
    //     if (this.state.photoName1 != undefined) {
    //         if (tempCompletedProject == "") {
    //             tempCompletedProject = this.state.photoName1;
    //         } else {
    //             tempCompletedProject = tempCompletedProject + ',' + this.state.photoName1;
    //         }
    //     }
    //     if (this.state.photoName2 != undefined) {
    //         if (tempCompletedProject == "") {
    //             tempCompletedProject = this.state.photoName2;
    //         } else {
    //             tempCompletedProject = tempCompletedProject + ',' + this.state.photoName2;
    //         }
    //     }
    //     if (this.state.photoName3 != undefined) {
    //         if (tempCompletedProject == "") {
    //             tempCompletedProject = this.state.photoName3;
    //         } else {
    //             tempCompletedProject = tempCompletedProject + ',' + this.state.photoName3;
    //         }
    //     }
    //     console.log('tempCompletedProject>>>>> ' + tempCompletedProject)
    //     return tempCompletedProject;
    // }
    checkPhoneExist() {
        this.setState({ spinnerVisible: true });
        WebClient.postRequest(Settings.URL.CHECK_PHONE, {
            'user_id': Utility.user.user_id + '',
            // 'email': this.state.email,
            'phone': this.state.phone + ''
        }, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                this.openMobileVerificationView()
            } else {
                Utility.showToast(error.message);
                //Utility.showAlert('Error', error.message);
            }
        });
    }
    openMobileVerificationView() {
        // console.log("isSocial :", this.state.isSocialLogin)
        // console.log("Phone : " + this.state.phone, this.state.country_code)
        // Settings.configureMobileVerificationView("9904081622","01")
        Settings.configureMobileVerificationView(this.state.phone, this.state.country_code);
        // Shows the Facebook Account Kit view for login via SMS
        RNAccountKit.loginWithPhone().then((token) => {
            if (!token) {
                console.log('Login cancelled')
            } else {
                console.log(`Logged with phone. Token: ${token}`)
                RNAccountKit.getCurrentAccount().then((account) => {
                    this.setState({
                        country_code: '+' + account.phoneNumber.countryCode,
                        phone: account.phoneNumber.number
                    });
                    this.validateAndSendRequest();
                }).catch((error) => {
                    console.error(error);
                }).done();
            }
        })
    }
    validateAndSendRequest() {
        if (this.state.photoIDUrl != undefined) {
            this.uploadImage(PROFILE_PHOTO, 0)
        } else if (this.state.photoIDUrlCover != undefined) {
            this.uploadImage(COVER_PHOTO, 0)
        } else {
            this.saveArtist();
        }
    }
    saveArtist() {
        if (this.checkUrlValidation() == true) {
            var reqParm = {
                'user_id': Utility.user.user_id,
                'full_name': this.state.full_name,
                'address': this.state.address,
                'email': this.state.email,
                'country_code': this.state.country_code,
                'phone': this.state.phone,
                'latitude': this.state.latitude,
                'longitude': this.state.longitude,
                'bio': this.state.bio != undefined ? this.state.bio : '',
                'preferred_medium_id': this.state.preferred_medium_id,
                'profile_banner_photo': this.state.profileCoverPhoto,
                'source_name_1': this.state.sourceName1,
                'source_name_1_url': this.state.sourceName1Value.trim(),

                'source_name_2': this.state.sourceName2,
                'source_name_2_url': this.state.sourceName2Value.trim(),

                'source_name_3': this.state.sourceName3,
                'source_name_3_url': this.state.sourceName3Value.trim(),

                'source_name_4': this.state.sourceName4,
                'source_name_4_url': this.state.sourceName4Value.trim(),

                'profile_pic': this.state.profilePhoto,
                // 'artist_completed_projects': this.getCommasapredPhotoString(),
            }
            this.setState({
                spinnerVisible: true,
                // artist_completed_projects: this.getCommasapredPhotoString()
            });
            this.setState({ spinnerVisible: true });
            WebClient.postRequest(Settings.URL.EDIT_PROFILE, reqParm, (response, error) => {
                this.setState({ spinnerVisible: false });
                if (error == null) {
                    if (response.user_id) {
                        Utility.showToast(Utility.MESSAGES.profile_updated_successfully);
                        User.save(response);
                        Utility.user = new User(response);
                        if (this.props.isFromNewArtWork) {
                            if (this.props.isFromNewArtWork == true) {
                                this.props.onNavigationCallBack({ isSuccess: true })
                                this.props.navigator.pop();
                            } else {
                                Utility.resetTo('HomeViewController')
                            }
                        } else {
                            Utility.resetTo('HomeViewController')
                        }
                    }
                } else {
                    Utility.showToast(error.message);
                    //Utility.showAlert('Error', error.message);
                }
            });
        }
    }

    getURLFormat(sourceValue) {
        return this.state.sourceValue.trim().length > 0 ?
            this.state.sourceValue.trim().indexOf('http') > -1 ?
                this.state.sourceValue.trim().indexOf('www.') > -1 ?
                    this.state.sourceValue.trim() :
                    ('http://' + this.state.sourceValue.trim()) :
                ('http://' + this.state.sourceValue.trim()) :
            this.state.sourceValue.trim();
    }

    checkUrlValidation() {
        var isValid = true
        if (this.state.sourceName1Value.trim().length > 0) {
            if (this.state.sourceName1.trim().length > 0) {
                if (Utility.isTypeURL(this.state.sourceName1Value.toLowerCase()) == false) {
                    isValid = false;
                }
            } else {
                isValid = false;
                Utility.showToast(Utility.MESSAGES.please_add_source_name);
            }
        }

        if (this.state.sourceName2Value.trim().length > 0) {
            if (this.state.sourceName2.trim().length > 0) {
                if (Utility.isTypeURL(this.state.sourceName2Value.toLowerCase()) == false) {
                    isValid = false
                }
            } else {
                isValid = false;
                Utility.showToast(Utility.MESSAGES.please_add_source_name);
            }
        }

        if (this.state.sourceName3Value.trim().length > 0) {
            if (this.state.sourceName3.trim().length > 0) {
                if (Utility.isTypeURL(this.state.sourceName3Value.toLowerCase()) == false) {
                    isValid = false
                }
            } else {
                isValid = false;
                Utility.showToast(Utility.MESSAGES.please_add_source_name);
            }
        }

        if (this.state.sourceName4Value.trim().length > 0) {
            if (this.state.sourceName4.trim().length > 0) {
                if (Utility.isTypeURL(this.state.sourceName4Value.toLowerCase()) == false) {
                    isValid = false
                }
            } else {
                isValid = false;
                Utility.showToast(Utility.MESSAGES.please_add_source_name);
            }
        }

        return isValid
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
        return (//onPress={Utility.hideKeyboard()}
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity style={styles.titleView} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarBackBlue} />
                            <Text style={styles.titleTextStyle}>EDIT PROFILE</Text>
                        </TouchableOpacity>

                        <View style={styles.profilePicView}>
                            <TouchableOpacity style={styles.profilePicEditView} onPress={() => this.btnSelectImageTapped(PROFILE_PHOTO, 0)} activeOpacity={0.7}>
                                <ProgressiveImage
                                    style={styles.profileImage}
                                    placeholderStyle={styles.placeHolderPhotoStyle}
                                    uri={(this.state.photoIDUrl != undefined) ?
                                        this.state.photoIDUrl : Utility.user != undefined ? Utility.user.profile_pic : undefined}
                                    placeholderSource={Images.input_userphoto}
                                    borderRadius={1} />
                                <Text style={styles.editTextStyle}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <KeyboardAwareScrollView extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"} automaticallyAdjustContentInsets={true} bounces={true} showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 5 }}>
                            <View style={styles.textFieldViewContainer}>
                                {/*NAME*/}
                                <View style={styles.titleContainerLeft}>
                                    <Text style={styles.titleStyle}>Name</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        selectionColor={Colors.blueType1}
                                        returnKeyType="next"
                                        onChangeText={(full_name) => this.setState({ full_name })}
                                        value={this.state.full_name}
                                    />
                                </View>
                                <View style={styles.titleContainerRight}>
                                    <TouchableOpacity onPress={() => this.preferedMediumClick()} activeOpacity={0.7}>
                                        <Text style={styles.titleStyle}>Preferred Medium</Text>
                                        <TextField
                                            inputStyle={styles.inputText}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            ref={"preferred_medium"}
                                            returnKeyType="next"
                                            //onChangeText={(preferred_medium) => this.setState({ preferred_medium })}
                                            onPress={() => this.preferedMediumClick()}
                                            value={this.state.preferred_medium}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/*EMAIN AND PHONE*/}
                            <View style={styles.textFieldViewContainer}>
                                <View style={styles.titleContainerLeft}>
                                    <Text style={styles.titleStyle}>Email</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        keyboardType={'email-address'}
                                        autoCorrect={false}
                                        maxLength={255}
                                        placeholder={""}
                                        selectionColor={Colors.blueType1}
                                        // editable={false}
                                        onChangeText={(email) => this.setState({ email })}
                                        value={this.state.email}
                                        autoCapitalize={'none'}
                                    />
                                </View>
                                <View style={styles.titleContainerRight}>
                                    <Text style={styles.titleStyle}>Phone</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        placeholderTextColor={Colors.grayTextColor}
                                        borderColor={'transparent'}
                                        autoCorrect={false}
                                        placeholder={""}
                                        selectionColor={Colors.blueType1}
                                        // editable={false}
                                        onChangeText={(phone) => this.setState({ phone })}
                                        value={this.state.phone}
                                        autoCapitalize={'none'}
                                    />
                                </View>
                            </View>
                            {/*LOCATION*/}
                            <View style={[styles.titleContainerLeft, { marginTop: 10 }]}>
                                <Text style={styles.titleStyle}>Town</Text>
                                {
                                    (this.state.latitude == 0 || this.state.longitude == 0) ?
                                        <TextField
                                            inputStyle={styles.inputText}
                                            placeholderTextColor={Colors.grayTextColor}
                                            borderColor={'transparent'}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            // onChangeText={(address) => this.setState({ address })}
                                            // value={this.state.address}
                                            rightIcon={Images.addressIcon}
                                            onRightIconAction={() => this.openLocationSelectionScreen()}
                                            onPress={() => (this.state.latitude == 0 || this.state.longitude == 0) ? this.openLocationSelectionScreen() : null}
                                        //editable={(this.state.latitude == 0 || this.state.longitude == 0) ? false : true}
                                        />
                                        :
                                        <TextField
                                            inputStyle={styles.inputText}
                                            placeholderTextColor={Colors.grayTextColor}
                                            borderColor={'transparent'}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            onChangeText={(address) => this.setState({ address })}
                                            value={this.state.address}
                                            rightIcon={Images.addressIcon}
                                            onRightIconAction={() => this.openLocationSelectionScreen()}
                                        // onPress={() => (this.state.latitude == 0 || this.state.longitude == 0) ? this.openLocationSelectionScreen() : null}
                                        //editable={(this.state.latitude == 0 || this.state.longitude == 0) ? false : true}
                                        />
                                }
                                {/* <TextField
                                    inputStyle={styles.inputText}
                                    placeholderTextColor={Colors.grayTextColor}
                                    borderColor={'transparent'}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(address) => this.setState({ address })}
                                    value={this.state.address}
                                    rightIcon={Images.addressIcon}
                                    onRightIconAction={() => this.openLocationSelectionScreen()}
                                    onPress={() => (this.state.latitude == 0 || this.state.longitude == 0) ? this.openLocationSelectionScreen() : null}
                                    editable={(this.state.latitude == 0 || this.state.longitude == 0) ? false : true}
                                /> */}
                            </View>
                            {/*BIO OR Briefly describe your artwork*/}
                            <View style={styles.artworkDescriptionStyle}>
                                <Text style={styles.titleStyle}>Briefly describe your artwork</Text>
                                <TextField
                                    inputStyle={Utility.isPlatformAndroid ? styles.inputTextDescriptionAndroid : styles.inputTextDescription}
                                    autoCorrect={false}
                                    placeholder={""}
                                    selectionColor={Colors.blueType1}
                                    multiline={true}
                                    onChangeText={(bio) => this.setState({ bio })}
                                    value={this.state.bio}
                                />
                            </View>
                            {/*LINKS*/}
                            <View style={{ marginTop: 10 }}>
                                <View style={[styles.sourceNameAndLinkContainer]}>
                                    <View style={styles.sourceNameAndLinkInnerInputContainer}>
                                        <View style={styles.sourceNameContainer}>
                                            <Text style={styles.textStyle}>Source Name</Text>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                editable={true}
                                                onChangeText={(sourceName1) => this.setState({ sourceName1 })}
                                                value={this.state.sourceName1}
                                            />
                                        </View>
                                        <View style={styles.linkContainer}>
                                            <Text style={styles.textStyle}>Link</Text>
                                            <TextField
                                                inputStyle={styles.inputLinkInnerText}
                                                placeholderTextColor={Colors.grayTextColor}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                ref={"sourceName1Value"}
                                                onSubmitEditing={(event) => {
                                                    this.refs.sourceName1Value.focus();
                                                }}
                                                returnKeyType="next"
                                                onChangeText={(sourceName1Value) => this.setState({ sourceName1Value })}
                                                value={this.state.sourceName1Value}
                                                autoCapitalize={'none'}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.sourceNameAndLinkContainer}>
                                    <View style={styles.sourceNameAndLinkInnerInputContainer}>
                                        <View style={styles.sourceNameContainer}>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                editable={true}
                                                onChangeText={(sourceName2) => this.setState({ sourceName2 })}
                                                value={this.state.sourceName2}
                                            />
                                        </View>
                                        <View style={styles.linkContainer}>
                                            <TextField
                                                inputStyle={styles.inputLinkInnerText}
                                                placeholderTextColor={Colors.grayTextColor}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                ref={"sourceName2Value"}
                                                onSubmitEditing={(event) => {
                                                    this.refs.sourceName2Value.focus();
                                                }}
                                                returnKeyType="next"
                                                onChangeText={(sourceName2Value) => this.setState({ sourceName2Value })}
                                                value={this.state.sourceName2Value}
                                                autoCapitalize={'none'}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.sourceNameAndLinkContainer}>
                                    <View style={styles.sourceNameAndLinkInnerInputContainer}>
                                        <View style={styles.sourceNameContainer}>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                editable={true}
                                                onChangeText={(sourceName3) => this.setState({ sourceName3 })}
                                                value={this.state.sourceName3}
                                            />
                                        </View>
                                        <View style={styles.linkContainer}>
                                            <TextField
                                                inputStyle={styles.inputLinkInnerText}
                                                placeholderTextColor={Colors.grayTextColor}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                ref={"sourceName3Value"}
                                                onSubmitEditing={(event) => {
                                                    this.refs.sourceName3Value.focus();
                                                }}
                                                returnKeyType="next"
                                                onChangeText={(sourceName3Value) => this.setState({ sourceName3Value })}
                                                value={this.state.sourceName3Value}
                                                autoCapitalize={'none'}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.sourceNameAndLinkContainer}>
                                    <View style={styles.sourceNameAndLinkInnerInputContainer}>
                                        <View style={styles.sourceNameContainer}>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                editable={true}
                                                onChangeText={(sourceName4) => this.setState({ sourceName4 })}
                                                value={this.state.sourceName4}
                                            />
                                        </View>
                                        <View style={styles.linkContainer}>
                                            <TextField
                                                inputStyle={styles.inputLinkInnerText}
                                                placeholderTextColor={Colors.grayTextColor}
                                                borderColor={'transparent'}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                ref={"instgram_url"}
                                                returnKeyType="done"
                                                onChangeText={(sourceName4Value) => this.setState({ sourceName4Value })}
                                                value={this.state.sourceName4Value}
                                                autoCapitalize={'none'}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            {/*COVER IMAGE*/}
                            <TouchableOpacity style={{ marginVertical: 25 }} onPress={() => this.btnSelectImageTapped(COVER_PHOTO, 0)}>
                                <View style={styles.bannerProjectContainer}>
                                    {((this.state.photoIDUrlCover != undefined) ||
                                        (Utility.user != undefined && Utility.user.profile_banner_photo != "")) ?
                                        <ProgressiveImage
                                            style={{
                                                width: Utility.screenWidth,
                                                height: 150,
                                                alignSelf: 'center',
                                                resizeMode: 'contain'
                                            }}
                                            uri={(this.state.photoIDUrlCover != undefined) ?
                                                this.state.photoIDUrlCover : Utility.user != undefined ? Utility.user.profile_banner_photo : undefined}
                                            placeholderSource={Images.placeholderMediaImage}
                                        />
                                        : <INTButton
                                            buttonStyle={{ alignSelf: 'center', left: 0, bottom: 0, right: 0, top: 0 }}
                                            icon={Images.cloudIcon}
                                            title="Banner Project"
                                            titleStyle={styles.bannerProjectText}
                                            spaceBetweenIconAndTitle={10}
                                            onPress={() => this.btnSelectImageTapped(COVER_PHOTO, 0)}
                                        />
                                    }

                                </View>
                            </TouchableOpacity>
                            {/*COMPLETED PROJECT*/}
                            {/* <View style={styles.completedProjectView}>
                                <Text style={styles.titleStyle}>Please provide 3 examples of completed projects</Text>
                                <View style={styles.buttonContainerView}>
                                    <View>
                                        {(this.state.photoIDUrl1 != undefined || this.state.photoURL1 != undefined)
                                            ?
                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 1)}>
                                                <ProgressiveImage
                                                    style={styles.projectImage}
                                                    uri={(this.state.photoIDUrl1 != undefined) ?
                                                        this.state.photoIDUrl1 : this.state.photoURL1 != undefined ? this.state.photoURL1 : undefined}
                                                    placeholderSource={Images.placeholderMediaImage}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <INTButton
                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                icon={Images.cloudIconLight}
                                                onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 1)}
                                            />
                                        }
                                    </View>
                                    <View>
                                        {(this.state.photoIDUrl2 != undefined || this.state.photoURL2 != undefined)
                                            ?
                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 2)}>
                                                <ProgressiveImage
                                                    style={styles.projectImage}
                                                    uri={this.state.photoIDUrl2 != undefined ?
                                                        this.state.photoIDUrl2 : this.state.photoURL2 != undefined ? this.state.photoURL2 : undefined}
                                                    placeholderSource={Images.placeholderMediaImage}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <INTButton
                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                icon={Images.cloudIconLight}
                                                onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 2)}
                                            />
                                        }
                                    </View>
                                    <View>
                                        {(this.state.photoIDUrl3 != undefined || this.state.photoURL3 != undefined)
                                            ?
                                            <TouchableOpacity onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 3)}>
                                                <ProgressiveImage
                                                    style={styles.projectImage}
                                                    uri={this.state.photoIDUrl3 != undefined ?
                                                        this.state.photoIDUrl3 : this.state.photoURL3 != undefined ? this.state.photoURL3 : undefined}
                                                    placeholderSource={Images.placeholderMediaImage}
                                                />
                                            </TouchableOpacity>
                                            :
                                            <INTButton
                                                buttonStyle={styles.defaultCompletedProjectButton}
                                                icon={Images.cloudIconLight}
                                                onPress={() => this.btnSelectImageTapped(COMPLETED_PROJECT, 3)}
                                            />
                                        }
                                    </View>
                                </View>
                            </View> */}
                        </View>
                        {/*SAVE BUTTON*/}
                        <View style={{ marginTop: 25, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                            <INTButton buttonStyle={{ paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                title='Save'
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
export default ArtistProfileViewController