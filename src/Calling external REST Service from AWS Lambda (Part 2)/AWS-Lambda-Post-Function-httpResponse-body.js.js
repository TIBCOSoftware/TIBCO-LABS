/*
* BSD 3-Clause License
* Copyright © 2020. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

//POST function Fragment
async function post(eventdata) {     
      let promise = new Promise((resolve, reject) => {
          
        svc.createSomething({
            auth: `Bearer ${oAuthKey}`,
            body: {
                fname: "some",
                lname: "one"
            }
        }, (err, data) => {
            if (err) {
                console.error('>> SVC error: ', err);
                callback(err);
            }
            // nothing
        })
        
        // workaround, as AWS Service usually just return full de-serialized response data
        .on('success', function(response) {
            var data = response.httpResponse.body.toString();
            console.log('data-body:', data);
            data = JSON.parse('{ "ID": ' + data + '}');
            resolve(data);
        });
      });
      
      let result = await promise; // wait until the promise resolves
      return result;
}