/************************************************************************************
 * 
 * Convert JSON object returned from API call to Google Sheet
 * 
 * @params {Object} obj Returned JSON object we need converted
 * @param {String} sheetName The name of the sheet the object is being mapped to
 *
 ************************************************************************************/

function setJSONToSheet(obj, sheetName) {

  //  Declare variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var primaryKey = Object.keys(obj)[0];
  var keyArray = [];
  var memberArray = [];

  // Define an array of all the returned object's keys to act as the Header Row
  keyArray.length = 0;
  keyArray = Object.keys(obj[primaryKey][0]);
  memberArray.length = 0;
  memberArray.push(keyArray);

  console.log(obj[primaryKey].length);

  //  Capture players from returned data
  for (var x = 0; x < obj[primaryKey].length; x++) {
    // memberArray.push(keyArray.map(function (key) { return obj[primaryKey][x] }));
    memberArray.push(keyArray.map(function (key) { return obj[primaryKey][x][key] }));
    console.log(memberArray[x]);
  }

  // Select the sheet and set values  
  try {
    sheet = spreadsheet.insertSheet(sheetName);
  } catch (e) {
    sheet = spreadsheet.getSheetByName(sheetName).clear();
  }
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, memberArray.length, memberArray[0].length).setValues(memberArray);
}
