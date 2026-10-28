import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { INITIAL_GUEST_ACCOUNT, type UserAccount } from '../types/auth';
import { Modal } from './Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (account: UserAccount) => boolean;
  account: UserAccount;
}

// Retain the local profile utility; authentication needs a real backend.
export function AuthModal({ isOpen, onClose, onLoginSuccess, account }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (isOpen) {
      setName(account.isLoggedIn ? account.displayName : '');
      setEmail(account.email);
      setCountry(account.isLoggedIn ? account.country : '');
      setMessage('');
    }
    // Reset only when the dialog opens, not when saving updates the parent.
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="local-profile-title" className="max-w-md">
      <div className="flex items-start justify-between gap-3 border-b border-line p-5">
        <div><p className="eyebrow">On this browser only</p><h2 id="local-profile-title" className="mt-1 text-xl">Your local profile</h2></div>
        <button type="button" className="btn btn-ghost px-3" onClick={onClose} aria-label="Close profile"><X className="h-5 w-5" aria-hidden="true" /></button>
      </div>
      <form className="modal-content space-y-4 p-5" onSubmit={(event) => {
        event.preventDefault();
        const saved = onLoginSuccess({ ...INITIAL_GUEST_ACCOUNT, ...account, uid: account.uid === 'guest' ? `local-${Date.now()}` : account.uid, displayName: name.trim(), email: email.trim(), country: country.trim(), photoUrl: undefined, isLoggedIn: true });
        setMessage(saved ? 'Profile saved in this browser.' : 'Storage is unavailable. Your profile is available for this session only.');
      }}>
        <p className="text-sm text-muted">Online sign-in and cloud sync are not connected yet. This optional profile saves a name and contact details on this device. The free tools work without it.</p>
        <div className="space-y-2"><label htmlFor="profile-name" className="text-sm font-medium">Name</label><input id="profile-name" autoComplete="name" required className="field" value={name} onChange={(event) => setName(event.target.value)} /></div>
        <div className="space-y-2"><label htmlFor="profile-email" className="text-sm font-medium">Email (optional)</label><input id="profile-email" type="email" autoComplete="email" className="field" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <div className="space-y-2"><label htmlFor="profile-country" className="text-sm font-medium">Country (optional)</label><input id="profile-country" autoComplete="country-name" className="field" value={country} onChange={(event) => setCountry(event.target.value)} /></div>
        <p className="text-xs text-muted">No password is needed. Clearing browser data removes this profile; it does not back up your resume.</p>
        {message && <p role="status" className="text-sm text-muted">{message}</p>}
        <div className="flex flex-wrap gap-2"><button type="submit" className="btn btn-primary">Save local profile</button><button type="button" className="btn btn-secondary" onClick={onClose}>Continue editing</button></div>
      </form>
    </Modal>
  );
}
