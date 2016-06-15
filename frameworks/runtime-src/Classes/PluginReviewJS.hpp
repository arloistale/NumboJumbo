#ifndef __PluginReviewJS_h__
#define __PluginReviewJS_h__

#include "jsapi.h"
#include "jsfriendapi.h"


extern JSClass  *jsb_sdkbox_PluginReview_class;
extern JSObject *jsb_sdkbox_PluginReview_prototype;

#if MOZJS_MAJOR_VERSION >= 33
void js_register_PluginReviewJS_PluginReview(JSContext *cx, JS::HandleObject global);
void register_all_PluginReviewJS(JSContext* cx, JS::HandleObject obj);
#else
void js_register_PluginReviewJS_PluginReview(JSContext *cx, JSObject* global);
void register_all_PluginReviewJS(JSContext* cx, JSObject* obj);
#endif

bool js_PluginReviewJS_PluginReview_constructor(JSContext *cx, uint32_t argc, jsval *vp);
void js_PluginReviewJS_PluginReview_finalize(JSContext *cx, JSObject *obj);
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_userDidSignificantEvent(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_userDidSignificantEvent(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_setRateButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setRateButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_show(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_show(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_setTitle(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setTitle(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_rate(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_rate(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_init(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_init(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_setRateLaterButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setRateLaterButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_setMessage(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setMessage(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#if defined(MOZJS_MAJOR_VERSION)
bool js_PluginReviewJS_PluginReview_setCancelButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#elif defined(JS_VERSION)
JSBool js_PluginReviewJS_PluginReview_setCancelButtonTitle(JSContext *cx, uint32_t argc, jsval *vp);
#endif
#endif

