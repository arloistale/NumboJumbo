//
//  SharingBridge.h
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/7/16.
//
//

#ifndef SharingBridge_h
#define SharingBridge_h

@interface CampaignBridge : NSObject {
    
}

+ (void)prepareCampaignDetails: (const char *) campaignName withMessage: (const char *) campaignMessage;

+ (void)unlockFeatureBatch: (const char *) reference withValue: (const char *) value;

+ (void)unlockResourceBatch: (const char *) reference withQuantity: (const int) quantity;

@end

#endif /* SharingBridge_h */
