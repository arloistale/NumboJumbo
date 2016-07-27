//
//  SharingController.m
//  NumboJumbo
//
//  Created by Jonathan Lu on 7/7/16.
//
//

#import "SharingController.h"

@implementation SharingController

- (void) shareImage: (const char *) path withMessage: (const char *) shareMessage {
    NSString *imagePath = [NSString stringWithUTF8String:path];
    
    //    UIImage *image      = [UIImage imageNamed:imagePath];
    UIImage *image = [UIImage imageWithContentsOfFile:imagePath];
    NSString *message   = [NSString stringWithUTF8String:shareMessage];
    NSArray *postItems  = @[message,image];
    
    UIActivityViewController *activityVc = [[UIActivityViewController alloc]initWithActivityItems:postItems applicationActivities:nil];
    
    if ( UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad && [activityVc respondsToSelector:@selector(popoverPresentationController)] ) {
        
        UIPopoverController *popup = [[UIPopoverController alloc] initWithContentViewController:activityVc];
        
        [popup presentPopoverFromRect:CGRectMake(self.view.frame.size.width/2, self.view.frame.size.height/4, 0, 0)
                               inView:[UIApplication sharedApplication].keyWindow.rootViewController.view permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    }
    else
        [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:activityVc animated:YES completion:nil];
}

@end