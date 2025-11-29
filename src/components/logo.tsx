import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return <BookOpenCheck className={cn('text-primary', className)} />;
};