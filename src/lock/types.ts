/** Phase 2 (not implemented): shield the Instagram app via Screen Time on iOS. */
export interface LockPass {
  durationMinutes: 5;
  usedToday: number;
  allowedPerDay: 2;
}

export interface AppLock {
  isSupported(): boolean;
  isEnabled(): Promise<boolean>;
  requestAuthorization(): Promise<boolean>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  startPass(): Promise<LockPass>;
}
