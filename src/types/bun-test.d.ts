/**
 * Ambient type definitions for bun:test in TypeScript compilation
 */

declare module 'bun:test' {
  export interface Matchers<T> {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toBeDefined(): void;
    toBeUndefined(): void;
    toBeNull(): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(expected: unknown): void;
    toHaveLength(expected: number): void;
    toHaveProperty(property: string): void;
    not: Matchers<T>;
    toMatch(regex: RegExp | string): void;
    toBeGreaterThan(expected: number): void;
    toBeGreaterThanOrEqual(expected: number): void;
    toBeInstanceOf(ctor: new (...args: any[]) => unknown): void;
    toThrow(ctor?: new (...args: any[]) => unknown): void;
    rejects: Matchers<Awaited<T>>;
    toBeLessThan(expected: number): void;
  }

  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect<T = unknown>(actual: T): Matchers<T>;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
}
