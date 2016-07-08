/**

Entry point for Numbo Jumbo application.
Sets up SDK integrations.

*/

package org.numbo.jumbo;

import android.app.Application;

import com.batch.android.Batch;
import com.batch.android.Config;
import com.batch.android.PushNotificationType;

import java.util.EnumSet;

public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        Batch.Push.setGCMSenderId("300986093452");

        // TODO : switch to live Batch Api Key before shipping
        Batch.setConfig(new Config("DEV5772A8771CB92F9DEEA90BBDF5C")); // devloppement
        // Batch.setConfig(new Config("5772A8771ADE834DC72CC6DD27E3C8")); // live

        updateNotificationSettings();
    }

    private void updateNotificationSettings() {
        EnumSet<PushNotificationType> pushNotificationTypes = EnumSet.allOf(PushNotificationType.class);
        pushNotificationTypes.remove(PushNotificationType.ALERT);

        Batch.Push.setNotificationsType(pushNotificationTypes);
    }
}