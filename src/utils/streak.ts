import type { DailyGoalLog, Goal, Skill } from '../types';

export function getTodayStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface GoalStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletedDays: number;
  totalMissedDays: number;
  totalAchieved: number;
  completionPercentage: number;
  todayLog?: DailyGoalLog;
  thisWeekAchieved: number;
  thisMonthAchieved: number;
}

export function calculateGoalStats(goal: Goal): GoalStats {
  const logs = goal.logs || {};
  const todayStr = getTodayStr();
  const targetVal = goal.targetValue || 1;

  let totalAchieved = 0;
  let totalCompletedDays = 0;
  let totalMissedDays = 0;
  let thisWeekAchieved = 0;
  let thisMonthAchieved = 0;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const dates = Object.keys(logs).sort();

  dates.forEach((dStr) => {
    const log = logs[dStr];
    const logVal = log.actualValue ?? (log.completed ? targetVal : 0);
    totalAchieved += logVal;

    if (log.completed || logVal >= targetVal) {
      totalCompletedDays++;
    } else if (log.completed === false) {
      totalMissedDays++;
    }

    const logDate = new Date(dStr);
    if (!isNaN(logDate.getTime())) {
      if (logDate >= startOfWeek) {
        thisWeekAchieved += logVal;
      }
      if (logDate >= startOfMonth) {
        thisMonthAchieved += logVal;
      }
    }
  });

  // Calculate Streak
  let currentStreak = 0;
  let longestStreak = 0;

  // Streak logic for daily goals: scan backwards from today
  const checkDate = new Date();
  let doneCheckingCurrent = false;

  for (let i = 0; i < 365; i++) {
    const d = new Date(checkDate);
    d.setDate(d.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const log = logs[dateKey];
    const isDone = log && (log.completed || (log.actualValue ?? 0) >= targetVal);

    if (isDone) {
      if (!doneCheckingCurrent) {
        currentStreak++;
      }
    } else {
      // If today hasn't been logged yet, allow yesterday to continue streak
      if (i === 0 && !log) {
        // Continue to check yesterday
        continue;
      } else {
        doneCheckingCurrent = true;
      }
    }
  }

  // Calculate longest streak across all logs sorted by date
  let runningStreak = 0;
  // create date range from start date or earliest log to today
  if (dates.length > 0) {
    const minDateStr = dates[0];
    const curr = new Date(minDateStr);
    const end = new Date();

    while (curr <= end) {
      const dKey = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      const log = logs[dKey];
      const isDone = log && (log.completed || (log.actualValue ?? 0) >= targetVal);

      if (isDone) {
        runningStreak++;
        if (runningStreak > longestStreak) {
          longestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }

      curr.setDate(curr.getDate() + 1);
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  const totalLoggedDays = totalCompletedDays + totalMissedDays;
  const completionPercentage = totalLoggedDays > 0 ? Math.round((totalCompletedDays / totalLoggedDays) * 100) : 0;

  return {
    currentStreak,
    longestStreak,
    totalCompletedDays,
    totalMissedDays,
    totalAchieved,
    completionPercentage,
    todayLog: logs[todayStr],
    thisWeekAchieved,
    thisMonthAchieved,
  };
}

export interface SkillStats {
  totalHours: number;
  totalMinutes: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  numberLearningDays: number;
  averageHoursPerDay: number;
  progressPercent: number;
}

export function calculateSkillStats(skill: Skill): SkillStats {
  const logs = skill.logs || [];
  let totalMinutesSum = 0;
  let hoursThisWeek = 0;
  let hoursThisMonth = 0;

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const uniqueDays = new Set<string>();

  logs.forEach((log) => {
    const mins = (log.hours || 0) * 60 + (log.minutes || 0);
    totalMinutesSum += mins;
    if (log.date) uniqueDays.add(log.date);

    const logDate = new Date(log.date);
    if (!isNaN(logDate.getTime())) {
      if (logDate >= startOfWeek) {
        hoursThisWeek += (log.hours || 0) + (log.minutes || 0) / 60;
      }
      if (logDate >= startOfMonth) {
        hoursThisMonth += (log.hours || 0) + (log.minutes || 0) / 60;
      }
    }
  });

  const totalHoursFloat = totalMinutesSum / 60;
  const totalHours = Math.floor(totalHoursFloat);
  const totalMinutes = Math.round(totalMinutesSum % 60);

  const numberLearningDays = uniqueDays.size;
  const averageHoursPerDay = numberLearningDays > 0 ? Number((totalHoursFloat / numberLearningDays).toFixed(1)) : 0;

  // Streak calculation for skill learning days
  let currentStreak = 0;
  let longestStreak = 0;
  const daySet = new Set(logs.map((l) => l.date));

  const checkDate = new Date();
  let doneCurrent = false;

  for (let i = 0; i < 365; i++) {
    const d = new Date(checkDate);
    d.setDate(d.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (daySet.has(dateKey)) {
      if (!doneCurrent) currentStreak++;
    } else {
      if (i === 0) continue; // Allow today to not be logged yet
      doneCurrent = true;
    }
  }

  // Calculate longest streak
  const sortedDates = Array.from(daySet).sort();
  if (sortedDates.length > 0) {
    let run = 0;
    const curr = new Date(sortedDates[0]);
    const end = new Date();

    while (curr <= end) {
      const dKey = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      if (daySet.has(dKey)) {
        run++;
        if (run > longestStreak) longestStreak = run;
      } else {
        run = 0;
      }
      curr.setDate(curr.getDate() + 1);
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  let progressPercent = 0;
  if (skill.status === 'Completed') progressPercent = 100;
  else if (skill.status === 'Learning') progressPercent = Math.min(95, Math.round((numberLearningDays / 30) * 100) || 20);
  else if (skill.status === 'Paused') progressPercent = 40;

  return {
    totalHours,
    totalMinutes,
    hoursThisWeek: Number(hoursThisWeek.toFixed(1)),
    hoursThisMonth: Number(hoursThisMonth.toFixed(1)),
    currentStreak,
    longestStreak,
    numberLearningDays,
    averageHoursPerDay,
    progressPercent,
  };
}
