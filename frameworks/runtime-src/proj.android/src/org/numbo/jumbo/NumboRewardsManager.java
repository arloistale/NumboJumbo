/**

NumboRewardsManager is a module that handles showing reward videos in the game.
This is where the monetization happens.

*/

package org.numbo.jumbo;

import android.util.Log;

import com.supersonic.mediationsdk.logger.SupersonicError;

import com.supersonic.mediationsdk.model.Placement;
import com.supersonic.mediationsdk.sdk.RewardedVideoListener;

public class NumboRewardsManager implements RewardedVideoListener {

    // region Constants


    private final static String TAG = "Rewards";


    // endregion

    // region Data


    private boolean isVideoAvailable;


    // endregion

    // region Native Bridge


    // Java to C++
    public static native void alertVideoAvailability(boolean available);
    public static native void rewardForVideoAd(String rewardName, int rewardAmount);


    // endregion

    // region Initialization


    // Successful rewards initialization callback.
    @Override
    public void onRewardedVideoInitSuccess() {
    }

    // Failed rewards initialization callback.
    @Override
    public void onRewardedVideoInitFail(SupersonicError se) {

        // Retrieve details from a SupersonicError object.
        int errorCode =  se.getErrorCode();
        String errorMessage = se.getErrorMessage();
        Log.e(TAG, "Unable to init rewards: " + errorMessage);
    }

    // Invoked when there is a change in the ad availability status.
    // @param - available - value will change to true when rewarded videos are available.
    // You can then show the video by calling showRewardedVideo().
    // Value will change to false when no videos are available.
    @Override
    public void onVideoAvailabilityChanged(boolean available) {
        // tell the game about video availability
        alertVideoAvailability(available);

        isVideoAvailable = available;
    }


    // endregion

    // region Video Ad Lifecycle


    // Invoked when RewardedVideo call to show a rewarded video has failed.
    @Override
    public void onRewardedVideoShowFail(SupersonicError se) {
    }

    // Invoked when the RewardedVideo ad view has opened.
    // Your Activity will lose focus. Please avoid performing heavy
    // tasks till the video ad will be closed.
    @Override
    public void onRewardedVideoAdOpened() {
    }

    //Invoked when the RewardedVideo ad view is about to be closed.
    //Your activity will now regain its focus.
    @Override
    public void onRewardedVideoAdClosed() {
    }

    //Invoked when the video ad starts playing.
    @Override
    public void onVideoStart() {
    }

    //Invoked when the video ad finishes playing.
    @Override
    public void onVideoEnd() {
    }

    //Invoked when the user completed the video and should be rewarded.
    //If using server-to-server callbacks you may ignore this events and wait for
    //the callback from the Supersonic server.
    //@param - placement - the Placement the user completed a video from.
    @Override
    public void onRewardedVideoAdRewarded(Placement placement) {

        String rewardName = placement.getRewardName();
        int rewardAmount = placement.getRewardAmount();

        rewardForVideoAd(rewardName, rewardAmount);
    }


    // endregion

    // region Accessors


    public boolean isVideoAvailable() {
        return isVideoAvailable;
    }


    // endregion
}