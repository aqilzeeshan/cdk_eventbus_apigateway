#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkEventbusApigatewayStack } from '../lib/cdk_eventbus_apigateway-stack';

const app = new cdk.App();
new CdkEventbusApigatewayStack(app, 'CdkEventbusApigatewayStack');
