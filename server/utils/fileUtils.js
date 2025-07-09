import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export async function readTxtFile(filePath) {
  return await fs.promises.readFile(filePath, "utf-8");
}

export async function readPdfFile(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjs.getDocument({ data }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    text += textContent.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
}

export async function readDocxFile(filePath) {
  // Unimplemented
  return "";
}
