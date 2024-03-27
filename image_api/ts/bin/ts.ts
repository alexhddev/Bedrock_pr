#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TsImageApiStack } from '../lib/ts-stack';

const app = new cdk.App();
new TsImageApiStack(app, 'TsImageStack');