/** Minimal typing for Bun's built-in test runner (used only by `bun run test:oracle`). */
declare module "bun:test" {
  interface Matchers {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toContain(expected: string): void;
    toBeDefined(): void;
    toBeTruthy(): void;
  }
  export function describe(name: string, fn: () => void): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect(actual: unknown): Matchers;
}
