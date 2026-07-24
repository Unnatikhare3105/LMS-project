'use client';
import { useMemo } from 'react';
import { IActivityEntry } from '@/src/types';

interface Props {
  activityLog: IActivityEntry[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['','Mon','','Wed','','Fri',''];

function getColor(count: number): string {
  if (count === 0) return 'bg-neutral-100 dark:bg-neutral-800';
  if (count === 1) return 'bg-teal-200 dark:bg-teal-900';
  if (count === 2) return 'bg-teal-300 dark:bg-teal-700';
  if (count <= 4) return 'bg-teal-500 dark:bg-teal-500';
  return 'bg-teal-700 dark:bg-teal-400';
}

export default function ActivityChart({ activityLog }: Props) {
  const { weeks, monthLabels } = useMemo(() => {
    // Build a map of date → count
    const map: Record<string, number> = {};
    activityLog.forEach((a) => { map[a.date] = a.count; });

    // Build last 52 weeks of cells (364 days)
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 363);
    // Align to Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const cells: { date: string; count: number; month: number }[] = [];
    const cur = new Date(startDate);
    while (cur <= today) {
      const dateStr = cur.toISOString().split('T')[0];
      cells.push({ date: dateStr, count: map[dateStr] ?? 0, month: cur.getMonth() });
      cur.setDate(cur.getDate() + 1);
    }

    // Group into weeks
    const weeksArr: typeof cells[] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeksArr.push(cells.slice(i, i + 7));
    }

    // Month labels
    const labels: { month: string; col: number }[] = [];
    weeksArr.forEach((week, col) => {
      const first = week[0];
      if (first && (col === 0 || weeksArr[col - 1]?.[0]?.month !== first.month)) {
        labels.push({ month: MONTHS[first.month], col });
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, [activityLog]);

  const totalContributions = activityLog.reduce((s, a) => s + a.count, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          {totalContributions} activities in the last year
        </p>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span>Less</span>
          {['bg-neutral-100 dark:bg-neutral-800','bg-teal-200 dark:bg-teal-900','bg-teal-300 dark:bg-teal-700','bg-teal-500','bg-teal-700 dark:bg-teal-400'].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: '680px' }}>
          {/* Month labels */}
          <div className="flex mb-1 ml-7">
            {weeks.map((_, col) => {
              const label = monthLabels.find((l) => l.col === col);
              return (
                <div key={col} className="w-4 shrink-0 mr-0.5">
                  {label && <span className="text-xs text-neutral-400 whitespace-nowrap">{label.month}</span>}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5">
              {DAYS.map((d, i) => (
                <div key={i} className="h-3.5 flex items-center">
                  <span className="text-xs text-neutral-400 w-5 text-right">{d}</span>
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.count} activit${cell.count === 1 ? 'y' : 'ies'}`}
                    className={`w-3.5 h-3.5 rounded-sm cursor-default transition-opacity hover:opacity-80 ${getColor(cell.count)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}