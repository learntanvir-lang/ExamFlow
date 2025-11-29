'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds, intervalToDuration } from 'date-fns';

type CountdownProps = {
  targetDate: string;
};

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();
      const seconds = differenceInSeconds(target, now);

      if (seconds <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const duration = intervalToDuration({ start: now, end: target });
      setTimeLeft({
        days: duration.days ?? 0,
        hours: duration.hours ?? 0,
        minutes: duration.minutes ?? 0,
        seconds: duration.seconds ?? 0,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isClient]);

  if (!isClient) {
    return (
        <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-md bg-muted/50">
                <div className="text-xl font-bold font-headline">--</div>
                <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
                <div className="text-xl font-bold font-headline">--</div>
                <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
                <div className="text-xl font-bold font-headline">--</div>
                <div className="text-xs text-muted-foreground">Mins</div>
            </div>
            <div className="p-2 rounded-md bg-muted/50">
                <div className="text-xl font-bold font-headline">--</div>
                <div className="text-xs text-muted-foreground">Secs</div>
            </div>
        </div>
    );
  }

  const isPast =
    timeLeft.days <= 0 &&
    timeLeft.hours <= 0 &&
    timeLeft.minutes <= 0 &&
    timeLeft.seconds <= 0;

  return (
    <div className={`grid grid-cols-4 gap-2 text-center ${isPast ? 'opacity-50' : ''}`}>
      <div className="p-2 rounded-md bg-muted/50">
        <div className="text-xl font-bold font-headline">{String(timeLeft.days).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Days</div>
      </div>
      <div className="p-2 rounded-md bg-muted/50">
        <div className="text-xl font-bold font-headline">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Hours</div>
      </div>
      <div className="p-2 rounded-md bg-muted/50">
        <div className="text-xl font-bold font-headline">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Mins</div>
      </div>
      <div className="p-2 rounded-md bg-muted/50">
        <div className="text-xl font-bold font-headline">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground">Secs</div>
      </div>
    </div>
  );
}