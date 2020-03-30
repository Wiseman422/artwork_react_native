package com.locart;

import com.evollu.react.fcm.FIRMessagingPackage; //fcm

import android.content.Intent;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.controllers.ActivityCallbacks;

import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.underscope.react.fbak.RNAccountKitPackage;

public class MainApplication extends NavigationApplication {
    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        setActivityCallbacks(new ActivityCallbacks() {
            @Override
            public void onActivityResult(int requestCode, int resultCode, Intent data) {
                mCallbackManager.onActivityResult(requestCode, resultCode, data);
            }
        });
        AppEventsLogger.activateApp(this);
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                // eg. new VectorIconsPackage()
                new ImagePickerPackage(),
                new FBSDKPackage(mCallbackManager),
                new RNAccountKitPackage(),
                new RNGooglePlacesPackage(),
                new RNGoogleSigninPackage(),
                new UtilityController(),
                new RNFirebasePackage(),
                new RNFirebaseAnalyticsPackage(),
                new RNFetchBlobPackage(),
                new FIRMessagingPackage(),
                new RNDeviceInfo(),
                new InAppBillingBridgePackage()
        );
    }

    @Override
    public String getJSMainModuleName() {
        return "index";
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
