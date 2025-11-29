export interface Exam {
  id: string;
  name: string;
  date: string; // ISO string
  imageUrl: string;
  createdAt: any; // Firestore Timestamp
}

export type ItemType =
  | 'title-date'
  | 'title-checkbox'
  | 'countdown'
  | 'eligibility'
  | 'payment'
  | 'button-link';

export interface BaseExamItem {
  id: string;
  order: number;
  type: ItemType;
}

export interface TitleDateItem extends BaseExamItem {
  type: 'title-date';
  title: string;
  date: string; // ISO string
}

export interface TitleCheckboxItem extends BaseExamItem {
  type: 'title-checkbox';
  title: string;
  checked: boolean;
}

export interface CountdownItem extends BaseExamItem {
  type: 'countdown';
  date: string; // ISO string
}

export interface StatusItem extends BaseExamItem {
  type: 'eligibility' | 'payment';
  title: string;
  status: string;
}

export interface ButtonLinkItem extends BaseExamItem {
  type: 'button-link';
  label: string;
  url: string;
}

export type ExamItem =
  | TitleDateItem
  | TitleCheckboxItem
  | CountdownItem
  | StatusItem
  | ButtonLinkItem;