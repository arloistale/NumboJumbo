#import "CampaignBridge.h"

#import "CampaignManager.h"

@implementation CampaignBridge

+ (void)prepareCampaignDetails:(const char *)campaignName withMessage:(const char *)campaignMessage {
    
    if(!campaignName || !campaignMessage) {
        NSLog(@"Prepared campaign details without the actual details!");
        return;
    }
    
    const std::string campaignNameStr = std::string(campaignName);
    const std::string campaignMessageStr = std::string(campaignMessage);
    
    CampaignManager::prepareCampaignDetails(campaignName, campaignMessage);
}

+ (void)unlockFeatureBatch:(const char *)reference withValue:(const char *)value {
    
    if(!reference) {
        NSLog(@"No reference provided for unlocking Batch feature");
        return;
    }
    
    const std::string referenceStr = std::string(reference);
    
    if(referenceStr == "BUBBLE_DOUBLER")
        CampaignManager::unlockFeature(CampaignManager::KEY_DOUBLER);
    else if(referenceStr == "THEME") {
        if(value) {
            const std::string valueStr = std::string(value);
            
            CampaignManager::unlockFeature(CampaignManager::KEY_THEME, valueStr);
        } else {
            NSLog(@"Tried to unlock Theme Feature from Batch without value!");
        }
    }
}

+ (void)unlockResourceBatch:(const char *)reference withQuantity:(const int)quantity {
    
    if(!reference) {
        NSLog(@"No reference provided for unlocking Batch resource");
        return;
    }
    
    const std::string referenceStr = std::string(reference);
    
    if(referenceStr == "CONVERTERS") {
        CampaignManager::unlockResource(CampaignManager::KEY_CONVERTERS, quantity);
    } else if(referenceStr == "HINTS")
        CampaignManager::unlockResource(CampaignManager::KEY_HINTS, quantity);
    else if(referenceStr == "SCRAMBLERS") {
        CampaignManager::unlockResource(CampaignManager::KEY_SCRAMBLERS, quantity);
    }
}

@end