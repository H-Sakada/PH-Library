export interface BookPage {
  pageNumber: number;
  chapterTitle?: string;
  paragraphs: string[];
  isSample: boolean;
}

export interface TableOfContentItem {
  title: string;
  page: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Law' | 'Economics';
  priceUSD: number;
  priceKHR: number;
  description: string;
  totalPages: number;
  previewPages: number;
  publishDate: string;
  publisher: string;
  tableOfContents: TableOfContentItem[];
  pages: BookPage[];
}

export interface Purchase {
  id: string;
  bookId: string;
  userId: string;
  userEmail: string;
  userName: string;
  amountUSD: number;
  amountKHR: number;
  paymentMethod: 'aba_payway';
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}
