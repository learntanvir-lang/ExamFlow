'use client';

import { useState, useEffect, memo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import type { Exam } from '@/lib/types';
import Header from './header';
import ExamCard from './exam-card';
import { Skeleton } from './ui/skeleton';

const MemoizedExamCard = memo(ExamCard);

export default function Dashboard() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    const examsRef = collection(db, 'users', user.uid, 'exams');
    const q = query(examsRef, orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Exam[];
      
      const now = new Date();
      const upcomingExams = examsData.filter(exam => new Date(exam.date) >= now);
      const pastExams = examsData.filter(exam => new Date(exam.date) < now);

      setExams([...upcomingExams, ...pastExams]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching exams:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-[1400px] px-0 py-4 sm:px-0 sm:py-6 lg:px-0 lg:py-8">
        {loading ? (
           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
           </div>
        ) : exams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map(exam => (
              <MemoizedExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border-2 border-dashed">
            <h2 className="text-xl font-headline font-semibold text-foreground">No Exams Yet!</h2>
            <p className="mt-2 text-muted-foreground">Click "Add Exam" to get started.</p>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
