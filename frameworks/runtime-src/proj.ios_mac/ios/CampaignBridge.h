//
//  SharingBridge.h
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/7/16.
//
//

#ifndef CBridge_h
#define CBridge_h

@interface CampaignBridge : NSObject

// promo

+ (void)prepareCampaignDetails:(const char *)campaignName withMessage:(const char *)campaignMessage;

+ (void)unlockFeatureBatch:(const char *)reference withValue:(const char *)value;

+ (void)unlockResourceBatch:(const char *)reference withQuantity:(const int)quantity;

// rewards

// iOS to C++
+ (void)alertVideoAvailability: (const BOOL)available;
+ (void)rewardForVideoAd;

@end

#endif /* SharingBridge_h */