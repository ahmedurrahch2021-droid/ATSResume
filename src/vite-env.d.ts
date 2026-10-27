/// <reference types="vite/client" />

/**
 * mammoth ships a prebuilt browser bundle with no type definitions for that
 * entry point. Declare the small part of its API used by our reader.
 */
declare module 'mammoth/mammoth.browser.min.js' {
  interface MammothResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }

  const mammoth: {
    extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
    convertToHtml(input: { arrayBuffer: ArrayBuffer }): Promise<MammothResult>;
  };

  export default mammoth;
}
