'use client';
import { useState } from 'react';
import { Exam, ExamItem as ExamItemType } from '@/lib/types';
import { Countdown } from './countdown';
import {
  CalendarCheck,
  BookCopy,
  Timer,
  BadgeCheck,
  CreditCard,
  Link as LinkIcon,
  Trash2,
  NotebookText,
} from 'lucide-react';
import { format } from 'date-fns';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';

type ExamItemProps = {
  item: ExamItemType;
  exam: Exam;
  editMode: boolean;
};

const ItemIcon = ({ type }: { type: ExamItemType['type'] }) => {
  const icons = {
    'title-date': CalendarCheck,
    'title-checkbox': BookCopy,
    'countdown': Timer,
    'eligibility': BadgeCheck,
    'payment': CreditCard,
    'button-link': LinkIcon,
    'title-description': NotebookText,
  };
  const Icon = icons[type];
  return <Icon className="h-5 w-5 text-primary" />;
};

export default function ExamItem({ item, exam, editMode }: ExamItemProps) {
  const { user } = useAuth();
  const [localItem, setLocalItem] = useState(item);

  const handleUpdate = async (field: string, value: any) => {
    if (!user) return;
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    const itemRef = doc(db, 'users', user.uid, 'exams', exam.id, 'items', item.id);
    await updateDoc(itemRef, { [field]: value });
  };
  
  const handleUpdateDebounced = (field: string, value: any) => {
    // Basic debounce
    const handler = setTimeout(async () => {
      if (!user) return;
      const itemRef = doc(db, 'users', user.uid, 'exams', exam.id, 'items', item.id);
      await updateDoc(itemRef, { [field]: value });
    }, 500);
    return () => clearTimeout(handler);
  };
  

  const handleDelete = async () => {
    if (!user) return;
    const itemRef = doc(db, 'users', user.uid, 'exams', exam.id, 'items', item.id);
    await deleteDoc(itemRef);
  };

  const renderViewMode = () => {
    switch (localItem.type) {
      case 'countdown':
        return (
          <div>
            <p className="text-sm font-medium">{localItem.title}</p>
            <div className="mt-1">
              <Countdown targetDate={localItem.date} />
            </div>
          </div>
        );
      case 'title-date':
        return (
          <div className="flex items-center justify-between">
            <p>{localItem.title}</p>
            <Badge variant="outline">{format(new Date(localItem.date), 'MMM d')}</Badge>
          </div>
        );
      case 'title-checkbox':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id={localItem.id}
              checked={localItem.checked}
              onCheckedChange={(checked) => handleUpdate('checked', checked)}
            />
            <label htmlFor={localItem.id} className={`flex-grow ${localItem.checked ? 'line-through text-muted-foreground' : ''}`}>{localItem.title}</label>
          </div>
        );
      case 'eligibility':
      case 'payment':
        return (
          <div className="flex items-center justify-between">
            <p>{localItem.title}</p>
            <Badge variant={localItem.status === 'Paid' || localItem.status === 'Eligible' ? 'default' : 'secondary'}>{localItem.status}</Badge>
          </div>
        );
      case 'button-link':
        return (
          <a href={localItem.url} target="_blank" rel="noopener noreferrer">
            <Button className="w-full">
              <LinkIcon className="mr-2 h-4 w-4" />
              {localItem.label}
            </Button>
          </a>
        );
      case 'title-description':
        return (
            <div>
                <p className='font-semibold'>{localItem.title}</p>
                <p className='text-sm text-muted-foreground'>{localItem.description}</p>
            </div>
        )
      default:
        return null;
    }
  };

  const renderEditMode = () => {
    switch (localItem.type) {
        case 'countdown':
            return (
                <div className='flex flex-col gap-2'>
                    <Input placeholder="Title" value={localItem.title} onChange={(e) => setLocalItem({...localItem, title: e.target.value})} onBlur={(e) => handleUpdate('title', e.target.value)} className='h-9'/>
                    <div className='flex gap-2 items-center'>
                        <span className="text-sm text-muted-foreground flex-grow">To:</span>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className='h-9 px-3'>
                                    {format(new Date(localItem.date), 'MMM d, yyyy')}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0'>
                                <Calendar mode="single" selected={new Date(localItem.date)} onSelect={(date) => date && handleUpdate('date', date.toISOString())} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            );
        case 'title-date':
            return (
                <div className='flex gap-2 items-center'>
                    <Input value={localItem.title} onChange={(e) => setLocalItem({...localItem, title: e.target.value})} onBlur={(e) => handleUpdate('title', e.target.value)} className='h-9'/>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className='h-9 px-3'>
                                {format(new Date(localItem.date), 'MMM d')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                            <Calendar mode="single" selected={new Date(localItem.date)} onSelect={(date) => date && handleUpdate('date', date.toISOString())} />
                        </PopoverContent>
                    </Popover>
                </div>
            )
        case 'title-checkbox':
            return <Input value={localItem.title} onChange={(e) => setLocalItem({...localItem, title: e.target.value})} onBlur={(e) => handleUpdate('title', e.target.value)} className='h-9'/>
        case 'eligibility':
        case 'payment':
            return (
                <div className='flex gap-2 items-center'>
                    <Input value={localItem.title} onChange={(e) => setLocalItem({...localItem, title: e.target.value})} onBlur={(e) => handleUpdate('title', e.target.value)} className='h-9 flex-grow'/>
                    <Input value={localItem.status} onChange={(e) => setLocalItem({...localItem, status: e.target.value})} onBlur={(e) => handleUpdate('status', e.target.value)} className='h-9 w-28'/>
                </div>
            )
        case 'button-link':
            return (
                <div className='flex flex-col gap-2'>
                    <Input placeholder="Button Label" value={localItem.label} onChange={(e) => setLocalItem({...localItem, label: e.target.value})} onBlur={(e) => handleUpdate('label', e.target.value)} className='h-9'/>
                    <Input placeholder="https://..." value={localItem.url} onChange={(e) => setLocalItem({...localItem, url: e.target.value})} onBlur={(e) => handleUpdate('url', e.target.value)} className='h-9'/>
                </div>
            )
        case 'title-description':
            return (
                <div className='flex flex-col gap-2'>
                    <Input placeholder="Title" value={localItem.title} onChange={(e) => setLocalItem({...localItem, title: e.target.value})} onBlur={(e) => handleUpdate('title', e.target.value)} className='h-9'/>
                    <Textarea placeholder="Description" value={localItem.description} onChange={(e) => setLocalItem({...localItem, description: e.target.value})} onBlur={(e) => handleUpdate('description', e.target.value)} />
                </div>
            )
        default:
            return null;
    }
  }


  return (
    <div className="group flex items-start gap-3 rounded-lg p-3 bg-secondary/30 border border-secondary/50">
      <div className="flex-shrink-0 pt-1">
        <ItemIcon type={item.type} />
      </div>
      <div className="flex-grow">
        {editMode ? renderEditMode() : renderViewMode()}
      </div>
      {editMode && (
        <div className='flex items-center pl-1'>
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
            </Button>
        </div>
      )}
    </div>
  );
}
