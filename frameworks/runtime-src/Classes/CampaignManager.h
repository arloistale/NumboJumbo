//
//  CampaignManager.h
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/12/16.
//
//

#ifndef CampaignManager_h
#define CampaignManager_h

#include <string>

// This class handles everything related to promotions.
// This includes promo codes, campaigns, and video ads.
class CampaignManager {
public:
    static const std::string KEY_DOUBLER;
    static const std::string KEY_THEME;
    
    static const std::string KEY_CONVERTERS;
    static const std::string KEY_HINTS;
    static const std::string KEY_SCRAMBLERS;
    
    // MARK: Promo Functionality
    
    
    // Put details about the current promo campaign in local storage to be used later
    static void prepareCampaignDetails(const std::string& name, const std::string& message);
    
    // Unlocks a permanently unlocked feature with an optional value
    static void unlockFeature(const std::string& key, const std::string& value);
    
    // Unlocks permanently unlocked feature
    static void unlockFeature(const std::string& key);
    
    // Unlocks a one time resource (such as an in game theme)
    static void unlockResource(const std::string& key, const int value);
    
    
    // MARK: Reward Functionality
    
    
    // show an ad to the user, will call back to rewardForVideoAd once finished
    static void showRewardVideo();
    
    // alerts whether a video is available to user
    static void alertVideoAvailability(const bool available);
    
    // To be used to call back to the game once a reward video ad has finished playing
    static void rewardForVideoAd();
};


#endif /* CampaignManager_h */
