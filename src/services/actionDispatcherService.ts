// src/services/actionDispatcherService.ts
import { AnyAction, Store } from '@reduxjs/toolkit';

/**
 * Service to handle Redux action dispatching
 * This breaks the circular dependency between store, taskSlice, and websocketService
 */
class ActionDispatcherService {
  private static instance: ActionDispatcherService;
  private store: Store | null = null;

  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): ActionDispatcherService {
    if (!ActionDispatcherService.instance) {
      ActionDispatcherService.instance = new ActionDispatcherService();
    }
    return ActionDispatcherService.instance;
  }

  /**
   * Initialize the service with the Redux store
   * This should be called after the store is created
   */
  public initStore(store: Store): void {
    this.store = store;
  }

  /**
   * Dispatch an action to the Redux store
   */
  public dispatch(action: AnyAction): void {
    if (!this.store) {
      console.error('Store not initialized in ActionDispatcherService');
      return;
    }
    this.store.dispatch(action);
  }
}

// Export singleton instance
export const actionDispatcherService = ActionDispatcherService.getInstance();
export default actionDispatcherService;
