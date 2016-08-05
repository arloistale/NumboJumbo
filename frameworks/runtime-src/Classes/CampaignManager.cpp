//
//  CampaignManager.cpp
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/12/16.
//
//

#include "CampaignManager.h"

#include "storage/local-storage/LocalStorage.h"
#include "cocos2d.h"

#include "RewardBridge.h"

USING_NS_CC;

const std::string CampaignManager::KEY_DOUBLER = "DOUBLER";
const std::string CampaignManager::KEY_THEME = "THEME";

const std::string CampaignManager::KEY_CONVERTERS = "CONVERTERS";
const std::string CampaignManager::KEY_HINTS = "HINTS";
const std::string CampaignManager::KEY_SCRAMBLERS = "SCRAMBLERS";

void CampaignManager::prepareCampaignDetails(const std::string& name, const std::string& message) {
    CCLOG("Preparing campaign details > %s : %s", name.c_str(), message.c_str());
    
    localStorageSetItem("campaignName", name);
    localStorageSetItem("campaignMessage", message);
}

void CampaignManager::unlockFeature(const std::string& key, const std::string& value) {
    CCLOG("Unlocking feature %s : %s", key.c_str(), value.c_str());
    
    if(key == KEY_DOUBLER) {
        localStorageSetItem("isDoublerEnabled", "true");
    } else if(key == KEY_THEME) {
        localStorageSetItem("themesPurchased_" + value, "true");
    } else {
        CCLOG("Invalid key used for unlocking feature");
        return;
    }
}

void CampaignManager::unlockFeature(const std::string& key) {
    CampaignManager::unlockFeature(key, "");
}

void CampaignManager::unlockResource(const std::string &key, int amount) {
    CCLOG("Unlocking resource %s : %d", key.c_str(), amount);
    
    std::string convertedKey = "";
    
    if(key == KEY_CONVERTERS) {
        convertedKey = "converters";
    } else if(key == KEY_HINTS) {
        convertedKey = "hints";
    } else if(key == KEY_SCRAMBLERS) {
        convertedKey = "scramblers";
    } else {
        CCLOG("Invalid key used for unlocking resource");
        return;
    }
    
    int newAmount = amount;
    
    std::string result;
    if(localStorageGetItem(convertedKey, &result)) {
        int resultInt;
        std::istringstream convert(result);
        if(convert >> resultInt) {
            newAmount += resultInt;
        }
    }
    
    // fix for this GCC version
    std::ostringstream itos;
    itos << newAmount;
    localStorageSetItem(convertedKey, itos.str());
}

void CampaignManager::showRewardVideo() {
    
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    cocos2d::JniMethodInfo methodInfo;
    
    if (!cocos2d::JniHelper::getStaticMethodInfo(methodInfo, "org/cocos2dx/javascript/AppActivity", "showRewardVideo", "()V")) {
        return;
    }
    
    methodInfo.env->CallStaticVoidMethod(methodInfo.classID, methodInfo.methodID);
    methodInfo.env->DeleteLocalRef(methodInfo.classID);
#elif (CC_TARGET_PLATFORM == CC_PLATFORM_IOS)
    requestRewardVideo();
#endif
}

void CampaignManager::alertVideoAvailability(const bool available) {
    auto eventDispatcher = Director::getInstance()->getEventDispatcher();
    
    if(available)
        eventDispatcher->dispatchCustomEvent("alertVideoAvailable");
    else
        eventDispatcher->dispatchCustomEvent("alertVideoUnavailable");
}

void CampaignManager::rewardForVideoAd() {
    Director::getInstance()->getEventDispatcher()->dispatchCustomEvent("rewardForVideoAd");
}