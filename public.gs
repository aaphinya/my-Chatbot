
function doGet(e) {
  return HtmlService.createTemplateFromFile("publics").evaluate()
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
  var spreadsheetId = '1tiwqsZryzVxy32pcZH6iX6nfDp7icCgg396gTzqRAKc'; // ID ของ Google Sheets
  var sheetName = "สาธารณะ"; // ชื่อชีต
  var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  var ar = [];





  data.forEach(function (f) {
    // สมมติว่าคอลัมน์ที่ 13 คือที่อยู่อีเมล (index 12 เนื่องจากเริ่มนับจาก 0)
    if (f[12] === searchtext) {
      // จัดรูปแบบเวลาให้เป็นแค่วันที่และเวลาโดยไม่มีโซนเวลา
      var timeStamp = f[0] ? Utilities.formatDate(new Date(f[0]), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss") : "";  // ประทับเวลา
      var travelTime = f[7] ? Utilities.formatDate(new Date(f[7]), Session.getScriptTimeZone(), "HH:mm:ss") : ""; // เวลาเดินทาง
      // แปลงฟอร์แมตวันให้ตรงกับตัวกรอง

      ar.push([
        timeStamp,    // ประทับเวลา
        f[1],         // วิธีการเดินทาง
        f[2],         // ทะเบียนรถ
        f[3],         // สายที่/เลขข้างรถ
        f[4],         // ชื่อพนักงานขับรถ
        f[5],         // รหัสพนักงานขับรถ
        f[6],         // ต้นทาง-ปลายทาง
        travelTime,   // เวลาเดินทาง
        f[8],         // รูปสัมภาระของคุณ
        f[9],         // รูปบัตรพนักงาน
        f[10],        // รูปตั๋วรถ
        f[11],        // รูปบรรยากาศรอบๆ
        f[12]         // Email
      ]);
    }
  });

  Logger.log(ar); // ตรวจสอบข้อมูลที่ค้นหาได้
  return ar; // ส่งข้อมูลกลับมาเพื่อแสดงผลใน HTML
}


