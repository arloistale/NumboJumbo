//
//  SharingController.h
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/7/16.
//
//

#ifndef SharingController_h
#define SharingController_h

@interface SharingController : UIViewController {
}

- (void) shareImage: (const char *) path withMessage: (const char *) shareMessage;

@end

#endif /* SharingController_h */