
// This file is now a Server Component.
// It exports generateStaticParams and renders the client component.
import ModuleDisplayClient from './ModuleDisplayClient';
import { mockLearningModules } from '@/data/learning-modules';

// For static export, if this page is to be pre-rendered for specific moduleIds
export async function generateStaticParams() {
  // Provide a few mock module IDs to pre-render.
  // In a real app, these might come from a build-time data source.
  return mockLearningModules.map(module => ({ moduleId: module.id }));
}

// This is the Page component. It receives params from Next.js.
export default function IndividualModulePage({ params }: { params: { moduleId: string } }) {
  // The actual UI rendering and client-side logic is deferred to the client component
  return <ModuleDisplayClient params={params} />;
}
