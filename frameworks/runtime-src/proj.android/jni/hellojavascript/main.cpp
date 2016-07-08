#include "AppDelegate.h"
#include "cocos2d.h"
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#include <android/log.h>

#define  LOG_TAG    "main"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,LOG_TAG,__VA_ARGS__)

using namespace cocos2d;

void cocos_android_app_init (JNIEnv* env) {
    LOGD("cocos_android_app_init");
    AppDelegate *pAppDelegate = new AppDelegate();
}

// Java to C++
extern "C" {
    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockFeatureBatch(JNIEnv* env, jobject thiz, jstring featureRef, jstring featureValue);

    JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockResourceBatch(JNIEnv* env, jobject thiz, jstring resourceRef, jint quantity);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockFeatureBatch(JNIEnv* env, jobject thiz, jstring featureRef, jstring featureValue) {
    const char* featureRefStr = (featureRef != NULL ? env->GetStringUTFChars(featureRef, NULL) : "");
    const char* featureValueStr = (featureValue != NULL ? env->GetStringUTFChars(featureValue, NULL) : "");

    CCLOG("Batch unlocking feature");

    auto director = cocos2d::Director::getInstance();
    director->getEventDispatcher()->dispatchCustomEvent("batch_unlock_feature");

    if(featureRef != NULL)
        env->ReleaseStringUTFChars(featureRef, featureRefStr);

    if(featureValue != NULL)
        env->ReleaseStringUTFChars(featureValue, featureValueStr);
}

JNIEXPORT void JNICALL Java_org_cocos2dx_javascript_AppActivity_unlockResourceBatch(JNIEnv* env, jobject thiz, jstring resourceRef, jint quantity) {
    CCLOG("Mother of god");
}