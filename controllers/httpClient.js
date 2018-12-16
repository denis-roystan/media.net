var httpClient = {
    post: function(aUrl, reqBody, aCallback, eCallback) {  
      var http = new XMLHttpRequest();
      http.onreadystatechange = function() { 
          if (http.readyState == 4 && http.status == 200) {
            aCallback(http.responseText, http.status);
        } else if(http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400)) {
            if(http.responseText) {
              if(eCallback) {
                eCallback(http);
              }
              var error = {'_body': http.responseText, 'status': http.status };
              Events.publish('error', error);
            }
          }
      }
      http.open( 'POST', aUrl, true );
      http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      http.send(JSON.stringify(reqBody));
    },
  
    put: function(aUrl, reqBody, aCallback) {  
      var http = new XMLHttpRequest();
      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          aCallback(http.responseText);
        } else if(http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400)) {
          if(http.responseText) {
            var error = {'_body': http.responseText, 'status': http.status };
            Events.publish('error', error);
          }
        }
      }
      http.open( 'PUT', aUrl, true );
      http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      http.send(JSON.stringify(reqBody));
    },
  
    get: function(aUrl, aCallback, eCallback) {  
      var http = new XMLHttpRequest();
      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          aCallback(http.responseText, { url: http.responseURL });
        } else if(http.readyState == 4 && (http.status == 403 || http.status == 401 || http.status == 400 || http.status == 500)) {
          if(http.responseText) {
            if(eCallback) {
              eCallback(http);
            } else {
              var error = {'_body': http.responseText, 'status': http.status };
              Events.publish('error', error);
            }
          }
        }
      }
      http.open( 'GET', aUrl, true );
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      http.send(null);
    },
  
    delete: function(aUrl, aCallback) {  
      var http = new XMLHttpRequest();
      http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          aCallback(http.responseText);
        } else if(http.status == 403 || http.status == 401 || http.status == 400) {
          if(http.responseText) {
            var error = {'_body': http.responseText, 'status': http.status };
            Events.publish('error', error);
          }
        }
      }
      http.open( 'DELETE', aUrl, true );
      http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      http.send(null);
    }
}  