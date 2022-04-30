import xlsx from 'xlsx';

export const readExcel = (excel) => {
  // @files 엑셀 파일을 가져온다.
  const excelFile = xlsx.readFile(excel);

  // @breif 엑셀 파일의 첫번째 시트의 정보를 추출
  const sheetName = excelFile.SheetNames[0];          // @details 첫번째 시트 정보 추출
  const firstSheet = excelFile.Sheets[sheetName];       // @details 시트의 제목 추출

  // @details 엑셀 파일의 첫번째 시트를 읽어온다.
  const jsonData = xlsx.utils.sheet_to_json( firstSheet, { defval : "" } );

  return jsonData;
}

export const writeExcel = (path, jsonData) => {

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(jsonData);

  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
  xlsx.writeFile(workbook, path);
}
