/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2014 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import android.os.Bundle;
import android.net.Uri;
import android.content.Intent;
import android.util.Log;
import android.content.Context;

import java.io.IOException;

import java.util.Map;
import java.util.Locale;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import com.batch.android.Batch;
import com.batch.android.BatchUnlockListener;
import com.batch.android.Offer;
import com.batch.android.Feature;
import com.batch.android.Resource;

import com.supersonic.mediationsdk.integration.IntegrationHelper;

import com.supersonic.mediationsdk.sdk.Supersonic;
import com.supersonic.mediationsdk.sdk.SupersonicFactory;

import com.supersonic.mediationsdk.logger.SupersonicLogger;
import com.supersonic.mediationsdk.logger.LogListener;
import com.supersonic.mediationsdk.logger.SupersonicError;

import org.numbo.jumbo.MainApplication;
import org.numbo.jumbo.NumboRewardsManager;

import com.google.android.gms.common.GooglePlayServicesNotAvailableException;
import com.google.android.gms.common.GooglePlayServicesRepairableException;
import com.google.android.gms.ads.identifier.AdvertisingIdClient;

public class AppActivity extends Cocos2dxActivity {


    // region Constants


    private static final String SUPERSONIC_TAG = "Supersonic";
    private static final String SHARE_TAG = "Share";
    private static final String BATCH_TAG = "Batch";

    private static final String SUPERSONIC_APP_KEY = "5134c84d";

    private static final String SUPERSONIC_PLACEMENT_NAME = "DefaultRewardedVideo";


    // endregion

    // region Data


    private static Context mContext;

    private static Supersonic mMediationAgent;
    private static NumboRewardsManager mRewardsManager;


    // endregion

    // region Native bridge


    // Java to C++
    public static native void prepareCampaignDetails(String campaignName, String campaignMessage);
    public static native void unlockFeatureBatch(String featureRef, String featureValue);
    public static native void unlockResourceBatch(String resourceRef, int quantity);

    // C++ to Java
    public static void shareScreen(final String outputFile) {
        Uri uri = Uri.parse("file://" + outputFile);

        Intent shareIntent = new Intent();
        shareIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        shareIntent.setAction(Intent.ACTION_SEND);
        shareIntent.putExtra(Intent.EXTRA_TEXT, "Check out my score in Numbo Jumbo! http://numbojumbo.com");
        shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
        shareIntent.setType("image/png");
        mContext.startActivity(Intent.createChooser(shareIntent, "Sharing Score"));
    }

    // upon successfully showing the video NumboRewardsManager will alert the native function rewardForVideoAd
    public static void showRewardVideo() {
        if(!mRewardsManager.isVideoAvailable()) {
            Log.e(SUPERSONIC_TAG, "Tried to show video when unavailable!");
            return;
        }

        mMediationAgent.showRewardedVideo(SUPERSONIC_PLACEMENT_NAME);
    }


    // endregion

    // region Event Overrides


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mContext = this;

        // init rewarded videos
        mMediationAgent = SupersonicFactory.getInstance();

        mRewardsManager = new NumboRewardsManager();
        mRewardsManager.initWithContext(this);

        // start the background thread that will get the goog advertising id
        Thread idThread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Context ctx = AppActivity.this.getApplicationContext();
                    AdvertisingIdClient.Info adInfo = AdvertisingIdClient.getAdvertisingIdInfo(ctx);
                    finished(adInfo);
                } catch (GooglePlayServicesNotAvailableException e) {
                    e.printStackTrace();
                } catch (GooglePlayServicesRepairableException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        });

        idThread.start();
    }

    @Override
    protected void onStart() {
        super.onStart();

        Batch.Unlock.setUnlockListener(new BatchUnlockListener() {
            @Override
            public void onRedeemAutomaticOffer(Offer offer) {

                String offerReference = offer.getOfferReference();

                Log.i(BATCH_TAG, "Redeeming automatic offer: " + offerReference);

                Map<String, String> additionalParameters = offer.getOfferAdditionalParameters();

                if(additionalParameters.containsKey("reward_name") && additionalParameters.containsKey("reward_message")) {
                    prepareCampaignDetails(additionalParameters.get("reward_name"), additionalParameters.get("reward_message"));
                }

                for(Feature feature : offer.getFeatures()) {
                    String featureRef = feature.getReference();
                    String value = feature.getValue();

                    Log.i(BATCH_TAG, "Feature = " + featureRef + " : " + value);

                    unlockFeatureBatch(featureRef, value);
                }

                for(Resource resource : offer.getResources()) {
                    String resourceRef = resource.getReference();
                    int quantity = resource.getQuantity();

                    Log.i(BATCH_TAG, "Resource = " + resourceRef + " : " + quantity);

                    unlockResourceBatch(resourceRef, quantity);
                }
            }
        });

        Batch.onStart(this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mMediationAgent != null) {
            mMediationAgent.onResume (this);
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mMediationAgent != null) {
            mMediationAgent.onPause(this);
        }
    }

    @Override
    protected void onStop() {
        Batch.onStop(this);

        super.onStop();
    }

    @Override
    protected void onDestroy() {
        Batch.onDestroy(this);

        super.onDestroy();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        Batch.onNewIntent(this, intent);

        super.onNewIntent(intent);
    }
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }


    // endregion

    // region Supersonic


    private void finished(final AdvertisingIdClient.Info adInfo) {
        if(adInfo != null) {
            // In case you need to use adInfo in UI thread
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    // when we are done we initialize the reward videos with the advertising id
                    mMediationAgent.setRewardedVideoListener(mRewardsManager);

                    //Init Rewarded Video
                    mMediationAgent.initRewardedVideo(AppActivity.this, SUPERSONIC_APP_KEY, adInfo.getId());

                    IntegrationHelper.validateIntegration(AppActivity.this);

                    Log.i(SUPERSONIC_TAG, "Init reward video with user id: " + adInfo.getId());
                }
            });
        }
    }


    // endregion
}
