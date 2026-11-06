export interface SvgOptimizationResult {
  content: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savingsPct: number;
}

export interface OversizedMedia {
  file: string;
  sizeBytes: number;
  sizeKb: number;
  limitKb: number;
  recommendation: string;
}

export interface MediaBudgetReport {
  hasViolations: boolean;
  totalMediaFiles: number;
  totalSizeBytes: number;
  totalSizeMb: string;
  oversized: OversizedMedia[];
}

export declare function optimizeSvg(svgContent: string, options?: { precision?: number }): SvgOptimizationResult;
export declare function auditMediaBudgets(rootDir?: string, options?: { maxBytes?: number }): Promise<MediaBudgetReport>;

