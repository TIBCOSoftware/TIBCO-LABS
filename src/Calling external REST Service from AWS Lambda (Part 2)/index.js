/*
* BSD 3-Clause License
* Copyright © 2020. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

// TIBCO LABS - LiveApps Case Creator
// to be called with 'x-api-key'
'use strict';

// TIBCO Cloud oAuth Token from Lambda Environment,
// Token should get secured by AWS Secrets Manager
const oAuthKey = process.env.TCIC_OAuthToken;    // "CIC~"
const region = process.env.TCIC_Region;          // "","eu.","au."

// load AWS SDK module, which is always included in the runtime environment
const AWS = require('aws-sdk');

// define the target API as a "service"
const svc = new AWS.Service({

    // the API base URL
    endpoint: 'https://'+region+'liveapps.cloud.tibco.com',

    // don't parse all API responses
    convertResponseTypes: false,

    // API endpoints
    apiConfig: {
        metadata: {
            protocol: 'rest-json' // API is JSON-based
        },
        operations: {

            // get LA Apps
            CreateCase: {
                http: {
                    method: 'POST',
                    requestUri: '/process/v1/processes'
                },
                input: {
                    type: 'structure',
                    required: [ 'auth'],
                    payload: 'body',
                    members: {
                        'auth': {
                            // send authentication header in the HTTP request header
                            location: 'header',
                            locationName: 'Authorization',
                            sensitive: true
                        },
                        'body': {
                            type: 'structure',
                            required: [ 'id', 'applicationId', 'sandboxId' ],
                            members: {
                                'id': {
                                    type: 'integer'
                                },
                                'applicationId': {
                                    type: 'integer'
                                },
                                'sandboxId': {
                                    type: 'integer'
                                },
                                'data': {}
                            }
                        }
                    }
                }
            }
            //** end of operations List
        }
    }
});

// disable AWS region related login in the SDK
svc.isGlobalEndpoint = true;

exports.handler = async (event, context, callback) => {

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        switch (event.httpMethod) {

            case 'POST':
                body = await post(JSON.parse(event.body));
                break;

            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
  
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }
    
    // *** POST
    async function post(eventdata) {
      console.log('eventdata:', eventdata);
      
      let promise = new Promise((resolve, reject) => {
          
        svc.createCase({
            auth: `Bearer ${oAuthKey}`,
            body: {
                id: eventdata.id,
                applicationId: eventdata.applicationId,
                sandboxId: eventdata.sandboxId,
                data: eventdata.data
            }
        }, (err, data) => {
            if (err) {
                console.error('>> SVC error: ', err);
                callback(err);
            }
           
            console.log('data:', data);
            resolve(data);
        })

      });
      
      let result = await promise; // wait until the promise resolves (*)
      return result;
    }
    // *** end POST
    
    // *** prep Response
    const response = {
              statusCode: statusCode,
              body: body,
              headers
            };
            
    callback(null, response);
};
