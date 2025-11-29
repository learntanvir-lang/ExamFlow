'use client';

import { useState } from 'react';
import { Logo } from './logo';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { UserNav } from './user-nav';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { AddExamForm } from './add-exam-form';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="inline-block font-bold font-headline text-xl">
              ExamWise
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Exam
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Add New Exam</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to add a new exam to your dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-4">
                  <AddExamForm setOpen={setOpen} />
                </div>
              </DialogContent>
            </Dialog>
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}