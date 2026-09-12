/**
 * Universal Print Utility for Aspire Universal International School
 * Renders only the target printable element inside an isolated iframe,
 * completely preventing the background page, sidebars, and navigation from appearing.
 */
export function printElement(elementId: string, docTitle: string = 'Official Receipt') {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Remove any previous print iframe
  const existingFrame = document.getElementById('isolated-print-frame');
  if (existingFrame) {
    existingFrame.remove();
  }

  // Create an invisible sandbox iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'isolated-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  iframe.title = docTitle;
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Extract all existing style sheets from the main document (Tailwind, fonts, custom styles)
  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((el) => el.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${docTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 0; /* Suppresses browser URL and date headers/footers */
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            color: #111827 !important;
          }
          .isolated-print-wrapper {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 14mm 16mm;
          }
          /* Strictly prevent system monospace/dot-matrix fonts from corrupting numbers */
          .font-mono, [class*="font-mono"], code, pre {
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-variant-numeric: tabular-nums !important;
            letter-spacing: normal !important;
          }
          /* Normalize print borders and tables */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          tr {
            page-break-inside: avoid;
          }
          .print\\:hidden {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="isolated-print-wrapper">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  // Allow styles and fonts to render before launching the print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('Isolated print failed, falling back to window.print():', err);
      window.print();
    }
  }, 350);
}
