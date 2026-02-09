declare module 'metadata-connect' {
  export interface ExtractedMetadata {
    [key: string]: unknown;
  }

  export function extractMetadata(input: unknown): Promise<ExtractedMetadata>;
  export function isExtensionSupported(ext: string): boolean;
}
