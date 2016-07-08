#include "AppDelegate.h"

#include "audio/include/AudioEngine.h"

#include "scripting/js-bindings/auto/jsb_cocos2dx_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_extension_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_navmesh_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_ui_auto.hpp"
#include "scripting/js-bindings/manual/cocosbuilder/js_bindings_ccbreader.h"
#include "scripting/js-bindings/manual/extension/jsb_cocos2dx_extension_manual.h"
#include "scripting/js-bindings/manual/jsb_opengl_registration.h"
#include "scripting/js-bindings/manual/localstorage/js_bindings_system_registration.h"
#include "scripting/js-bindings/manual/navmesh/jsb_cocos2dx_navmesh_manual.h"
#include "scripting/js-bindings/manual/network/XMLHTTPRequest.h"
#include "scripting/js-bindings/manual/ui/jsb_cocos2dx_ui_manual.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_video_auto.hpp"
#include "scripting/js-bindings/auto/jsb_cocos2dx_experimental_webView_auto.hpp"
#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_video_manual.h"
#include "scripting/js-bindings/manual/experimental/jsb_cocos2dx_experimental_webView_manual.h"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
#include "scripting/js-bindings/auto/jsb_cocos2dx_audioengine_auto.hpp"
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "cocos/scripting/js-bindings/manual/platform/android/CCJavascriptJavaBridge.h"
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
#include "cocos/scripting/js-bindings/manual/platform/ios/JavaScriptObjCBridge.h"
#endif

#ifdef SDKBOX_ENABLED

#include "PluginIAPJS.hpp"
#include "PluginIAPJSHelper.h"

#include "PluginSdkboxPlayJS.hpp"
#include "PluginSdkboxPlayJSHelper.h"

#include "PluginGoogleAnalyticsJS.hpp"

#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/jni/JniHelper.h"
#include <jni.h>
#endif

// iOS Objective C Bridge
#include "SharingBridge.h"

USING_NS_CC;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    ScriptEngineManager::destroyInstance();
}

void AppDelegate::initGLContextAttrs()
{
    GLContextAttrs glContextAttrs = {8, 8, 8, 8, 24, 8};

    GLView::setGLContextAttrs(glContextAttrs);
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    auto director = Director::getInstance();
    auto glview = director->getOpenGLView();
    if(!glview) {
#if(CC_TARGET_PLATFORM == CC_PLATFORM_WP8) || (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT)
        glview = cocos2d::GLViewImpl::create("NumboJumbo");
#else
        glview = cocos2d::GLViewImpl::createWithRect("NumboJumbo", Rect(0,0,960,640));
#endif
        director->setOpenGLView(glview);
}

    // set FPS. the default value is 1.0/60 if you don't call this
    director->setAnimationInterval(1.0 / 60);

    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_cocos2dx_js_core);
    sc->addRegisterCallback(jsb_register_system);

    // extension can be commented out to reduce the package
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    
    // opengl can be commented out to reduce the package
    //sc->addRegisterCallback(JSB_register_opengl);

    // ui can be commented out to reduce the package, attension studio need ui module
    sc->addRegisterCallback(register_all_cocos2dx_ui);
    sc->addRegisterCallback(register_all_cocos2dx_ui_manual);

    // XmlHttpRequest can be commented out to reduce the package
    //sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
    // websocket can be commented out to reduce the package
    //sc->addRegisterCallback(register_jsb_websocket);
    // sokcet io can be commented out to reduce the package
    //sc->addRegisterCallback(register_jsb_socketio);

#if CC_USE_NAVMESH
    sc->addRegisterCallback(register_all_cocos2dx_navmesh);
    sc->addRegisterCallback(register_all_cocos2dx_navmesh_manual);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    sc->addRegisterCallback(register_all_cocos2dx_experimental_video);
    sc->addRegisterCallback(register_all_cocos2dx_experimental_video_manual);
    sc->addRegisterCallback(register_all_cocos2dx_experimental_webView);
    sc->addRegisterCallback(register_all_cocos2dx_experimental_webView_manual);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT || CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID || CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC || CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)
    sc->addRegisterCallback(register_all_cocos2dx_audioengine);
#endif

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    sc->addRegisterCallback(JavascriptJavaBridge::_js_register);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS || CC_TARGET_PLATFORM == CC_PLATFORM_MAC)
    sc->addRegisterCallback(JavaScriptObjCBridge::_js_register);
#endif
#ifdef SDKBOX_ENABLED
    sc->addRegisterCallback(register_all_PluginIAPJS);
    sc->addRegisterCallback(register_all_PluginIAPJS_helper);

    sc->addRegisterCallback(register_all_PluginSdkboxPlayJS);
    sc->addRegisterCallback(register_all_PluginSdkboxPlayJS_helper);
    sc->addRegisterCallback(register_all_PluginGoogleAnalyticsJS);
#endif
    sc->start();
    sc->runScript("script/jsb_boot.js");
#if defined(COCOS2D_DEBUG) && (COCOS2D_DEBUG > 0)
    sc->enableDebugger();
#endif
    ScriptEngineProtocol *engine = ScriptingCore::getInstance();
    ScriptEngineManager::getInstance()->setScriptEngine(engine);
    ScriptingCore::getInstance()->runScript("main.js");

    // For Screen Sharing

    director->getEventDispatcher()->addEventListenerWithFixedPriority(EventListenerCustom::create("share_screen", [=](EventCustom* event) {

        cocos2d::utils::captureScreen(CC_CALLBACK_2(AppDelegate::shareScreenCallback, this), "epilogue.png");

    }), 9001);

    return true;
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    auto director = Director::getInstance();
    director->stopAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_hide");
    cocos2d::experimental::AudioEngine::pauseAll();
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    auto director = Director::getInstance();
    director->startAnimation();
    director->getEventDispatcher()->dispatchCustomEvent("game_on_show");
    cocos2d::experimental::AudioEngine::resumeAll();
}

void AppDelegate::shareScreenCallback(bool succeed, const std::string& outputFile) {
    if(!succeed) {
        CCLOG("Capturing screen failed!");
        return;
    }
    
    const char* outputFileChars = outputFile.c_str();
    const char* message = "Check out my score in Numbo Jumbo! http://numbojumbo.com";

    CCLOG("Capturing screenshot to: %s", outputFileChars);

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    cocos2d::JniMethodInfo methodInfo;

    if (!cocos2d::JniHelper::getStaticMethodInfo(methodInfo, "org/cocos2dx/javascript/AppActivity", "shareScreen", "(Ljava/lang/String;)V")) {
        return;
    }

    jstring outputFileArg = methodInfo.env->NewStringUTF(outputFileChars);

    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID, outputFileArg);
    methodInfo.env->DeleteLocalRef(methodInfo.classID);
    methodInfo.env->DeleteLocalRef(outputFileArg);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    shareTextWithImage(outputFileChars, message);
#endif

}