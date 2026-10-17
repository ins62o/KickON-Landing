import { useLayoutEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, X } from 'lucide-react';
import { contactCategories, parseContactData } from '../contact';
import type { ContactData } from '../contact';
import './contact-modal.css';

type ContactModalProps = {
  onClose: () => void;
  onConfirm: (data: ContactData, requestId: string) => Promise<string>;
};

export function ContactModal({ onClose, onConfirm }: ContactModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const attemptRef = useRef<{ payload: string; id: string } | null>(null);
  const sendingRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useLayoutEffect(() => {
    const dialog = dialogRef.current!;
    const previousFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('input[name="name"]')?.focus();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current || feedback) return;
    setError('');
    setFeedback('');
    const form = new FormData(event.currentTarget);
    try {
      const data = parseContactData({
        category: String(form.get('category') ?? ''),
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        message: String(form.get('message') ?? ''),
      });
      const payload = JSON.stringify(data);
      if (attemptRef.current?.payload !== payload) attemptRef.current = { payload, id: crypto.randomUUID() };
      sendingRef.current = true;
      setBusy(true);
      setFeedback(await onConfirm(data, attemptRef.current.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '문의 내용을 확인해 주세요');
    } finally {
      sendingRef.current = false;
      setBusy(false);
    }
  }

  return <dialog className="contact-dialog" ref={dialogRef} aria-labelledby="contact-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <div className="contact-panel">
      <button className="contact-close" type="button" aria-label="문의 창 닫기" onClick={onClose}><X size={20} aria-hidden="true" /></button>
      <div className="contact-symbol"><Mail size={24} strokeWidth={1.5} aria-hidden="true" /></div>
      <h2 id="contact-title">문의하기</h2>
      <form onSubmit={confirm} aria-busy={busy}>
        <fieldset className="contact-form-body" disabled={busy || Boolean(feedback)}>
        <fieldset className="contact-categories"><legend>문의 유형</legend>
          {contactCategories.map(({ value, label }) => <label key={value}><input type="radio" name="category" value={value} defaultChecked={value === 'app'} required /><span>{label}</span></label>)}
        </fieldset>
        <div className="contact-fields">
          <label>이름 또는 소속<input name="name" type="text" autoComplete="name" placeholder="이름 또는 소속을 알려주세요" required maxLength={80} /></label>
          <label>답변받을 이메일<input name="email" type="email" autoComplete="email" placeholder="hello@example.com" required maxLength={254} /></label>
        </div>
        <label className="contact-message">문의 내용<textarea name="message" rows={4} maxLength={3000} placeholder="이벤트나 협업 제안, 앱 이용 중 궁금한 점을 알려주세요" required /></label>
        </fieldset>
        {error ? <p className="contact-error" role="alert">{error}</p> : null}
        {feedback ? <p className="contact-feedback" role="status">{feedback}</p> : null}
        <div className="contact-actions"><button className="contact-cancel" type="button" onClick={onClose}>{feedback ? '닫기' : '취소'}</button>{!feedback ? <button className="contact-confirm" type="submit" disabled={busy}>{busy ? '전송 중…' : '확인'}</button> : null}</div>
      </form>
    </div>
  </dialog>;
}
