import { describe, expect, it } from 'bun:test';

// Simple implementation of the business days logic for testing
function calculateBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

describe('Cuti Logic Tests', () => {
  it('should calculate business days correctly (Mon-Fri)', () => {
    const start = new Date('2024-04-22'); // Monday
    const end = new Date('2024-04-26');   // Friday
    expect(calculateBusinessDays(start, end)).toBe(5);
  });

  it('should exclude weekends in business days calculation', () => {
    const start = new Date('2024-04-20'); // Saturday
    const end = new Date('2024-04-22');   // Monday
    expect(calculateBusinessDays(start, end)).toBe(1);
  });

  it('should return 0 for a weekend-only range', () => {
    const start = new Date('2024-04-20'); // Saturday
    const end = new Date('2024-04-21');   // Sunday
    expect(calculateBusinessDays(start, end)).toBe(0);
  });

  it('should handle same day (weekday)', () => {
    const start = new Date('2024-04-22'); // Monday
    const end = new Date('2024-04-22');   // Monday
    expect(calculateBusinessDays(start, end)).toBe(1);
  });
});
