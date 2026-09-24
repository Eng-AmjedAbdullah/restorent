import type { DataProvider } from './types';
import type { MockOperationalProvider } from './operational.types';
import { MockDataProvider } from './mock.provider';

export * from './types';
export * from './operational.types';
export * from './mock.provider';

/** One provider instance powers the entire running Vue app and its operational mock repositories. */
export type AppProvider = DataProvider & MockOperationalProvider;
let activeProvider: AppProvider = new MockDataProvider();
export function getDataProvider(): DataProvider { return activeProvider; }
export function getMockOperations(): MockOperationalProvider { return activeProvider; }
/** A test can replace the provider; no component or service should instantiate its own copy. */
export function setDataProvider(provider: AppProvider): void { activeProvider = provider; }
