# aps-viewer-pdf-splitter

## Introduction

The purpose of this sample is to share a way to download individual PDF pages from client while rendering this PDF with APS Viewer.

To achieve that, we're leveraging the [PDF-LIB](https://pdf-lib.js.org) together with Viewer PDF local support to download the current page being rendered.

## The approach

First of all, we load the PDF using the `Autodesk.PDF` extension, as described in [this blog post](https://aps.autodesk.com/blog/dwf-and-pdf-support-forge-viewer)

After loading the PDF, the snippet below takes care of acquiring the current page and downloading that from client:

```js
let currentPageIndex = global_viewer.model.getDocumentNode().data.page;

let existingPdfBytes = await fetch("./UploadedFilesvf.pdf").then((res) =>
  res.arrayBuffer()
);

// Load a PDFDocument from the existing PDF bytes
const pdfDoc = await PDFDocument.load(existingPdfBytes);

// Get the first page of the document
const pages = pdfDoc.getPages();

// Create new PDF Document
const newPDFDoc = await PDFDocument.create();

const [copiedPage] = await newPDFDoc.copyPages(pdfDoc, [currentPageIndex - 1]);

newPDFDoc.addPage(copiedPage);

// Serialize the PDFDocument to bytes (a Uint8Array)
const pdfBytes = await newPDFDoc.save();

// Trigger the browser to download the PDF document
download(pdfBytes, "split_pdf_sample.pdf", "application/pdf");
```

[DEMO]()

## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

Joao Martins [in/jpornelas](https://linkedin.com/in/jpornelas), [Developer Advocate](http://aps.autodesk.com)
