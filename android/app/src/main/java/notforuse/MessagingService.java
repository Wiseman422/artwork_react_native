package notforuse;

import android.os.Bundle;
import android.util.Log;

import com.evollu.react.fcm.FIRLocalMessagingHelper;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONObject;

import java.util.Map;

public class MessagingService extends FirebaseMessagingService {

    private static final String TAG = "MessagingService";


    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

//        Intent i = new Intent("com.evollu.react.fcm.ReceiveNotification");
//        i.putExtra("data", remoteMessage);
//        handleBadge(remoteMessage);
        buildLocalNotification(remoteMessage);

//        final Intent message = i;
//
//        // We need to run this on the main thread, as the React code assumes that is true.
//        // Namely, DevServerHelper constructs a Handler() without a Looper, which triggers:
//        // "Can't create handler inside thread that has not called Looper.prepare()"
//        Handler handler = new Handler(Looper.getMainLooper());
//        handler.post(new Runnable() {
//            public void run() {
//                // Construct and load our normal React JS code bundle
//                ReactInstanceManager mReactInstanceManager = ((ReactApplication) getApplication()).getReactNativeHost().getReactInstanceManager();
//                ReactContext context = mReactInstanceManager.getCurrentReactContext();
//                // If it's constructed, send a notification
//                if (context != null) {
//                    context.sendOrderedBroadcast(message, null);
//                } else {
//                    // Otherwise wait for construction, then send the notification
//                    mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
//                        public void onReactContextInitialized(ReactContext context) {
//                            context.sendOrderedBroadcast(message, null);
//                        }
//                    });
//                    if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
//                        // Construct it in the background
//                        mReactInstanceManager.createReactContextInBackground();
//                    }
//                }
//            }
//        });
    }

//    public void handleBadge(RemoteMessage remoteMessage) {
//        BadgeHelper badgeHelper = new BadgeHelper(this);
//        if (remoteMessage.getData() == null) {
//            return;
//        }
//
//        Map data = remoteMessage.getData();
//        if (data.get("badge") == null) {
//            return;
//        }
//
//        try {
//            int badgeCount = Integer.parseInt((String) data.get("badge"));
//            badgeHelper.setBadgeCount(badgeCount);
//        } catch (Exception e) {
//            Log.e(TAG, "Badge count needs to be an integer", e);
//        }
//    }

    public void buildLocalNotification(RemoteMessage remoteMessage) {
//        if(remoteMessage.getData() == null){
//            return;
//        }
//        Map<String, String> data = remoteMessage.getData();
//        String customNotification = data.get("custom_notification");
//        Log.e("FCM custom_notification","custom_notification");
//        if(customNotification != null){
//            try {
//                Bundle bundle = BundleJSONConverter.convertToBundle(new JSONObject(customNotification));
//                FIRLocalMessagingHelper helper = new FIRLocalMessagingHelper(this.getApplication());
//                helper.sendNotification(bundle);
//            } catch (JSONException e) {
//                e.printStackTrace();
//            }
//
//        }

        if (remoteMessage.getData() == null) {
            return;
        }
        //{user_id=17, body=Message11, title=DFY Space, noti_type=admin_msg}
        Log.e(TAG, "Remote message received>>" + remoteMessage.getData());
        Map<String, String> data = remoteMessage.getData();

        JSONObject obj = new JSONObject(data);
        Log.d("My App", obj.toString());
//            String newObj = obj.getString("payload");
//            JSONObject newData = new JSONObject(newObj);
//            Log.e(TAG, "Remote message received>>" + newData.getString("body"));
//            JSONObject notifObj = new JSONObject(newData.getString("body"));
        Bundle bundle = new Bundle();
        bundle.putString("body", obj.optString("message") + "");
        bundle.putString("title", "Artwork");
        FIRLocalMessagingHelper helper = new FIRLocalMessagingHelper(this.getApplication());
        helper.sendNotification(bundle);
    }
}
