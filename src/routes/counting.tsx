import BillCounter from '@/components/coins/counter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/counting')({
  component: Index,
})

function Index() {
  return (
    <BillCounter />
  )
}