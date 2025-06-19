
// This file remains a Server Component.
// It exports generateStaticParams and renders the client component.
import { ChatUI } from './ChatUI';

// Mock data for generateStaticParams
// In a real app, these would come from a database or dynamic source.
const mockUsernamesForStaticExport = ['AliceWonder', 'BobTheBuilder', 'CharlieCode', 'User1', 'TestUser', 'me'];

export async function generateStaticParams() {
  return mockUsernamesForStaticExport.map((username) => ({
    username: encodeURIComponent(username), // Ensure usernames are URL-safe
  }));
}

// This is the Page component. It receives params from Next.js.
// It should not be a client component if generateStaticParams is used.
export default function ChatPage({ params }: { params: { username: string } }) {
  // The actual UI rendering is deferred to the client component
  return <ChatUI params={params} />;
}
