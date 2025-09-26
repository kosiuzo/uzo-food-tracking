import { useState, useMemo } from 'react';

export interface DateNavigationOptions {
  initialDate?: string;
  defaultRange?: 'day' | 'week' | 'month';
}

export function useDateNavigation({
  initialDate = new Date().toISOString().split('T')[0],
  defaultRange = 'week'
}: DateNavigationOptions = {}) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>(defaultRange);

  // Helper function to get week start (Monday)
  const getWeekStart = (date: string) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  };

  // Helper function to get month start
  const getMonthStart = (date: string) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
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
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return {
          startDate: weekStart,
          endDate: weekEnd.toISOString().split('T')[0]
        };
      }

      case 'month': {
        const monthStart = getMonthStart(currentDate);
        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(monthEnd.getDate() - 1);
        return {
          startDate: monthStart,
          endDate: monthEnd.toISOString().split('T')[0]
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
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  const goToPrevious = () => {
    const d = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        d.setDate(d.getDate() - 1);
        break;
      case 'week':
        d.setDate(d.getDate() - 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() - 1);
        break;
    }
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const goToNext = () => {
    const d = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        d.setDate(d.getDate() + 1);
        break;
      case 'week':
        d.setDate(d.getDate() + 7);
        break;
      case 'month':
        d.setMonth(d.getMonth() + 1);
        break;
    }
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const goToDate = (date: string) => {
    setCurrentDate(date);
  };

  // Quick navigation to common time periods
  const goToLastWeek = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setCurrentDate(d.toISOString().split('T')[0]);
    setViewMode('week');
  };

  const goToLastMonth = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d.toISOString().split('T')[0]);
    setViewMode('month');
  };

  const goToLast30Days = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate
    };
  };

  const goToLast3Months = () => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate
    };
  };

  // Format display text for current range
  const getDisplayText = () => {
    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: viewMode === 'day' ? 'long' : undefined,
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    switch (viewMode) {
      case 'day':
        return formatDate(currentDate);

      case 'week': {
        const { startDate, endDate } = dateRange;
        const startFormatted = new Date(startDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        const endFormatted = new Date(endDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return `${startFormatted} - ${endFormatted}`;
      }

      case 'month':
        return new Date(currentDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });

      default:
        return formatDate(currentDate);
    }
  };

  // Check if we can navigate (don't go into the future)
  const canGoNext = () => {
    const today = new Date().toISOString().split('T')[0];
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