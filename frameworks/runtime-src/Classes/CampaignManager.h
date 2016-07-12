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

class CampaignManager {
public:
    static const std::string KEY_DOUBLER;
    static const std::string KEY_THEME;
    
    static const std::string KEY_CONVERTERS;
    static const std::string KEY_HINTS;
    static const std::string KEY_SCRAMBLERS;
    
    static void prepareCampaignDetails(const std::string& name, const std::string& message);
    
    // Unlocks a permanently unlocked feature with an optional value
    static void unlockFeature(const std::string& key, const std::string& value);
    
    // Unlocks permanently unlocked feature
    static void unlockFeature(const std::string& key);
    
    // Unlocks a one time resource (such as an in game theme)
    static void unlockResource(const std::string& key, int value);
};


#endif /* CampaignManager_h */
