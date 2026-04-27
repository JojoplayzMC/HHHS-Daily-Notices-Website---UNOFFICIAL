function doGet() {
  const docId = '1iiRgU9J7krNyuUBVU-1zRg1nWiZIVA-DzXoxKS7GA7Y';
  
  try {
    const doc = DocumentApp.openById(docId);
    const tabs = doc.getTabs(); // This gets the actual "Document Tabs" from the left sidebar
    let allData = {};

    tabs.forEach((tab) => {
      const tabName = tab.getTitle();
      const tabBody = tab.asDocumentTab().getBody();
      const tables = tabBody.getTables();
      
      let notices = [];

      if (tables.length > 0) {
        const table = tables[0];
        const numRows = table.getNumRows();

        for (let i = 2; i < numRows; i++) {
          const row = table.getRow(i);
          const numCells = row.getNumCells();

          if (numCells >= 2) {
            const subject = row.getCell(0).getText().trim();
            const content = row.getCell(1).getText().trim();
            
            const teacher = (numCells > 2) ? row.getCell(2).getText().trim() : "Staff";
            const expiry  = (numCells > 3) ? row.getCell(3).getText().trim() : "Ongoing";

            if (subject.length > 0 && content.length > 0) {
              notices.push({ subject, content, teacher, expiry });
            }
          }
        }
      }
      // Only add the tab to the results if it actually has notices
      if (notices.length > 0) {
        allData[tabName] = notices;
      }
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true, data: allData }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: e.toString() }));
  }
}
