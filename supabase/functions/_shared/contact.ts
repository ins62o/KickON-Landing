export const contactCategories = [
  { value: 'event', label: '이벤트' },
  { value: 'collaboration', label: '협업' },
  { value: 'app', label: '앱 문의' },
] as const;

export type ContactData = {
  category: typeof contactCategories[number]['value'];
  name: string;
  email: string;
  message: string;
};

export function parseContactData(input: unknown): ContactData {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('문의 내용을 확인해 주세요');
  const value = input as Record<string, unknown>;
  const category = contactCategories.find(option => option.value === value.category);
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const email = typeof value.email === 'string' ? value.email.trim() : '';
  const message = typeof value.message === 'string' ? value.message.trim() : '';
  if (!category) throw new Error('문의 유형을 선택해 주세요');
  if (!name || name.length > 80 || /\p{Cc}/u.test(name)) throw new Error('이름 또는 소속을 확인해 주세요');
  if (email.length > 254 || /\p{Cc}/u.test(email) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new Error('답변받을 이메일 주소를 확인해 주세요');
  if (!message || message.length > 3000 || message.includes('\0')) throw new Error('문의 내용을 3,000자 이내로 입력해 주세요');
  return { category: category.value, name, email, message };
}
