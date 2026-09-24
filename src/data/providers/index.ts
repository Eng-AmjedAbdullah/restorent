/**
 * Data Providers Index
 *
 * Exposes the active DataProvider singleton and provider factory.
 */

import type { DataProvider } from './types';
import { MockDataProvider } from './mock.provider';

export * from './types';
export * from './mock.provider';

// Active application singleton provider instance
let activeProvider: DataProvider = new MockDataProvider();

export function getDataProvider(): DataProvider {
  return activeProvider;
}

export function setDataProvider(provider: DataProvider): void {
  activeProvider = provider;
}
