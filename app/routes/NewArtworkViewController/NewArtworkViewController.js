import React, { Component } from 'react';
import { Text, View, Platform, Image, FlatList, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import styles from './styles'
import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SafeAreaView from '../../component/SafeAreaView';
import TextField from '../../component/TextField'
import INTButton from '../../component/INTButton'
import TagView from '../../component/TagView';
import { Color } from 'react-native-facebook-account-kit';
import ModalBox from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';
import WebClient from '../../config/WebClient';
import Settings from '../../config/Settings';
import ProgressiveImage from '../../component/ProgressiveImage';
import { RNS3 } from 'react-native-aws3';
var ImagePicker = require('react-native-image-picker');

class NewArtworkViewController extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.state = {
            artwork_id: this.props.artwork_id,
            isEditArtwork: this.props.artwork_id != undefined,
            preferred_medium: Utility.user != undefined ? Utility.user.preferred_medium : "",
            preferred_medium_id: Utility.user != undefined ? Utility.user.preferred_medium_id : "",
            size: "",
            // size_id: 0,
            project_type: "",
            // project_type_id: 0,
            title: "",
            description: "",
            price: "",
            tag_id: "",
            arrArtPhotos: [{
                key: 0,
                photoIDUrl: null,//null assign because need to all params return at the render item load time
                photo: "",
                photoServerURL: "", photoServerImageName: "",
            }, {
                key: 1,
                photoIDUrl: null,
                photo: "",
                photoServerURL: "", photoServerImageName: "",
            }, {
                key: 2,
                photoIDUrl: null,
                photo: "",
                photoServerURL: "", photoServerImageName: "",
            }, {
                key: 3,
                photoIDUrl: null,
                photo: "",
                photoServerURL: "", photoServerImageName: "",
            }, {
                key: 4,
                photoIDUrl: null,
                photo: "",
                photoServerURL: "", photoServerImageName: "",
            }],
            arrSize: [],
            sizeModalVisible: false,
            arrPreferredMediumList: [],
            preferedMediumModalVisible: false,
            arrProjectTypeList: [],
            projectTypeModalVisible: false,
            arrTagsHorizontal: [],
            spinnerVisible: false,
            hasCameraPermission: undefined,
            hasWritePermission: undefined,

            isRepeatable: 0,
            repeatableQuantity: 1,

            dipatchOptionShipping: 0,
            shipping_cost: '',

            dipatchOptionDelivery: 0,
            delivery_cost: '',

            dipatchOptionPickup: 0,
        };
    }

    componentDidMount() {
        if (Utility.getAWSData == undefined) {
            Utility.getAWS();
        }
        if (Utility.user != undefined && (Utility.user.latitude == 0 || Utility.user.longitude == 0)) {
        } else {
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

            // this.getSize();
            this.getPreferredMedium();
            // this.getProjectType();
            if (this.state.isEditArtwork) {
                this.callArtworkDetailAPI();
            }
        }
    }
    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':

                this.updateAddressAlert();
                break;
            case 'didAppear':
                break;
            case 'willDisappear':
                break;
            case 'didDisappear':
                break;
            case 'willCommitPreview':
                break;
        }
    }

    updateAddressAlert() {
        if (Utility.user != undefined && (Utility.user.latitude == 0 || Utility.user.longitude == 0)) {
            Alert.alert(
                'Address not available',
                'Please update your address from your profile',
                [
                    { text: 'Cancel', onPress: () => this.leftBtnTaaped(), style: 'cancel' },
                    {
                        text: 'Update Address', onPress: () =>
                            Utility.push('ArtistProfileViewController', {
                                isFromNewArtWork: true,
                                onNavigationCallBack: this.onNavigationCallBack.bind(this)
                            })
                    },
                ],
                { cancelable: false }
            )
        }
    }
    onNavigationCallBack(params) {
        if (params.isSuccess) {
            if (params.isSuccess == false) {
                this.updateAddressAlert();
            }
        } else {
            this.updateAddressAlert();
        }
        if (this.state.arrPreferredMediumList.length == 0) {
            this.getPreferredMedium();
        }
    }
    //API
    callArtworkDetailAPI() {
        this.setState({ spinnerVisible: true });
        var params = {
            'user_id': Utility.user.user_id + '',
            'artwork_id': this.state.artwork_id + '',
        };
        // console.log('PARAMS: ' + params)
        WebClient.postRequest(Settings.URL.GET_ARTWORK_DETAIL, params, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                if (response) {
                    var arrTempArtPhotos = this.state.arrArtPhotos;
                    if (response.artwork_photos.length > 0) {
                        for (var i = 0; i < response.artwork_photos.length; i++) {
                            var element = response.artwork_photos[i];
                            arrTempArtPhotos[i].photoServerImageName = element.image_name;
                            arrTempArtPhotos[i].photoServerURL = element.thumb_name;
                        }
                    }
                    this.setState({
                        title: response.title + '',
                        description: response.description + '',
                        price: response.price + '',
                        preferred_medium: response.preferred_medium + '',
                        preferred_medium_id: response.preferred_medium_id + '',
                        size: response.size + '',
                        // size_id: response.size_id,
                        project_type: response.project_type,
                        // project_type_id: response.project_type_id,
                        arrArtPhotos: arrTempArtPhotos,
                        arrTagsHorizontal: response.tags,
                        isRepeatable: response.is_repeatable + '',
                        repeatableQuantity: response.quantity != undefined ? response.quantity == 0 ? '1' : response.quantity : '1',
                        shipping_cost: response.shipping_cost + '',
                        delivery_cost: response.delivery_cost + '',
                        dipatchOptionShipping: (response.is_shipping) ? response.is_shipping : '0',
                        dipatchOptionDelivery: (response.is_delivery) ? response.is_delivery : '0',
                        dipatchOptionPickup: (response.is_pickup) ? response.is_pickup : '0'
                    })
                } else {
                    this.leftBtnTaaped();
                }
            } else {
                Utility.showToast(error.message);
            }
        });
    }
    renderPhotoViewCell(rowData) {
        return (
            <View>
                {((rowData.item.photoIDUrl != undefined && rowData.item.photoIDUrl != null) || rowData.item.photo != '' || rowData.item.photoServerURL != '')
                    ?
                    <TouchableOpacity onPress={() => this.btnSelectImageTapped(rowData.item.key)}>
                        <ProgressiveImage
                            style={styles.artworkImage}
                            uri={(rowData.item.photoIDUrl != undefined && rowData.item.photoIDUrl != null) ?
                                rowData.item.photoIDUrl : rowData.item.photo != "" ?
                                    rowData.item.photo : rowData.item.photoServerURL != "" ?
                                        rowData.item.photoServerURL : undefined}
                            placeholderSource={Images.placeholderMediaImage}
                        />
                    </TouchableOpacity>
                    :
                    <INTButton
                        buttonStyle={styles.defaultCompletedProjectButton}
                        icon={Images.cloudIconLight}
                        onPress={() => this.btnSelectImageTapped(rowData.item.key)}
                    />
                }
            </View>
        );
    }

    //API
    //Size Modal
    // getSize() {
    //     WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
    //         'type': 'size',
    //     }, (response, error) => {
    //         if (error == null) {
    //             console.log("response >> " + response);
    //             if (response.length > 0) {
    //                 this.setState({ arrSize: response })
    //             }
    //         } else {
    //             Utility.showToast(error.message);
    //         }
    //     });
    // }
    // sizeClick() {
    //     Utility.hideKeyboard();
    //     this.setState({ sizeModalVisible: true });
    // }
    // sizetemClick(item) {
    //     this.setState({ size: item.name });
    //     this.setState({ size_id: item.id });
    //     this.setState({ sizeModalVisible: false });
    // }
    // sizePopUpClose() {
    //     this.setState({ sizeModalVisible: false });
    // }

    //API
    //Prefered Modal
    getPreferredMedium() {
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
    preferredMediumClick() {
        Utility.hideKeyboard();
        this.setState({ preferedMediumModalVisible: true });
    }
    preferredMediumItemClick(item) {
        this.setState({
            preferred_medium: item.name,
            preferred_medium_id: item.id,
            preferedMediumModalVisible: false
        });
    }
    preferredMediumPopUpClose() {
        this.setState({ preferedMediumModalVisible: false });
    }
    //API
    //Project Type Modal
    // getProjectType() {
    //     this.setState({ spinnerVisible: true });
    //     WebClient.postRequest(Settings.URL.GET_MASTER_DATA, {
    //         'type': 'project_type',
    //     }, (response, error) => {
    //         this.setState({ spinnerVisible: false });
    //         if (error == null) {
    //             console.log("response >> " + response);
    //             if (response.length > 0) {
    //                 this.setState({ arrProjectTypeList: response })
    //             }
    //         } else {
    //             Utility.showToast(error.message);
    //         }
    //     });
    // }
    // projectTypeClick() {
    //     Utility.hideKeyboard();
    //     this.setState({ projectTypeModalVisible: true });
    // }
    // projectTypeItemClick(item) {
    //     this.setState({ project_type: item.name });
    //     // this.setState({ project_type_id: item.id });
    //     this.setState({ projectTypeModalVisible: false });
    // }
    // projectTypePopUpClose() {
    //     this.setState({ projectTypeModalVisible: false });
    // }


    onTagClick(index) {
        Utility.hideKeyboard();
        console.log(this.state.arrTagsHorizontal[index]);
    }

    leftBtnTaaped() {
        Utility.hideKeyboard();
        Utility.navigator.pop({
            animated: true,
        });
    }

    onUniqueRepeatableTapped(status) {
        this.setState({ isRepeatable: status });
    }

    onShippingTapped() {
        this.setState({ dipatchOptionShipping: (this.state.dipatchOptionShipping == 0 ? 1 : 0) })
    }

    onDeliveryTapped() {
        this.setState({ dipatchOptionDelivery: (this.state.dipatchOptionDelivery == 0 ? 1 : 0) })
    }

    onPickupTapped() {
        this.setState({ dipatchOptionPickup: (this.state.dipatchOptionPickup == 0 ? 1 : 0) })
    }

    //Image Selection
    btnSelectImageTapped(number) {
        Utility.hideKeyboard();
        Utility._checkCameraPermission().then((hasCameraPermission) => {
            this.setState({ hasCameraPermission });
            if (!hasCameraPermission) return;
            else {
                Utility._checkWriteStoragePermission().then((hasWritePermission) => {
                    this.setState({ hasWritePermission });
                    if (!hasWritePermission) return;
                    else {
                        this.selectImage(number);
                    }
                });
            }
        });

    }

    selectImage(number) {
        if (this.state.hasCameraPermission && this.state.hasWritePermission) {
            ImagePicker.showImagePicker({
                title: 'Select Photo',//customButtons: [ { name: 'fb', title: 'Choose Photo from Facebook' } ],
                storageOptions: {
                    skipBackup: true, path: 'images'
                }
            }, (response) => {
                console.log('Response = ', response);
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
                    console.log("uri >>>>> " + response.uri);
                    let photoUpdate = this.state.arrArtPhotos[number];
                    photoUpdate.photoIDUrl = response.uri;
                    this.state.arrArtPhotos[number] = photoUpdate;
                    this.setState({ arrArtPhotos: this.state.arrArtPhotos });
                }
            });
        }
    }
    subscribeTapped() {
        Utility.push('SubscriptionViewController', {
            isFromNotSubscribe: true,
            onSubscriptionCallBack: this.onSubscriptionCallBack.bind(this)
        })
    }
    onSubscriptionCallBack(params) {
        if (params.isSuccess == true) {
            this.setState({})
        }
    }

    addArtworkTapped() {
        if (Utility.user.subscription_type == Utility.SUBSCRIPTION_TYPE.NOT_SUBSCRIBE) {
            Alert.alert(
                'Subscription Expired',
                Utility.MESSAGES.subscription_expired,
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Subscribe', onPress: () => { this.subscribeTapped() } },
                ],
                { cancelable: true }
            )
            // Utility.showToast(Utility.MESSAGES.subscription_expired)
            return;
        }
        // here set state because tagview lose state when other state changed
        this.setState({ arrTagsHorizontal: this._tagView.state.tags });

        var imageCount = 0;
        for (var i = 0; i < this.state.arrArtPhotos.length; i++) {
            var element = this.state.arrArtPhotos[i];
            if (element.photoIDUrl != null || element.photo.length > 0) {
                imageCount = imageCount + 1;
            }
        }
        if (Utility.user != undefined && (Utility.user.latitude == 0 || Utility.user.longitude == 0)) {
            this.updateAddressAlert();
        }
        else if (imageCount == 0 && !this.state.isEditArtwork) {
            Utility.showToast(Utility.MESSAGES.please_select_art_image)
        } else if (this.state.title.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_project_title)
        } else if (this.state.preferred_medium_id == 0) {
            Utility.showToast(Utility.MESSAGES.please_select_medium)
        } else if (this.state.description.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_project_details)
        } else if (this.state.size.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_select_size)
        } else if (this.state.project_type.trim() == "") {
            Utility.showToast(Utility.MESSAGES.please_select_project_type)
        } else if (this.state.price == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_art_price)
        } else if (this.state.dipatchOptionShipping == 0 && this.state.dipatchOptionDelivery == 0 && this.state.dipatchOptionPickup == 0) {
            Utility.showToast(Utility.MESSAGES.please_select_dispatch_options)
        }
        else if (this.state.dipatchOptionShipping == 1 && this.state.shipping_cost == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_shipping_cost)
        } else if (this.state.dipatchOptionDelivery == 1 && this.state.delivery_cost == "") {
            Utility.showToast(Utility.MESSAGES.please_enter_delivery_cost)
        }
        else {
            this.uploadImage(0)
        }
    }
    uploadImage(number) {
        if (Utility.getAWSData == undefined) {
            return;
        }
        if (this.state.arrArtPhotos[number].photoIDUrl != null) {
            var photo = {
                uri: this.state.arrArtPhotos[number].photoIDUrl,
                type: 'image/*',
                name: (Utility.isPlatformAndroid ? 'android_' : 'ios_') + new Date().getTime() + '.jpg'
            };

            const options = {
                keyPrefix: Utility.getAWSData.folder_feedpic + '/',
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
                    let photoUpdate = this.state.arrArtPhotos[number];
                    photoUpdate.photo = photo.name;
                    this.state.arrArtPhotos[number] = photoUpdate;
                    this.setState({ arrArtPhotos: this.state.arrArtPhotos });
                    if (number == (this.state.arrArtPhotos.length - 1)) {
                        this.saveArtwork();
                    } else {
                        this.uploadImage(number + 1);
                    }
                }
            });
            // WebClient.uploadMedia(Settings.URL.MEDIA_UPLOAD, {
            //     'type': 'artwork_images',
            //     'media_file': photo,
            // }, (response, error) => {
            //     if (error == null) {
            //         let photoUpdate = this.state.arrArtPhotos[number];
            //         photoUpdate.photo = response.filename;
            //         this.state.arrArtPhotos[number] = photoUpdate;
            //         this.setState({ arrArtPhotos: this.state.arrArtPhotos });
            //         if (number == (this.state.arrArtPhotos.length - 1)) {
            //             this.saveArtwork();
            //         } else {
            //             this.uploadImage(number + 1);
            //         }
            //     } else {
            //         Utility.showToast(error.message);
            //         this.setState({ spinnerVisible: false });
            //     }
            // });
        } else {
            if (number == (this.state.arrArtPhotos.length - 1)) {
                this.saveArtwork();
            } else {
                let photoUpdate = this.state.arrArtPhotos[number];
                if (photoUpdate.photoServerImageName != null && photoUpdate.photoServerImageName != "") {
                    photoUpdate.photo = photoUpdate.photoServerImageName;
                }
                this.state.arrArtPhotos[number] = photoUpdate;
                this.setState({ arrArtPhotos: this.state.arrArtPhotos });
                this.uploadImage(number + 1);
            }
        }
    }

    getArtworkUplodedImages() {
        // console.log("Upload Image List: " + (this.state.arrArtPhotos.map((photoItem) => { return photoItem.photo })).join(','));
        return (this.state.arrArtPhotos.map((photoItem) => { return photoItem.photo })).join(',');
    }

    saveArtwork() {
        this.setState({ spinnerVisible: true });
        var paramRequest = {
            'user_id': Utility.user.user_id + '',
            'artwork_id': this.state.isEditArtwork ? this.state.artwork_id + '' : 0 + '',//0 for new Art create
            'title': this.state.title,
            'description': this.state.description,
            'price': this.state.price + '',
            'preferred_medium_id': this.state.preferred_medium_id + '',
            'size': this.state.size + '',
            'project_type': this.state.project_type + '',
            'tags': this._tagView.state.tags.join(','),
            'artwork_images': this.getArtworkUplodedImages(),
            'is_repeatable': this.state.isRepeatable + '',
            'quantity': this.state.repeatableQuantity + '',
            'is_shipping': this.state.dipatchOptionShipping + '',
            'shipping_cost': this.state.shipping_cost + '',
            'is_delivery': this.state.dipatchOptionDelivery + '',
            'delivery_cost': this.state.delivery_cost + '',
            'is_pickup': this.state.dipatchOptionPickup + '',
        }
        console.log('PARAMS ' + paramRequest)
        WebClient.postRequest(Settings.URL.ADD_ARTWORK, paramRequest, (response, error) => {
            this.setState({ spinnerVisible: false });
            if (error == null) {
                Utility.showToast(Utility.MESSAGES.artwork_added_success);
                Utility.resetTo('HomeViewController')
                this.leftBtnTaaped();
            } else {
                Utility.showToast(error.message);
            }
        }, true);
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.surfaceView}>
                    <View style={styles.topViewStyle}>
                        <TouchableOpacity onPress={() => this.leftBtnTaaped()} activeOpacity={0.7}>
                            <View style={styles.titleView}>
                                <Image source={Images.topBarBackBlue} />
                                <Text style={styles.titleTextStyle}>{this.state.isEditArtwork ? "UPDATE ARTWORK" : "POST NEW ARTWORK"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <KeyboardAwareScrollView style={{ marginTop: 20 }}
                        extraScrollHeight={100}
                        onScroll={this.handleScroll}
                        keyboardShouldPersistTaps={"always"}
                        automaticallyAdjustContentInsets={true}
                        bounces={true}
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.viewDetailContainer}>
                            <Text style={styles.textArtworkPhotos}>Artwork Photos</Text>
                            <FlatList
                                style={styles.gridViewComponentStyle}
                                data={this.state.arrArtPhotos}
                                renderItem={this.renderPhotoViewCell.bind(this)}
                                horizontal={true}
                                extraData={this.state}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={styles.applicationFormContainer}>
                            <View style={styles.applicationFormInnerContainer}>
                                <View style={[styles.titleContainer, { marginRight: 10 }]}>
                                    <Text style={styles.titleStyle}>Project Name</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        placeholder={""}
                                        ref={"title"}
                                        onSubmitEditing={(event) => {
                                            this.refs.description.focus();
                                        }}
                                        returnKeyType="next"
                                        selectionColor={Colors.blueType1}
                                        onChangeText={(title) => this.setState({ title })}
                                        value={this.state.title}
                                    />
                                </View>
                                <View style={[styles.titleContainer, { marginLeft: 10 }]}>
                                    <TouchableOpacity
                                        //onPress={() => this.preferredMediumClick()} 
                                        activeOpacity={0.9}>
                                        <Text style={styles.titleStyle}>Medium</Text>
                                        <View style={[styles.dropDownView]}>
                                            <Text style={[styles.dropDownText]} numberOfLines={1} onPress={() => this.preferredMediumClick()}>
                                                {this.state.preferred_medium}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.artworkDescriptionStyle}>
                                <Text style={styles.titleStyle}>Project Details</Text>
                                <TextField
                                    inputStyle={Utility.isPlatformAndroid ? styles.inputTextDescriptionAndroid : styles.inputTextDescription}
                                    autoCorrect={false}
                                    placeholder={""}
                                    multiline={true}
                                    ref={"description"}
                                    selectionColor={Colors.blueType1}
                                    onChangeText={(description) => this.setState({ description })}
                                    value={this.state.description}
                                />
                            </View>
                            <View style={styles.applicationFormInnerContainer}>
                                {/* <View style={styles.titleContainer}>
                                    <TouchableOpacity
                                        onPress={() => this.sizeClick()}
                                        activeOpacity={0.9}>
                                        <Text style={styles.titleStyle}>Size</Text>
                                        <View style={[styles.dropDownView]}>
                                            <Text style={[styles.dropDownText]} numberOfLines={1}>
                                                {this.state.size}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View> */}
                                <View style={[styles.titleContainer, { flex: 0.8 }]}>
                                    <Text style={styles.titleStyle} numberOfLines={1}>Size</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        placeholder={""}
                                        // keyboardType={'numeric'}
                                        ref={"size"}
                                        onSubmitEditing={(event) => {
                                            this.refs.project_type.focus();
                                        }}
                                        returnKeyType="next"
                                        selectionColor={Colors.blueType1}
                                        onChangeText={(size) => this.setState({ size })}
                                        value={this.state.size}
                                    />
                                </View>
                                <View style={[styles.titleContainer, { marginLeft: 8 }]}>
                                    <Text style={styles.titleStyle} numberOfLines={1}>Project Type</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        placeholder={""}
                                        // keyboardType={'numeric'}
                                        ref={"project_type"}
                                        onSubmitEditing={(event) => {
                                            this.refs.price.focus();
                                        }}
                                        returnKeyType="next"
                                        selectionColor={Colors.blueType1}
                                        onChangeText={(project_type) => this.setState({ project_type })}
                                        value={this.state.project_type + ''}
                                    />
                                    {/* <TouchableOpacity
                                        onPress={() => this.projectTypeClick()}
                                        activeOpacity={0.9}>
                                        <View style={[styles.dropDownView]}>
                                            <Text style={[styles.dropDownText]} numberOfLines={1}>
                                                {this.state.project_type}
                                            </Text>
                                        </View>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={{ marginLeft: 8 }}>
                                    <Text style={styles.titleStyle} numberOfLines={1}>Artwork Price({Utility.DOLLOR})</Text>
                                    <TextField
                                        inputStyle={styles.inputText}
                                        autoCorrect={false}
                                        placeholder={""}
                                        selectionColor={Colors.blueType1}
                                        keyboardType={'numeric'}
                                        maxLength={8}
                                        ref={"price"}
                                        // onSubmitEditing={(event) => {
                                        //     this.refs.shipping_cost.focus();
                                        // }}
                                        returnKeyType="next"
                                        onChangeText={(price) => this.setState({ price })}
                                        value={this.state.price + ""}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }} >
                                <INTButton buttonStyle={[styles.btnUniqueRepeatable, { flex: 0.8 }]}
                                    title="Unique"
                                    titleStyle={styles.btnTitleOptions}
                                    icon={(this.state.isRepeatable == 0) ? Images.radioSelected : Images.radioNotSelected}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.onUniqueRepeatableTapped(Utility.ArtworkType.UNIQUE)} />
                                <INTButton buttonStyle={[styles.btnUniqueRepeatable]}
                                    title="Repeatable"
                                    titleStyle={styles.btnTitleOptions}
                                    icon={(this.state.isRepeatable == 1) ? Images.radioSelected : Images.radioNotSelected}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.onUniqueRepeatableTapped(Utility.ArtworkType.REPEATABLE)} />
                                {this.state.isRepeatable == 1 ?
                                    <View style={{ flex: 0.8, alignContent: 'flex-end', }}>
                                        <Text style={styles.titleStyle}>Quantity</Text>
                                        <TextField
                                            inputStyle={[styles.inputText]}
                                            autoCorrect={false}
                                            placeholder={""}
                                            selectionColor={Colors.blueType1}
                                            keyboardType={'numeric'}
                                            maxLength={8}
                                            ref={"quantity"}
                                            onSubmitEditing={(event) => {
                                                // this.refs.quantity.focus();
                                            }}
                                            returnKeyType="next"
                                            onChangeText={(repeatableQuantity) => this.setState({ repeatableQuantity })}
                                            value={this.state.repeatableQuantity + ''}
                                        />
                                    </View> : null}
                            </View>
                            <View style={{ flexDirection: 'row' }} >
                                <INTButton buttonStyle={styles.btnDeliveryPickup}
                                    title="Shipping"
                                    titleStyle={styles.btnTitleOptions}
                                    icon={(this.state.dipatchOptionShipping == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.onShippingTapped()} />
                                <INTButton buttonStyle={styles.btnDeliveryPickup}
                                    title="Delivery"
                                    titleStyle={styles.btnTitleOptions}
                                    icon={(this.state.dipatchOptionDelivery == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.onDeliveryTapped()} />
                                <INTButton buttonStyle={styles.btnDeliveryPickup}
                                    title="Pickup"
                                    titleStyle={styles.btnTitleOptions}
                                    icon={(this.state.dipatchOptionPickup == 0) ? Images.checkBoxNotSelected : Images.checkBoxSelected}
                                    spaceBetweenIconAndTitle={0}
                                    onPress={() => this.onPickupTapped()} />
                            </View>
                            {(this.state.dipatchOptionShipping == 0 && this.state.dipatchOptionDelivery == 0) ?
                                null : <View style={[styles.applicationFormInnerContainer, { justifyContent: 'flex-start' }]}>
                                    {this.state.dipatchOptionShipping == 1 ?
                                        <View style={{ marginRight: 20, minWidth: 100 }}>
                                            <Text style={styles.titleStyle}>Shipping Cost({Utility.DOLLOR})</Text>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                keyboardType={'numeric'}
                                                maxLength={8}
                                                ref={"shipping_cost"}
                                                returnKeyType="done"
                                                onChangeText={(shipping_cost) => this.setState({ shipping_cost })}
                                                value={this.state.shipping_cost.toString()}
                                            />
                                        </View> : null}
                                    {this.state.dipatchOptionDelivery == 1 ?
                                        <View style={{ minWidth: 100 }}>
                                            <Text style={styles.titleStyle}>Delivery Cost({Utility.DOLLOR})</Text>
                                            <TextField
                                                inputStyle={styles.inputText}
                                                autoCorrect={false}
                                                placeholder={""}
                                                selectionColor={Colors.blueType1}
                                                keyboardType={'numeric'}
                                                maxLength={8}
                                                ref={"delivery_cost"}
                                                onSubmitEditing={(event) => {
                                                    // this.refs.delivery_cost.focus();
                                                }}
                                                returnKeyType="next"
                                                onChangeText={(delivery_cost) => this.setState({ delivery_cost })}
                                                value={this.state.delivery_cost.toString()}
                                            />
                                        </View> : null}
                                </View>}
                            <View style={[styles.tagContainerView, { marginTop: 15 }]}>
                                <Text style={[styles.titleStyle, { marginBottom: 5 }]}>Tags</Text>
                                <TagView
                                    ref={(tagView) => (this._tagView = tagView)}
                                    horizontal={false}
                                    isEditable={true}
                                    onTagClick={(index) => this.onTagClick(index)}
                                    tags={this.state.arrTagsHorizontal}
                                    tagTextStyle={styles.tagTextStyle}
                                    tagContainerStyle={{ backgroundColor: Colors.grayType1, borderColor: Colors.blueType1, borderWidth: 1 }}
                                    maxHeight={120}
                                    inputProps={{
                                        keyboardType: 'default',
                                        placeholder: 'Enter Here',
                                        autoFocus: false,
                                        style: {
                                            fontSize: Utility.NormalizeFontSize(12),
                                            color: Colors.blueType2,
                                        },
                                    }}
                                    inputDefaultWidth={100}>
                                </TagView>
                            </View>
                            <View style={{ marginTop: 25, flex: 1, alignItems: 'center', paddingVertical: 10 }}>
                                <INTButton buttonStyle={{ paddingHorizontal: 20, backgroundColor: Colors.blueType1, justifyContent: 'center' }}
                                    title={this.state.isEditArtwork ? "Update Artwork" : 'Post Artwork'}
                                    titleStyle={{ color: 'white' }}
                                    onPress={() => this.addArtworkTapped()}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </SafeAreaView>
                {/* {this.sizeModal()} */}
                {this.preferedMediumModal()}
                {/* {this.projectTypeModal()} */}
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
    // sizeModal() {
    //     var sizeModelbox = <ModalBox
    //         coverScreen={true}
    //         swipeToClose={false}
    //         backdropPressToClose={false}
    //         swipeToClose={false}
    //         backButtonClose={true}
    //         onClosed={() => this.setState({ sizeModalVisible: false })}
    //         style={styles.modalContainer}
    //         isOpen={this.state.sizeModalVisible}
    //         position='bottom'>
    //         <View style={{ flex: 1, paddingHorizontal: 10 }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    //                 <Text style={[styles.modalHeaderTextStyle]}>Select Size</Text>
    //                 <TouchableOpacity onPress={this.sizePopUpClose.bind(this)} activeOpacity={0.7}>
    //                     <Text style={styles.closeTextStyle} >Close</Text>
    //                 </TouchableOpacity>
    //             </View>
    //             <FlatList
    //                 style={{ marginTop: 5 }}
    //                 data={this.state.arrSize}
    //                 keyExtractor={(item, index) => index}
    //                 renderItem={({ item, index }) =>
    //                     <View style={{ marginHorizontal: 8 }} >
    //                         <Text style={styles.modalTextStyle} onPress={this.sizetemClick.bind(this, item)} >
    //                             {item.name}
    //                             {console.log(">>>> POS " + index)}
    //                         </Text>
    //                         <View style={styles.viewBottom} />
    //                     </View>}
    //                 numColumns={1}
    //             />
    //         </View>
    //     </ModalBox >
    //     return sizeModelbox;
    // }

    preferedMediumModal() {
        var preferedMediumModelbox = <ModalBox
            coverScreen={true}
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
                    <Text style={[styles.modalHeaderTextStyle]}>Select Medium</Text>
                    <TouchableOpacity onPress={this.preferredMediumPopUpClose.bind(this)} activeOpacity={0.7}>
                        <Text style={styles.closeTextStyle} >Close</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{ marginTop: 5 }}
                    data={this.state.arrPreferredMediumList}
                    keyExtractor={(item, index) => index + ''}
                    renderItem={({ item, index }) =>
                        <View style={{ marginHorizontal: 8 }} >
                            <Text style={styles.modalTextStyle} onPress={this.preferredMediumItemClick.bind(this, item)} >
                                {item.name}
                            </Text>
                            <View style={styles.viewBottom} />
                        </View>}
                    numColumns={1}
                />
            </View>
        </ModalBox >
        return preferedMediumModelbox;
    }
    // projectTypeModal() {
    //     var projectTypeModelbox = <ModalBox
    //         coverScreen={true}
    //         swipeToClose={false}
    //         backdropPressToClose={false}
    //         swipeToClose={false}
    //         backButtonClose={true}
    //         onClosed={() => this.setState({ projectTypeModalVisible: false })}
    //         style={styles.modalContainer}
    //         isOpen={this.state.projectTypeModalVisible}
    //         position='bottom'>
    //         <View style={{ flex: 1, paddingHorizontal: 10 }}>
    //             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    //                 <Text style={[styles.modalHeaderTextStyle]}>Select Project Type</Text>
    //                 <TouchableOpacity onPress={this.projectTypePopUpClose.bind(this)} activeOpacity={0.7}>
    //                     <Text style={styles.closeTextStyle} >Close</Text>
    //                 </TouchableOpacity>
    //             </View>
    //             <FlatList
    //                 style={{ marginTop: 5 }}
    //                 data={this.state.arrProjectTypeList}
    //                 keyExtractor={(item, index) => index}
    //                 renderItem={({ item, index }) =>
    //                     <View style={{ marginHorizontal: 8 }} >
    //                         <Text style={styles.modalTextStyle} onPress={this.projectTypeItemClick.bind(this, item)} >
    //                             {item.name}
    //                             {console.log(">>>> POS " + index)}
    //                         </Text>
    //                         <View style={styles.viewBottom} />
    //                     </View>}
    //                 numColumns={1}
    //             />
    //         </View>
    //     </ModalBox >
    //     return projectTypeModelbox;
    // }
}
export default NewArtworkViewController