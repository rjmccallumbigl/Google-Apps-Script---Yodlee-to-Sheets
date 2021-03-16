/************************************************************************************
 * 
 * Use Yodlee API to set bank account info to Google Sheet, replace variables as necessary
 * 
 ************************************************************************************/

function primaryFunction() {

  // Declare variables
  var loginName = "ENTER_HERE";
  var clientID = "ENTER_HERE";
  var clientSecret = "ENTER_HERE";
  var yodleeURL = "https://sandbox.api.yodlee.com/ysl/";

  // Generate user token
  var yodleeToken = getUserToken(loginName, clientID, clientSecret, yodleeURL);

  // Get account info and set to sheet
  var accountInfo = callYodlee(yodleeToken, yodleeURL + "accounts?providerAccountId=&include=fullAccountNumber,holder");  
  setJSONToSheet(accountInfo, "Account Info");

  // Verify balances and set to sheet
  var accountData = callYodlee(yodleeToken, yodleeURL + "providerAccounts?providerAccountIds=");  
  setJSONToSheet(accountData, "Account Data");

  // Check account status and set to sheet
  var accountStatus = callYodlee(yodleeToken, yodleeURL + "providerAccounts");  
  setJSONToSheet(accountStatus, "Account Status");

// Verify account balance and set to sheet
  var accountBalance = callYodlee(yodleeToken, yodleeURL + "accounts/?container=bank");  
  setJSONToSheet(accountBalance, "Bank Account Balance");
}

/************************************************************************************
 * 
 * Creating function to get user token
 * 
 * @params loginName {String} Login name provided by Yodlee API
 * @params clientID {String} Client ID provided by Yodlee API
 * @params clientSecret {String} Client Secret provided by Yodlee API
 * @params yodleeURL {String} Yodlee API Endpoint
 *
 * @return {Object} User authentification access token
 * 
 * References
 * https://av.developer.yodlee.com/
 *
 ************************************************************************************/

function getUserToken(loginName, clientID, clientSecret, yodleeURL) {

  // Use the cache so we're not constantly fetching the auth token
  var cache = CacheService.getDocumentCache();
  var cacheKey = "YODLEE_CLIENT_ID=" + clientID;
  var cached = cache.get(cacheKey);
  if (cached != null) {
    console.log("Cached token is " + cached);
    return cached;
  }

  // Otherwise, specify headers
  var headers = {
    'Api-Version': '1.1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'loginName': encodeURIComponent(loginName)
  };

  // Build params
  var parameters = {
    'method': 'POST',
    'headers': headers,
    'payload': encodeURI("clientId=" + clientID + "&secret=" + clientSecret),
    'redirect': 'follow',
    'timeout': 0,
    // 'muteHttpExceptions': true,
  };

  // Call API with params
  var response = UrlFetchApp.fetch(yodleeURL + "auth/token", parameters);
  var responseJSON = JSON.parse(response);
  var token = responseJSON.token.accessToken;

  // Cache for 29 minutes
  cache.put(cacheKey, token, 29 * 60);

  // return JSON response with Link Token
  console.log("https://codepen.io/team/yodlee-dev-ex/pen/poJZGgq?type=cc&token=" + token);
  return token;
}

/************************************************************************************
 * 
 * Get linked account information
 * 
 * @params yodleeToken {String} Generated token
 * @params yodleeURL {String} Yodlee API Endpoint
 * 
 * @return {Object} Object returned from Yodlee API call
 * 
 * References
 * https://av.developer.yodlee.com/
 *
 ************************************************************************************/

function callYodlee(yodleeToken, yodleeURL) {

  // Specify headers
  var headers = {
    'Api-Version': '1.1',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + yodleeToken
  };

  // Build params
  var parameters = {
    'method': 'GET',
    'headers': headers,
    'redirect': 'follow'
  };

  // Call API with params
  var response = UrlFetchApp.fetch(yodleeURL, parameters);
  var responseJSON = JSON.parse(response);

  // return JSON response with Link Token
  return responseJSON;
}


