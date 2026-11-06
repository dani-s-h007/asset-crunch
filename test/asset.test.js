import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { optimizeSvg } from '../src/svg-optimizer.js';

describe('asset-crunch', () => {
  describe('optimizeSvg', () => {
    it('strips XML prolog, comments, metadata and rounds decimals', () => {
      const input = `
<?xml version="1.0"?>
<!-- Comment -->
<svg xmlns="http://www.w3.org/2000/svg">
  <metadata><test>data</test></metadata>
  <path d="M 12.34567 89.12345" />
</svg>
      `;

      const result = optimizeSvg(input, { precision: 2 });
      assert.equal(result.content.includes('<?xml'), false);
      assert.equal(result.content.includes('<!--'), false);
      assert.equal(result.content.includes('<metadata>'), false);
      assert.ok(result.content.includes('12.35'));
      assert.ok(result.savedBytes > 0);
      assert.ok(result.savingsPct > 0);
    });
  });
});

