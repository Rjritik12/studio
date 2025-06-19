
// This file remains a Server Component.
// It exports generateStaticParams and renders the client component.
import GroupDetailClient from './GroupDetailClient';

// For static export, if this page is to be pre-rendered for specific groupIds
export async function generateStaticParams() {
  // Provide a few mock group IDs to pre-render.
  // In a real app, these might come from a build-time data source or be empty if
  // all group pages are expected to be dynamically generated on the client or server.
  return [
    { groupId: 'group-jee-physics-msg' },
    { groupId: 'group-neet-biology-msg' },
    { groupId: 'group-class10-math-msg' },
    // Add more mock group IDs if needed for pre-rendering
  ];
}

// This is the Page component. It receives params from Next.js.
export default function GroupDetailPage({ params }: { params: { groupId: string } }) {
  // The actual UI rendering is deferred to the client component
  return <GroupDetailClient params={params} />;
}
    
