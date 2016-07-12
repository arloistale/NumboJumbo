#include "CampaignManager.h"
#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>

void cocos_android_app_init (JNIEnv* env) {
    AppDelegate *pAppDelegate = new AppDelegate();
}

// Java to C++
extern "C" {
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_prepareCampaignDetails(JNIEnv* env, jobject thiz, jstring campaignName, jstring campaignMessage);

    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockFeatureBatch(JNIEnv* env, jobject thiz, jstring featureRef, jstring featureValue);

    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockResourceBatch(JNIEnv* env, jobject thiz, jstring resourceRef, jint quantity);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_prepareCampaignDetails(JNIEnv* env, jobject thiz, jstring campaignName, jstring campaignMessage) {
    const char* campaignNameUTF = env->GetStringUTFChars(campaignName, NULL);
    const char* campaignMessageUTF = env->GetStringUTFChars(campaignMessage, NULL);

    if(campaignNameUTF) {
        if(campaignMessageUTF) {
            const std::string campaignNameStr = std::string(campaignNameUTF);
            const std::string campaignMessageStr = std::string(campaignMessageUTF);

            CampaignManager::prepareCampaignDetails(campaignNameStr, campaignMessageStr);

            env->ReleaseStringUTFChars(campaignMessage, campaignMessageUTF);
        } else {
            CCLOG("Campaign message prepared without a message!");
        }

        env->ReleaseStringUTFChars(campaignName, campaignNameUTF);
    } else {
        CCLOG("Campaign details prepared without a name!");
    }
}

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockFeatureBatch(JNIEnv* env, jobject thiz, jstring featureRef, jstring featureValue) {
    const char* featureRefUTF = env->GetStringUTFChars(featureRef, NULL);

    if(featureRefUTF) {
        const std::string featureRefStr = std::string(featureRefUTF);
        
        if(featureRefStr == "BUBBLE_DOUBLER")
            CampaignManager::unlockFeature(CampaignManager::KEY_DOUBLER);
        else if(featureRefStr == "THEME") {
            const char* featureValueUTF = env->GetStringUTFChars(featureValue, NULL);

            if(featureValueUTF) {
                const std::string featureValueStr = std::string(featureValueUTF);

                CampaignManager::unlockFeature(CampaignManager::KEY_THEME, featureValueStr);

                env->ReleaseStringUTFChars(featureValue, featureValueUTF);
            } else {
                CCLOG("Tried to unlock Theme Feature from Batch without value!");
            }
        }

        env->ReleaseStringUTFChars(featureRef, featureRefUTF);
    } else {
        CCLOG("Invalid feature was referenced from Batch!");
    }
}

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockResourceBatch(JNIEnv* env, jobject thiz, jstring resourceRef, jint quantity) {
    const char* resourceRefUTF = env->GetStringUTFChars(resourceRef, NULL);

    if(resourceRefUTF) {
        const std::string resourceRefStr = std::string(resourceRefUTF);

        if(resourceRefStr == "CONVERTERS") {
            CampaignManager::unlockResource(CampaignManager::KEY_CONVERTERS, quantity);
        } else if(resourceRefStr == "HINTS")
            CampaignManager::unlockResource(CampaignManager::KEY_HINTS, quantity);
        else if(resourceRefStr == "SCRAMBLERS") {
            CampaignManager::unlockResource(CampaignManager::KEY_SCRAMBLERS, quantity);
        }

        env->ReleaseStringUTFChars(resourceRef, resourceRefUTF);
    } else {
        CCLOG("Invalid resource was referenced from Batch!");
    }
}