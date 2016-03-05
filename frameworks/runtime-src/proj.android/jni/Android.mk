LOCAL_PATH := $(call \
my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

LOCAL_SRC_FILES := hellojavascript/main.cpp \
../../Classes/AppDelegate.cpp \
../../Classes/PluginGoogleAnalyticsJS.cpp \
../../Classes/PluginGoogleAnalyticsJS.hpp \
../../Classes/SDKBoxJSHelper.cpp \
../../Classes/SDKBoxJSHelper.h \
../../Classes/PluginFacebookJS.cpp \
../../Classes/PluginFacebookJS.hpp \
../../Classes/PluginFacebookJSHelper.cpp \
../../Classes/PluginFacebookJSHelper.h

LOCAL_CPPFLAGS := -DSDKBOX_ENABLED
LOCAL_LDLIBS := -landroid \
-llog
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes
LOCAL_WHOLE_STATIC_LIBRARIES := PluginGoogleAnalytics \
sdkbox \
PluginFacebook

LOCAL_STATIC_LIBRARIES := cocos_jsb_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 \
-DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)
$(call import-add-path,$(LOCAL_PATH))


$(call import-module,bindings)
$(call import-module, ./sdkbox)
$(call import-module, ./plugingoogleanalytics)
$(call import-module, ./pluginfacebook)
