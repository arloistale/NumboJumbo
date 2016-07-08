#include "SharingController.h"

#include "SharingBridge.h"

void shareTextWithImage(const char* path, const char* message) {
    SharingController *vc = [[SharingController alloc] init];
    [vc shareMethod:path Message:message];
}