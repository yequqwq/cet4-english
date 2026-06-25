import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, useAppStore } from '../store/useAppStore';

// Clear localStorage and reset stores before each test
beforeEach(() => {
  localStorage.clear();
  // Force store re-initialization by calling logout
  const auth = useAuthStore.getState();
  if (auth.isLoggedIn) auth.logout();
  const app = useAppStore.getState();
  // Reset daily tasks to re-seed
  app.resetDailyTasks();
});

describe('useAuthStore', () => {
  it('should have initial state', () => {
    const { isLoggedIn, currentUser } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
    expect(currentUser).toBeNull();
  });

  it('should register a new user', () => {
    const { register } = useAuthStore.getState();
    const result = register('testuser', 'password123');
    expect(result).toBe(true);
  });

  it('should login with existing credentials', () => {
    const { register, login } = useAuthStore.getState();
    register('testuser', 'password123');
    const result = login('testuser', 'password123');
    expect(result).toBe(true);
  });

  it('should fail login with wrong password', () => {
    const { register, login } = useAuthStore.getState();
    register('testuser', 'password123');
    const result = login('testuser', 'wrongpassword');
    expect(result).toBe(false);
  });

  it('should logout', () => {
    const { register, login, logout } = useAuthStore.getState();
    register('testuser', 'password123');
    login('testuser', 'password123');
    logout();
    const { isLoggedIn } = useAuthStore.getState();
    expect(isLoggedIn).toBe(false);
  });

  it('should prevent duplicate username registration', () => {
    const { register } = useAuthStore.getState();
    register('testuser', 'password123');
    const result = register('testuser', 'differentpassword');
    expect(result).toBe(false);
  });
});
