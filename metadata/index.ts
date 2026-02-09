import type { ExtractedMetadata } from 'metadata-connect' with { "resolution-mode": "import" };
export type { ExtractedMetadata } from 'metadata-connect' with { "resolution-mode": "import" };

import type { FileTransfer } from '../services/FileTransfer';
import { createFileTransferReader } from './reader';

type MetadataConnectModule = {
  extractMetadata: (reader: unknown) => Promise<ExtractedMetadata>;
  isExtensionSupported: (ext: string) => boolean;
};

let _metadataConnect: Promise<MetadataConnectModule> | undefined;

function metadataConnect(): Promise<MetadataConnectModule> {
  return (_metadataConnect ??= import('metadata-connect') as unknown as Promise<MetadataConnectModule>);
}

export async function extractMetadataFromDevice(
  fileTransfer: FileTransfer,
  networkPath: string
): Promise<ExtractedMetadata | null> {
  if (networkPath.includes('streaming://')) return null;

  const { extractMetadata, isExtensionSupported } = await metadataConnect();

  const extension = networkPath.split('.').pop()?.toLowerCase() ?? '';
  if (!isExtensionSupported(extension)) return null;

  try {
    // Get file size
    const size = await fileTransfer.getFileSize(networkPath);
    if (size === 0) return null;

    // Create reader and extract metadata
    const reader = createFileTransferReader(fileTransfer, networkPath, size);
    return await extractMetadata(reader);
  } catch {
    // Return null on any error (file not found, network issues, etc.)
    return null;
  }
}
