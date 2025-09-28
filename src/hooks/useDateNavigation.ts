import { useState, useMemo } from 'react';
import {
  getTodayLocalDate,
  formatAppDateForDisplay,
  shiftAppDate,
  parseAppDate,
  formatDateToIsoString
} from '@/lib/utils';

export interface DateNavigationOptions {
  initialDate?: string;
  defaultRange?: 'day' | 'week' | 'month';
}

export function useDateNavigation({
  initialDate = getTodayLocalDate(),
  defaultRange = 'week'
}: DateNavigationOptions = {}) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>(defaultRange);

  // Helper function to get week start (Monday)
  const getWeekStart = (date: string) => {
    const d = parseAppDate(date);
    const day = d.getUTCDay();
    const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
    d.setUTCDate(diff);
    return formatDateToIsoString(d);
  };

  // Helper function to get month start
  const getMonthStart = (date: string) => {
    const d = parseAppDate(date);
    d.setUTCDate(1);
    return formatDateToIsoString(d);
  };

  // Calculate the date range based on current date and view mode
  const dateRange = useMemo(() => {
    switch (viewMode) {
      case 'day':
        return {
          startDate: currentDate,
          endDate: currentDate
        };

      case 'week': {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = parseAppDate(weekStart);
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
        return {
          startDate: weekStart,
          endDate: formatDateToIsoString(weekEnd)
        };
      }

      case 'month': {
        const monthStart = getMonthStart(currentDate);
        const monthEnd = parseAppDate(monthStart);
        monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
        monthEnd.setUTCDate(monthEnd.getUTCDate() - 1);
        return {
          startDate: monthStart,
          endDate: formatDateToIsoString(monthEnd)
        };
      }

      default:
        return {
          startDate: currentDate,
          endDate: currentDate
        };
    }
  }, [currentDate, viewMode]);

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(getTodayLocalDate());
  };

  const goToPrevious = () => {
    const d = parseAppDate(currentDate);
    switch (viewMode) {
      case 'day':
        d.setUTCDate(d.getUTCDate() - 1);
        break;
      case 'week':
        d.setUTCDate(d.getUTCDate() - 7);
        break;
      case 'month':
        d.setUTCMonth(d.getUTCMonth() - 1);
        break;
    }
    setCurrentDate(formatDateToIsoString(d));
  };

  const goToNext = () => {
    const d = parseAppDate(currentDate);
    switch (viewMode) {
      case 'day':
        d.setUTCDate(d.getUTCDate() + 1);
        break;
      case 'week':
        d.setUTCDate(d.getUTCDate() + 7);
        break;
      case 'month':
        d.setUTCMonth(d.getUTCMonth() + 1);
        break;
    }
    setCurrentDate(formatDateToIsoString(d));
  };

  const goToDate = (date: string) => {
    setCurrentDate(date);
  };

  // Quick navigation to common time periods
  const goToLastWeek = () => {
    const d = parseAppDate(getTodayLocalDate());
    d.setUTCDate(d.getUTCDate() - 7);
    setCurrentDate(formatDateToIsoString(d));
    setViewMode('week');
  };

  const goToLastMonth = () => {
    const d = parseAppDate(getTodayLocalDate());
    d.setUTCMonth(d.getUTCMonth() - 1);
    setCurrentDate(formatDateToIsoString(d));
    setViewMode('month');
  };

  const goToLast30Days = () => {
    const endDate = getTodayLocalDate();
    const startDate = shiftAppDate(endDate, { days: -30 });
    return {
      startDate,
      endDate
    };
  };

  const goToLast3Months = () => {
    const endDate = getTodayLocalDate();
    const start = parseAppDate(endDate);
    start.setUTCMonth(start.getUTCMonth() - 3);
    return {
      startDate: formatDateToIsoString(start),
      endDate
    };
  };

  // Format display text for current range
  const getDisplayText = () => {
    const formatDate = (dateStr: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      if (viewMode === 'day') {
        options.weekday = 'long';
      }
      return formatAppDateForDisplay(dateStr, options);
    };

    switch (viewMode) {
      case 'day':
        return formatDate(currentDate);

      case 'week': {
        const { startDate, endDate } = dateRange;
        const startFormatted = formatAppDateForDisplay(startDate, {
          month: 'short',
          day: 'numeric'
        });
        const endFormatted = formatAppDateForDisplay(endDate, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return `${startFormatted} - ${endFormatted}`;
      }

      case 'month':
        return formatAppDateForDisplay(currentDate, {
          year: 'numeric',
          month: 'long'
        });

      default:
        return formatDate(currentDate);
    }
  };

  // Check if we can navigate (don't go into the future)
  const canGoNext = () => {
    const today = getTodayLocalDate();
    return dateRange.endDate < today;
  };

  return {
    currentDate,
    viewMode,
    dateRange,
    displayText: getDisplayText(),
    canGoNext: canGoNext(),

    // Navigation
    goToToday,
    goToPrevious,
    goToNext,
    goToDate,
    setViewMode,

    // Quick navigation
    goToLastWeek,
    goToLastMonth,
    goToLast30Days,
    goToLast3Months,
  };
}