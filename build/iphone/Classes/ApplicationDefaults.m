/**
* Appcelerator Titanium Mobile
* This is generated code. Do not modify. Your changes *will* be lost.
* Generated code is Copyright (c) 2009-2011 by Appcelerator, Inc.
* All Rights Reserved.
*/
#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"
 
@implementation ApplicationDefaults
  
+ (NSMutableDictionary*) copyDefaults
{
    NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];

    [_property setObject:[TiUtils stringValue:@"XbPKERaMoJfff62gYF9kCfxO7t7DYIiv"] forKey:@"acs-oauth-secret-production"];
    [_property setObject:[TiUtils stringValue:@"GgRLC2knR79k4Bmx8PaUKDZQRXQNdEKZ"] forKey:@"acs-oauth-key-production"];
    [_property setObject:[TiUtils stringValue:@"F80xpsGgm2Yyf2cPLtXumHzoeVi1j1bP"] forKey:@"acs-api-key-production"];
    [_property setObject:[TiUtils stringValue:@"llJKCFisyfrs20z5SnKct56cep0vaWVH"] forKey:@"acs-oauth-secret-development"];
    [_property setObject:[TiUtils stringValue:@"D8emSitkv0UekXWKIETz3xQDg85kFk9g"] forKey:@"acs-oauth-key-development"];
    [_property setObject:[TiUtils stringValue:@"sInlDKJGeaPrtdf5L8c3xsCZh3F6I7BB"] forKey:@"acs-api-key-development"];
    [_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];

    return _property;
}
@end
