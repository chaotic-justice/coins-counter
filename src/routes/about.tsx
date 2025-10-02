import { createFileRoute } from '@tanstack/react-router'
import { useTranslations } from 'gt-react';

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const d = useTranslations();

  return <div className="container p-4 py-8 mx-auto">
    <div>
      {d('greetings.hello')}
    </div>
  </div>
}