import { InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new
InjectionToken<globalThis.Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

export class Storage {
}
