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
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 md:gap-4">
          <a href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="hidden font-headline text-xl font-bold sm:inline-block">
              ExamWise
            </span>
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Exam</span>
                <span className="sm:hidden">Add</span>
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
        </div>
      </div>
    </header>
  );
}
