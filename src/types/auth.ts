import { ResumeData } from './index';

export interface SavedResumeVersion {
  id: string;
  name: string;
  updatedAt: number;
  targetRole?: string;
  data: ResumeData;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  isLoggedIn: boolean;
  country: string;
  isBangladeshTalentPass: boolean;
  freeDownloadsCount: number;
  firstDownloadTimestamp?: number;
  isPaidConsultationClient: boolean;
  savedResumes: SavedResumeVersion[];
}

export const INITIAL_GUEST_ACCOUNT: UserAccount = {
  uid: 'guest',
  email: '',
  displayName: 'Guest User',
  isLoggedIn: false,
  country: 'Global',
  isBangladeshTalentPass: false,
  freeDownloadsCount: 0,
  isPaidConsultationClient: false,
  savedResumes: []
};
