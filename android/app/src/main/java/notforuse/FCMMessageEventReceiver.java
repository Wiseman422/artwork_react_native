package notforuse;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.List;

/**
 * Set alarms for scheduled notification after system reboot.
 */
public class FCMMessageEventReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("FCMMessageEventReceiver", "FCMMessageEventReceiver");
        if (!isForeground(context)) {
            Log.e("Not in foreground>>", "FCMMessageEventReceiver");
            Intent i = new Intent();
            i.putExtra("user_id",intent.getStringExtra("user_id"));
            i.putExtra("noti_type",intent.getStringExtra("noti_type"));
            i.setClassName(context, getMainActivityClassName(context));
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }


    }



    public String getMainActivityClassName(Context mContext) {
        String packageName = mContext.getPackageName();
        Intent launchIntent = mContext.getPackageManager().getLaunchIntentForPackage(packageName);
        String className = launchIntent.getComponent().getClassName();
        return className;
    }

    public boolean isForeground(Context context) {

        ActivityManager manager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningTaskInfo> runningTaskInfo = manager.getRunningTasks(1);
        ComponentName componentInfo = runningTaskInfo.get(0).topActivity;
        return componentInfo.getPackageName().equals(context.getPackageName());
    }


}