/**
 * asset-crunch: Media Asset Size Budget Guard
 */

import { readdir, stat } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const MEDIA_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.mov']);
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);

export async function auditMediaBudgets(rootDir = process.cwd(), options = {}) {
  const maxBytes = options.maxBytes ?? 300 * 1024; // default: 300 KB budget

  const oversized = [];
  let totalMediaFiles = 0;
  let totalBytes = 0;

  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const e of entries) {
      if (IGNORED_DIRS.has(e.name)) continue;
      const full = join(dir, e.name);

      if (e.isDirectory()) {
        await walk(full);
      } else if (e.isFile()) {
        const ext = extname(e.name).toLowerCase();
        if (MEDIA_EXTS.has(ext)) {
          totalMediaFiles++;
          try {
            const fileStat = await stat(full);
            totalBytes += fileStat.size;

            if (fileStat.size > maxBytes) {
              const rel = relative(rootDir, full);
              oversized.push({
                file: rel,
                sizeBytes: fileStat.size,
                sizeKb: Math.round(fileStat.size / 1024),
                limitKb: Math.round(maxBytes / 1024),
                recommendation: getRecommendation(ext, fileStat.size)
              });
            }
          } catch {
            // ignore
          }
        }
      }
    }
  }

  await walk(rootDir);

  return {
    hasViolations: oversized.length > 0,
    totalMediaFiles,
    totalSizeBytes: totalBytes,
    totalSizeMb: (totalBytes / (1024 * 1024)).toFixed(2),
    oversized
  };
}

function getRecommendation(ext, size) {
  if (ext === '.png' && size > 500 * 1024) {
    return 'Convert to WebP / AVIF for ~60-80% smaller size.';
  }
  if (ext === '.svg') {
    return 'Run `asset-crunch --optimize-svg` to strip editor metadata & comments.';
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    return 'Compress with quality 80-85 or convert to modern WebP.';
  }
  return 'Compress or resize asset dimensions.';
}

