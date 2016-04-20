#include "PluginReviewJSHelper.h"
#include "cocos2d_specifics.hpp"
#include "PluginReview/PluginReview.h"
#include "SDKBoxJSHelper.h"

extern JSObject* jsb_sdkbox_PluginReview_prototype;
static JSContext* s_cx = nullptr;

class ReviewListenerJS : public sdkbox::ReviewListener {
private:
    JSObject* _JSDelegate;
public:
    void setJSDelegate(JSObject* delegate) {
        _JSDelegate = delegate;
    }

    JSObject* getJSDelegate() {
        return _JSDelegate;
    }

    void onDisplayAlert() {
        invokeDelegate("onDisplayAlert", nullptr, 0, 0);
    }

    void onDeclineToRate() {
        invokeDelegate("onDeclineToRate", nullptr, 0, 0);
    }

    void onRate() {
        invokeDelegate("onRate", nullptr, 0, 0);
    }

    void onRemindLater() {
        invokeDelegate("onRemindLater", nullptr, 0, 0);
    }

private:
    void invokeDelegate(const char* fName, const char* name, int intVal, int argc) {
        if (!s_cx) {
            return;
        }
        JSContext* cx = s_cx;
        const char* func_name = fName;

        JS::RootedObject obj(cx, _JSDelegate);
        JSAutoCompartment ac(cx, obj);

#if defined(MOZJS_MAJOR_VERSION)
#if MOZJS_MAJOR_VERSION >= 33
        bool hasAction;
        JS::RootedValue retval(cx);
        JS::RootedValue func_handle(cx);
#else
        bool hasAction;
        jsval retval;
        JS::RootedValue func_handle(cx);
#endif
#elif defined(JS_VERSION)
        JSBool hasAction;
        jsval retval;
        jsval func_handle;
#endif
        jsval dataVal[2];

        if (2 == argc) {
            dataVal[0] = c_string_to_jsval(cx, name);
            dataVal[1] = INT_TO_JSVAL(intVal);
        } else if (1 == argc) {
            dataVal[0] = c_string_to_jsval(cx, name);
        }

        if (JS_HasProperty(cx, obj, func_name, &hasAction) && hasAction) {
            if(!JS_GetProperty(cx, obj, func_name, &func_handle)) {
                return;
            }
            if(func_handle == JSVAL_VOID) {
                return;
            }

#if MOZJS_MAJOR_VERSION >= 31
            if (0 == argc) {
                JS_CallFunctionName(cx, obj, func_name, JS::HandleValueArray::empty(), &retval);
            } else {
                JS_CallFunctionName(cx, obj, func_name, JS::HandleValueArray::fromMarkedLocation(argc, dataVal), &retval);
            }
#else
            if (0 == argc) {
                JS_CallFunctionName(cx, obj, func_name, 0, nullptr, &retval);
            } else {
                JS_CallFunctionName(cx, obj, func_name, argc, dataVal, &retval);
            }
#endif
        }
    }

};

#if defined(MOZJS_MAJOR_VERSION)
#if MOZJS_MAJOR_VERSION >= 33
bool js_PluginReviewJS_PluginReview_setListener(JSContext *cx, uint32_t argc, jsval *vp)
#else
bool js_PluginReviewJS_PluginReview_setListener(JSContext *cx, uint32_t argc, jsval *vp)
#endif
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setListener(JSContext *cx, uint32_t argc, jsval *vp)
#endif
{
    s_cx = cx;
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;

    if (argc == 1) {

        if (!args.get(0).isObject())
        {
            ok = false;
        }
        JSObject *tmpObj = args.get(0).toObjectOrNull();

        JSB_PRECONDITION2(ok, cx, false, "js_PluginReviewJS_PluginReview_setIAPListener : Error processing arguments");
        ReviewListenerJS* wrapper = new ReviewListenerJS();
        wrapper->setJSDelegate(tmpObj);
        sdkbox::PluginReview::setListener(wrapper);

        args.rval().setUndefined();
        return true;
    }
    JS_ReportError(cx, "js_PluginReviewJS_PluginReview_setIAPListener : wrong number of arguments");
    return false;
}


#if defined(MOZJS_MAJOR_VERSION)
#if MOZJS_MAJOR_VERSION >= 33
void register_all_PluginReviewJS_helper(JSContext* cx, JS::HandleObject global) {
    JS::RootedObject pluginObj(cx);
    sdkbox::getJsObjOrCreat(cx, global, "sdkbox.PluginReview", &pluginObj);

    JS_DefineFunction(cx, pluginObj, "setListener", js_PluginReviewJS_PluginReview_setListener, 1, JSPROP_READONLY | JSPROP_PERMANENT);
}
#else
void register_all_PluginReviewJS_helper(JSContext* cx, JSObject* global) {
    JS::RootedObject pluginObj(cx);
    sdkbox::getJsObjOrCreat(cx, JS::RootedObject(cx, global), "sdkbox.PluginReview", &pluginObj);

    JS_DefineFunction(cx, pluginObj, "setListener", js_PluginReviewJS_PluginReview_setListener, 1, JSPROP_READONLY | JSPROP_PERMANENT);
}
#endif
#elif defined(JS_VERSION)
void register_all_PluginReviewJS_helper(JSContext* cx, JSObject* global) {
    jsval pluginVal;
    JSObject* pluginObj;
    pluginVal = sdkbox::getJsObjOrCreat(cx, global, "sdkbox.PluginReview", &pluginObj);

    JS_DefineFunction(cx, pluginObj, "setListener", js_PluginReviewJS_PluginReview_setListener, 1, JSPROP_READONLY | JSPROP_PERMANENT);
}
#endif
