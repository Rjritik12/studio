
// This file is now a Server Component.
// It exports generateStaticParams and renders the client component.
import UserProfileClient from './UserProfileClient';

// For static export, if this page is to be pre-rendered for specific usernames
export async function generateStaticParams() {
  // Provide a few mock usernames to pre-render.
  // In a real app, these might come from a build-time data source or be empty if
  // all profile pages are expected to be dynamically generated.
  return [
    { username: 'Alice' },
    { username: 'BobCoder' },
    { username: 'TechGuru' },
    { username: encodeURIComponent('me') }, // Special "me" slug for authenticated user's own profile
  ];
}

// This is the Page component. It receives params from Next.js.
export default function UserProfilePage({ params }: { params: { username: string } }) {
  // The actual UI rendering and client-side logic is deferred to the client component
  return <UserProfileClient params={params} />;
}
    