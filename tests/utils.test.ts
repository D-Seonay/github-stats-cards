import { describe, it, expect } from 'vitest';
import { minifySVG } from '../src/utils';

describe('minifySVG', () => {
  it('should remove newlines and extra spaces', () => {
    const input = `
      <svg>
        <rect x="0" y="0" />
      </svg>
    `;
    const output = minifySVG(input);
    expect(output).toBe('<svg><rect x="0" y="0" /></svg>');
  });

  it('should trim leading and trailing whitespace', () => {
    const input = '   <svg></svg>   ';
    const output = minifySVG(input);
    expect(output).toBe('<svg></svg>');
  });
});
