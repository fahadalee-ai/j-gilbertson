import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isoDate } from "@/lib/format";

export function isClosedDay(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function CalendarPicker({ value, onChange }: { value: string | null; onChange: (iso: string) => void }) {
  const today = startOfDay(new Date());
  const selected = value ? new Date(`${value}T00:00:00`) : null;
  const [cursor, setCursor] = useState(startOfMonth(selected ?? today));
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor)),
    end: endOfWeek(endOfMonth(cursor)),
  });
  const atMin = isSameMonth(cursor, today);

  return (
    <div className="rounded-[20px] bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={atMin} onClick={() => setCursor(addMonths(cursor, -1))} className="flex h-11 w-11 items-center justify-center rounded-full text-primary disabled:opacity-30">
          <ChevronLeft />
        </button>
        <p className="text-[17px] font-semibold">{format(cursor, "MMMM yyyy")}</p>
        <button type="button" aria-label="Next month" onClick={() => setCursor(addMonths(cursor, 1))} className="flex h-11 w-11 items-center justify-center rounded-full text-primary">
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[12px] font-semibold text-muted-foreground">
        {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
          <span key={`${label}-${index}`} className="py-1">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const closed = isClosedDay(day) || isBefore(day, today);
          const outside = !isSameMonth(day, cursor);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={closed || outside}
              aria-pressed={isSelected}
              aria-label={format(day, "EEEE, MMMM d")}
              onClick={() => onChange(isoDate(day))}
              className={cn(
                "mx-auto my-0.5 flex h-11 w-11 items-center justify-center rounded-full text-[15px]",
                outside && "invisible",
                closed && !outside && "text-muted-foreground/50",
                isToday && !isSelected && "ring-1 ring-primary",
                isSelected && "bg-primary font-semibold text-white",
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">Weekends are closed. Holiday closures are confirmed when you book. Times are Pacific Time (Las Vegas).</p>
    </div>
  );
}
