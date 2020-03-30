package notforuse;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.facebook.react.common.ReactConstants.TAG;

public class SendNotificationTask extends AsyncTask<Void, Void, Void> {
    private static final long DEFAULT_VIBRATION = 300L;

    private Context mContext;
    private Bundle bundle;
    private SharedPreferences sharedPreferences;
    private Boolean mIsForeground;
    public static int NOTIFICATION_ID = 1;
    private NotificationManager mNotificationManager;
    public static final String CHANNEL_ID = "artwork.chat";

    public SendNotificationTask(Context context, SharedPreferences sharedPreferences, Boolean mIsForeground, Bundle bundle) {
        this.mContext = context;
        this.bundle = bundle;
        this.sharedPreferences = sharedPreferences;
        this.mIsForeground = mIsForeground;
    }

    protected Void doInBackground(Void... params) {
        Log.e("FCM SendNotification", bundle + "");
        try {
            String intentClassName = getMainActivityClassName();
            if (intentClassName == null) {
                return null;
            }


            Resources res = mContext.getResources();
            String packageName = mContext.getPackageName();

            String title = bundle.getString("title");
            if (title == null) {
                ApplicationInfo appInfo = mContext.getApplicationInfo();
                title = mContext.getPackageManager().getApplicationLabel(appInfo).toString();
            }

            NotificationCompat.Builder notifBuilder = new NotificationCompat.Builder(mContext, CHANNEL_ID)
                    .setContentTitle(title)
                    .setContentText(bundle.getString("body"))
                    // .setTicker("ticker text")
                    .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                    .setAutoCancel(true)
                    //.setSubText("sub_text")
                    .setVibrate(new long[]{0, DEFAULT_VIBRATION});

            notifBuilder.setOngoing(false);
            notifBuilder.setPriority(NotificationCompat.PRIORITY_HIGH);

            //icon


            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                notifBuilder.setColor(Color.parseColor("#8C9230"));
                int smallIconResId = res.getIdentifier("ic_notif_white", "mipmap", packageName);

                if (smallIconResId != 0) {
                    notifBuilder.setSmallIcon(smallIconResId);
                }
            } else {
                int smallIconResId = res.getIdentifier("ic_notification", "mipmap", packageName);

                if (smallIconResId != 0) {
                    notifBuilder.setSmallIcon(smallIconResId);
                }
            }

            //large icon
            String largeIcon = "ic_launcher";
            if (largeIcon != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                if (largeIcon.startsWith("http://") || largeIcon.startsWith("https://")) {
                    Bitmap bitmap = getBitmapFromURL(largeIcon);
                    notifBuilder.setLargeIcon(bitmap);
                } else {
                    int largeIconResId = res.getIdentifier(largeIcon, "mipmap", packageName);
                    Bitmap largeIconBitmap = BitmapFactory.decodeResource(res, largeIconResId);

                    if (largeIconResId != 0) {
                        notifBuilder.setLargeIcon(largeIconBitmap);
                    }
                }
            }

            Intent intent;
            PendingIntent pendingIntent;
            intent = new Intent("com.evollu.react.fcm.ReceiveNotification");
            //TODO
            intent.putExtra("message", bundle.getString("message"));
            pendingIntent = PendingIntent.getBroadcast(mContext, 1, intent, PendingIntent.FLAG_UPDATE_CURRENT);
            notifBuilder.setContentIntent(pendingIntent);
            if (mNotificationManager == null) {
                mNotificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel mChannel = mNotificationManager != null ? mNotificationManager.getNotificationChannel(String.valueOf(CHANNEL_ID)) : null;
                if (mChannel == null) {
                    mChannel = new NotificationChannel(String.valueOf(CHANNEL_ID), "chat", NotificationManager.IMPORTANCE_HIGH);
                    mNotificationManager.createNotificationChannel(mChannel);
                }
            }
            mNotificationManager.notify(NOTIFICATION_ID, notifBuilder.build());
            NOTIFICATION_ID++;
            //big text
//            String bigText = bundle.getString("big_text");
//            if (bigText != null) {
//                notification.setStyle(new NotificationCompat.BigTextStyle().bigText(bigText));
//            }


            //if(!mIsForeground || bundle.getBoolean("show_in_foreground")){
//                Intent intent = new Intent();
//                intent.setClassName(mContext, intentClassName);
//                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//                //intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
//                bundle.putString("testkey","testValue");
//                intent.putExtras(bundle);
//                PendingIntent pendingIntent = PendingIntent.getActivity(mContext, (int) (Math.random() * 100), intent,
//                                                                        PendingIntent.FLAG_UPDATE_CURRENT);
////
//                notification.setContentIntent(pendingIntent);

//            Intent i = new Intent("com.evollu.react.fcm.ReceiveNotification");
//            i.putExtra("data", "nodata");
//                PendingIntent intent1 = PendingIntent.getBroadcast(mContext,1, i,
//                        PendingIntent.FLAG_UPDATE_CURRENT);
//            notification.setContentIntent(intent1);


        } catch (Exception e) {
            e.printStackTrace();
            Log.e(TAG, "failed to send local notification", e);
        }
        return null;
    }

    public Bitmap getBitmapFromURL(String strURL) {
        try {
            URL url = new URL(strURL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoInput(true);
            connection.connect();
            InputStream input = connection.getInputStream();
            return BitmapFactory.decodeStream(input);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public String getMainActivityClassName() {
        String packageName = mContext.getPackageName();
        Intent launchIntent = mContext.getPackageManager().getLaunchIntentForPackage(packageName);
        String className = launchIntent.getComponent().getClassName();
        return className;
    }
}

