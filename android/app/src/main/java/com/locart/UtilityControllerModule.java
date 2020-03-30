package com.locart;


import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.ArrayList;

import static com.facebook.accountkit.internal.AccountKitController.getApplicationContext;

public class UtilityControllerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext reactContext;

    public UtilityControllerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "UtilityController";
    }


    @ReactMethod
    public void call(String mobilenumber) {
        try {
            Intent intent = new Intent(Intent.ACTION_CALL);

            intent.setData(Uri.parse("tel:" + mobilenumber));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            reactContext.startActivity(intent);

        } catch (Exception ex) {
            ex.printStackTrace();
            //callback.invoke("error");
        }
    }

    @ReactMethod
    public void sendSMS(ReadableMap options, Callback callback) {

        try {
            ReadableArray a = options.getArray("recipients");


            TelephonyManager telMgr = (TelephonyManager) reactContext.getSystemService(Context.TELEPHONY_SERVICE);
            int simState = telMgr.getSimState();
            if (simState == TelephonyManager.SIM_STATE_ABSENT) {
                callback.invoke("No SIM Available");

            } else {
//                android.telephony.SmsManager mSmsManager = android.telephony.SmsManager.getDefault();
//                mSmsManager.sendTextMessage(a.getString(0), null, options.getString("textMessage"), null, null);


                android.telephony.SmsManager mSmsManager = android.telephony.SmsManager.getDefault();
                ArrayList<String> parts = mSmsManager.divideMessage(options.getString("textMessage"));
                mSmsManager.sendMultipartTextMessage(a.getString(0), null, parts, null, null);
//                mSmsManager.sendTextMessage(a.getString(0), null, options.getString("textMessage"), null, null);

                callback.invoke("success");
                Log.e("message sent", "yes");
            }


        } catch (Exception ex) {
            Log.e("message sent", "fail");
            callback.invoke("error");
            ex.printStackTrace();
        }
    }
    @ReactMethod
    public void openMessenger(ReadableMap options)
    {
        Intent sendIntent = new Intent(Intent.ACTION_SENDTO);
        sendIntent.setData(Uri.parse("sms:" + options.getString("phone")));
        String text = options.getString("textMessage");
        sendIntent.putExtra(Intent.EXTRA_TEXT, text);
        sendIntent.putExtra("sms_body", text);
//        sendIntent.putExtra("exit_on_sent", true);
//        sendIntent.putExtra("finishActivityOnSaveCompleted", true);
        sendIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(sendIntent);
    }
    @ReactMethod
    public void shareApp(String accessId) {
        //final String[] body = {"Download my App, Everything you need to know! Your access ID is" + " " + accessId + "\n" + Uri.parse("https://play.google.com/store/apps/details?id=" + getApplicationContext().getPackageName())};

        final String[] body = {accessId + "\n" + Uri.parse("https://play.google.com/store/apps/details?id=" + getApplicationContext().getPackageName())};
        final Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_SUBJECT, "LocArt");
        share.putExtra(Intent.EXTRA_TEXT, body[0]);
        share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(outputFile));
        reactContext.startActivity(share);
    }

    @ReactMethod
    public void shareRefLink(String link) {
        final String[] body = {link};
        final Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("text/plain");
        share.putExtra(Intent.EXTRA_SUBJECT, "LocArt");
        share.putExtra(Intent.EXTRA_TEXT, body[0]);
        share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(outputFile));
        reactContext.startActivity(share);
    }

    @ReactMethod
    public void openZoomApp(String strUrl) {
        Log.e("openZoomApp", "openZoomApp");
        String appPackageName = "us.zoom.videomeetings";
        boolean isAppInstalled = appInstalledOrNot(appPackageName);
        try {
            if (!isAppInstalled) {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appPackageName));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
            } else {
                Uri uri = Uri.parse(strUrl);
                String token = uri.getLastPathSegment();
                Log.d("Token", "Token" + uri + token);
                Intent intent;
                if (token != null) {
                    intent = new Intent(Intent.ACTION_VIEW, Uri.parse("zoomus://zoom.us/join?confno=" + token));
                } else {
                    intent = new Intent(Intent.ACTION_VIEW, Uri.parse("zoomus://"));
                }
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
//                PackageManager pm = reactContext.getPackageManager();
//                Intent intent = pm.getLaunchIntentForPackage(appPackageName);
//                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                reactContext.startActivity(intent);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private boolean appInstalledOrNot(String uri) {
        PackageManager pm = reactContext.getPackageManager();
        try {
            pm.getPackageInfo(uri, PackageManager.GET_ACTIVITIES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }

    }

    @ReactMethod
    public void isInternetConnected(Callback callback) {
        ConnectivityManager connectivityManager = (ConnectivityManager) reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        callback.invoke(activeNetworkInfo != null && activeNetworkInfo.isConnected());
       // return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }
}
