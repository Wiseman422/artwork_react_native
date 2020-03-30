/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RCCManager.h"
#import <RNGoogleSignin/RNGoogleSignin.h>
#import <Firebase.h>
#import "RNFIRMessaging.h"
@import GooglePlaces;
@import GoogleMaps;


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  //NSURL *jsCodeLocation;

//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
//
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
//                                                      moduleName:@"Artwork"
//                                               initialProperties:nil
//                                                   launchOptions:launchOptions];
//  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  [GMSPlacesClient provideAPIKey:kGOOGLE_API_KEY];
  [GMSServices provideAPIKey:kGOOGLE_API_KEY];
  
  NSURL *jsCodeLocation;
#ifdef DEBUG
  //  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.bundle?platform=ios&dev=true"];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  
  // **********************************************
  // *** DON'T MISS: THIS IS HOW WE BOOTSTRAP *****
  // **********************************************
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  self.window.backgroundColor = [UIColor whiteColor];
  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url
                                                        sourceApplication:sourceApplication
                                                     annotation:annotation]|| [RNGoogleSignin application:application
                                                                                                  openURL:url
                                                                                        sourceApplication:sourceApplication
                                                                                               annotation:annotation
                                                                               ];
}

//- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
//    //[RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
//  NSLog(@"Notification: %@", notification);
//  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
////  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];//Comment if you don't need to redirect to notification screen directly
//}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler {
  //[RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
  NSLog(@"Notification: %@", notification);
  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
  //  [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];//Comment if you don't need to redirect to notification screen directly
}

#if defined(__IPHONE_11_0)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler {
    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#else
- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler {
   [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
#endif

//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
      [RNFIRMessaging didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler {
    [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

@end
