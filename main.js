const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib
var global_viewer;

Autodesk.Viewing.Initializer({ env: 'Local' }, async function () {
  global_viewer= new Autodesk.Viewing.GuiViewer3D(document.getElementById('preview'), {extensions:['Autodesk.DocumentBrowser']});
  global_viewer.start();
  global_viewer.setTheme('light-theme');
  global_viewer.loadExtension('Autodesk.PDF').then(() => {
    global_viewer.loadModel('/multi-page-sample.pdf');
  });
});


document.getElementById('splitndownload').onclick = async (ev) => {
  let currentPageIndex = global_viewer.model.getDocumentNode().data.page;
  
  let existingPdfBytes = await fetch('./multi-page-sample.pdf').then(res => res.arrayBuffer());

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();

  // Create new PDF Document
  const newPDFDoc = await PDFDocument.create();

  const [copiedPage] = await newPDFDoc.copyPages(pdfDoc, [currentPageIndex-1]);

  newPDFDoc.addPage(copiedPage);

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await newPDFDoc.save();

  // Trigger the browser to download the PDF document
  download(pdfBytes, `page${currentPageIndex}.pdf`, "application/pdf");
}