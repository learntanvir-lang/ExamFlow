'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Exam, ExamItem as ExamItemType, ItemType } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  FilePenLine,
  Trash2,
  PlusCircle,
  BookCopy,
  CalendarCheck,
  Timer,
  BadgeCheck,
  CreditCard,
  Link,
  Save,
  Loader2,
  NotebookText,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import ExamItem from './exam-item';
import { Skeleton } from './ui/skeleton';

type ExamCardProps = {
  exam: Exam;
};

export default function ExamCard({ exam }: ExamCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [items, setItems] = useState<ExamItemType[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPast = new Date(exam.date) < new Date();

  useEffect(() => {
    if (!user) return;
    const itemsQuery = query(
      collection(db, 'users', user.uid, 'exams', exam.id, 'items'),
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const itemsData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as ExamItemType)
      );
      setItems(itemsData);
      setLoadingItems(false);
    });
    return () => unsubscribe();
  }, [user, exam.id]);

  const handleDeleteExam = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // Delete all items in a batch
      const batch = writeBatch(db);
      const itemsQuery = query(collection(db, 'users', user.uid, 'exams', exam.id, 'items'));
      const itemsSnapshot = await getDocs(itemsQuery);
      itemsSnapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      // Delete the exam
      await deleteDoc(doc(db, 'users', user.uid, 'exams', exam.id));
      
      toast({
        title: 'Exam Deleted',
        description: `"${exam.name}" has been removed.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete exam.',
      });
      console.error('Error deleting exam:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleAddItem = async (type: ItemType) => {
    if (!user) return;
    const baseItem = {
      order: items.length,
    };
    let newItemData: Omit<ExamItemType, 'id'>;

    switch (type) {
      case 'title-date':
        newItemData = { ...baseItem, type, title: 'New Milestone', date: new Date().toISOString() };
        break;
      case 'title-checkbox':
        newItemData = { ...baseItem, type, title: 'New Task', checked: false };
        break;
      case 'countdown':
        newItemData = { ...baseItem, type, title: 'Countdown', date: exam.date };
        break;
      case 'eligibility':
        newItemData = { ...baseItem, type, title: 'Eligibility', status: 'Pending' };
        break;
      case 'payment':
        newItemData = { ...baseItem, type, title: 'Fee Payment', status: 'Due' };
        break;
      case 'button-link':
        newItemData = { ...baseItem, type, label: 'Official Website', url: '#' };
        break;
      case 'title-description':
        newItemData = { ...baseItem, type, title: 'New Title', description: 'Enter your description here.' };
        break;
      default:
        return;
    }
    await addDoc(collection(db, 'users', user.uid, 'exams', exam.id, 'items'), newItemData);
  };

  return (
    <>
      <Card
        className={`overflow-hidden transition-all duration-300 flex flex-col ${
          isPast ? 'opacity-70' : 'opacity-100'
        } ${editMode ? 'shadow-accent/40 shadow-lg' : 'shadow-md'}`}
      >
        <CardHeader className="p-0 relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button
              size="icon"
              variant={editMode ? 'default' : 'secondary'}
              onClick={() => setEditMode(!editMode)}
              className="h-9 w-9 rounded-full shadow-lg"
            >
              {editMode ? <Save className="h-4 w-4" /> : <FilePenLine className="h-4 w-4" />}
              <span className="sr-only">{editMode ? 'Save' : 'Edit'}</span>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-9 w-9 rounded-full shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Exam</span>
            </Button>
          </div>
          <Image
            src={exam.imageUrl}
            alt={exam.name}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover"
            data-ai-hint="desk books"
          />
          <div className="p-4 pb-0">
            <h3 className="font-headline text-2xl font-semibold text-primary">{exam.name}</h3>
            <p className="text-base font-semibold">{format(new Date(exam.date), "d MMMM, yyyy (EEEE)")}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="space-y-4 flex-grow">
            {loadingItems ? (
              <div className="space-y-4 pt-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              items.map((item) => (
                <ExamItem key={item.id} item={item} exam={exam} editMode={editMode} />
              ))
            )}
          </div>
          {editMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mt-4 w-full border-dashed">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => handleAddItem('countdown')}>
                  <Timer className="mr-2 h-4 w-4" />
                  <span>Countdown</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('title-date')}>
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  <span>Title + Date</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('title-checkbox')}>
                  <BookCopy className="mr-2 h-4 w-4" />
                  <span>Title + Checkbox</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('title-description')}>
                  <NotebookText className="mr-2 h-4 w-4" />
                  <span>Title + Description</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('eligibility')}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  <span>Eligibility Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('payment')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Payment Status</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddItem('button-link')}>
                  <Link className="mr-2 h-4 w-4" />
                  <span>Button Link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "{exam.name}" exam and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExam}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
