// Render HTML to PDF using Puppeteer

import puppeteer from 'puppeteer';

/**
 * Render an HTML string to a PDF buffer using Puppeteer.
 * Produces an A4 document with print backgrounds enabled.
 */
export async function renderPdf(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let page: Awaited<ReturnType<typeof browser.newPage>> | null = null;
  try {
    page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '18mm',
        right: '15mm',
        bottom: '18mm',
        left: '15mm',
      },
      preferCSSPageSize: false,
    });

    // page.pdf() returns a Uint8Array; convert to Buffer
    return Buffer.from(pdfBuffer);
  } finally {
    if (page) {
      try { await page.close(); } catch { /* browser.close() will clean up */ }
    }
    await browser.close();
  }
}
