
// This file remains a Server Component (or can be if not marked 'use client')
// It exports generateStaticParams and renders the client component.
import { ChatUI } from './ChatUI';

// Mock data for generateStaticParams
// In a real app, these would come from a database or dynamic source.
const mockUsernames = ['AliceWonder', 'BobTheBuilder', 'CharlieCode', 'User1', 'TestUser'];

export async function generateStaticParams() {
  return mockUsernames.map((username) => ({
    username: encodeURIComponent(username),
  }));
}

export default function ChatPage({ params }: { params: { username: string } }) {
  // The actual UI rendering is deferred to the client component
  return <ChatUI params={params} />;
}
