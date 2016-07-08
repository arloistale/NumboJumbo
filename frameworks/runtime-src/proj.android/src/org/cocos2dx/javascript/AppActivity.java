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

import android.net.Uri;
import android.content.Intent;
import android.util.Log;
import android.content.Context;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import com.batch.android.Batch;
import com.batch.android.BatchUnlockListener;
import com.batch.android.Offer;
import com.batch.android.Feature;
import com.batch.android.Resource;

import org.numbo.jumbo.MainApplication;

public class AppActivity extends Cocos2dxActivity {

    // Constants
    private static final String SHARE_TAG = "Share";
    private static final String BATCH_TAG = "Batch";

    private static Context mContext;

    // Native bridge

    // Java to C++
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

    // Event Overrides

    @Override
    protected void onStart() {
        super.onStart();

        mContext = this;

        Batch.Unlock.setUnlockListener(new BatchUnlockListener() {
            @Override
            public void onRedeemAutomaticOffer(Offer offer) {

                Log.i(BATCH_TAG, "Redeeming automatic offer");

                String offerReference = offer.getOfferReference();

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
    protected void onStop()
    {
        Batch.onStop(this);

        super.onStop();
    }

    @Override
    protected void onDestroy()
    {
        Batch.onDestroy(this);

        super.onDestroy();
    }

    @Override
    protected void onNewIntent(Intent intent)
    {
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
}
