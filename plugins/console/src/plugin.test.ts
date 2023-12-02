import { consolePlugin } from './plugin';

describe('console', () => {
  it('should export plugin', () => {
    expect(consolePlugin).toBeDefined();
  });
});
