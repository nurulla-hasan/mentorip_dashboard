export interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isReplied: boolean;
  createdAt: string;
}
