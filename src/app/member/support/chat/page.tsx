import { Suspense } from 'react';
import ChatClient from '../../../support/chat/ChatClient';

export const dynamic = 'force-dynamic';

export default function MemberSupportChatPage() {
  return (
    <Suspense fallback={null}>
      <ChatClient />
    </Suspense>
  );
}
