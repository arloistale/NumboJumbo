#import "SharingController.h"

#import "SharingBridge.h"

void shareImageWithMessage(const char* path, const char* message) {
    SharingController *vc = [[SharingController alloc] init];
    [vc shareImage:path withMessage:message];
}