import { Button } from '@/components/components/Button'
import { LogOut } from 'lucide-react'

export function Profile() {
  return (
    <div className="grid grid-cols-profile items-center gap-3">
    
      <div className="flex flex-col truncate">
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-100">
        </span>
        <span className="truncate text-sm text-zinc-500 dark:text-zinc-400">
        </span>
      </div>
      <Button type="button" variant="ghost">
        <LogOut className="h-5 w-5 text-zinc-500" />
      </Button>
    </div>
  )
}
