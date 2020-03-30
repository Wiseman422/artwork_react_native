
#import "UtilityController.h"

#import <UIKit/UIKit.h>

@implementation UtilityController
{
  NSMutableDictionary *_callbacks;
}

- (instancetype)init
{
  if ((self = [super init])) {
    _callbacks = [[NSMutableDictionary alloc] init];
  }
  return self;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}	


RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(shareApp:(NSString *)accessID) {
  
  NSString *downloadUrl = @"www.google.com";
  NSString *inviteContent = [NSString stringWithFormat:@"%@ %@",accessID,downloadUrl];
  [self inviteUser:inviteContent];
}

RCT_EXPORT_METHOD(shareRefLink:(NSString *)refLink) {
  
  NSString *inviteContent = [NSString stringWithFormat:@"%@",refLink];
  [self inviteUser:inviteContent];
}




- (void)inviteUser:(NSString *)text
{
  NSMutableArray *sharingItems = [NSMutableArray new];
  [sharingItems addObject:text];
  UIActivityViewController *activityController = [[UIActivityViewController alloc] initWithActivityItems:sharingItems applicationActivities:nil];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  [[self topViewController] presentViewController:activityController animated:YES completion:nil];
  });
}



- (UIViewController*)topViewController {
  return [self topViewControllerWithRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}

- (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)rootViewController {
  if ([rootViewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController* tabBarController = (UITabBarController*)rootViewController;
    return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
  } else if ([rootViewController isKindOfClass:[UINavigationController class]]) {
    UINavigationController* navigationController = (UINavigationController*)rootViewController;
    return [self topViewControllerWithRootViewController:navigationController.visibleViewController];
  } else if (rootViewController.presentedViewController) {
    UIViewController* presentedViewController = rootViewController.presentedViewController;
    return [self topViewControllerWithRootViewController:presentedViewController];
  } else {
    if (rootViewController) {
      return rootViewController;
    }else{
      UIViewController *recentView = self;
      
      while (recentView.parentViewController != nil) {
        recentView = recentView.parentViewController;
      }
      return recentView;
      
    }
  }
}
  
#pragma mark Private
  
static NSString *RCTKeyForInstance(id instance)
{
  return [NSString stringWithFormat:@"%p", instance];
}
 

@end
