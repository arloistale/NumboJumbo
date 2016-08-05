#import "RewardBridge.h"

#import <Supersonic/Supersonic.h>

#define SUPERSONIC_PLACEMENT_NAME @"DefaultRewardedVideo"

void requestRewardVideo() {
    if(![[Supersonic sharedInstance] isAdAvailable]) {
        NSLog(@"Tried to show reward video when unavailable!");
        return;
    }

    [[Supersonic sharedInstance] showRVWithPlacementName:SUPERSONIC_PLACEMENT_NAME];
}