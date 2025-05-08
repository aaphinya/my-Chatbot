// code.gs/private
function doGet(e) {
    return HtmlService.createTemplateFromFile("private").evaluate()
      .setTitle("ระบบค้นหาข้อมูลการเดินทาง")
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  function processForm(formObject) {
    var searchtext = formObject.searchtext; // รับค่าที่กรอกจากฟอร์ม
    if (searchtext) {
      var result = search(searchtext); // ค้นหาข้อมูลจาก Google Sheets
      Logger.log(result); // ตรวจสอบผลลัพธ์ที่ได้
      return result; // ส่งคืนข้อมูลเพื่อแสดงผลใน HTML
    }
    return []; // ถ้าไม่พบข้อมูล ส่งคืนอาร์เรย์ว่าง
  }
  
  function search(searchtext) {
    var spreadsheetId = '1tiwqsZryzVxy32pcZH6iX6nfDp7icCgg396gTzqRAKc'; // ID  Sheets
    var sheetName = "ส่วนตัว"; // ชื่อชีต
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    var data = sheet.getDataRange().getValues();
    var ar = [];
  
    data.forEach(function(f) {
      
      if (f[1] === searchtext) {
        var timeStamp = f[0] ? Utilities.formatDate(new Date(f[0]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss") : "";  // ประทับเวลา
        var travelTime = f[6] ? Utilities.formatDate(new Date(f[6]), Session.getScriptTimeZone(), "HH:mm:ss") : ""; // เวลาเดินทาง
  
        ar.push([
          timeStamp,    // ประทับเวลา
          f[2],         // วิธีการเดินทาง
          f[3],         // ทะเบียนรถ
          f[4],         //  สีรถ
          f[5],         // ต้นทางปลายทาง
          travelTime,   // เวลาเดินทาง
          f[7],         // รูปสัมภาระของคุณ
          f[8],       // รูปบรรยากาศรอบๆ
          f[1]         // Email
        ]);
      }
    });
  
    Logger.log(ar); // ตรวจสอบข้อมูลที่ค้นหาได้
    return ar; // ส่งข้อมูลกลับมาเพื่อแสดงผลใน HTML
  }
  

