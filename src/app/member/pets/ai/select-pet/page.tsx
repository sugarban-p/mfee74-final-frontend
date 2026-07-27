import { redirect } from 'next/navigation';

export default function SelectPetForAiPage() {
  // 保留舊網址，讓書籤或尚未更新的連結自動進入整合後的 AI 導購頁。
  redirect('/member/pets/ai');
}
