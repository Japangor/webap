'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  BarChart,
  CheckSquare,
  Flag,
  Home,
  SquareStack,
  Users,
  LifeBuoy,
  Cog,
  Menu,
  Sun,
  Moon,
  LayoutDashboardIcon,
  CarIcon,
  IceCream2Icon,
  InspectIcon,
  FileIcon,
  DatabaseZapIcon,
} from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useTheme } from 'next-themes'

import * as Input from '@/components/components/Input'

import { NavItem } from './NavItem'
import { UsedSpaceWidget } from './UsedSpaceWidget'
import { Profile } from './Profile'
import { Button } from '../Button'
import Logo from '@/components/core/brand/Logo'
import { DoneIcon, LowIcon, PersonIcon } from '@/components/logos/command-bar'

export function Sidebar() {
  const [isMounted, setIsMounted] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  const handleToggleTheme = () => {
    if (isDarkMode) {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Collapsible.Root className="fixed left-0 right-0 top-0 z-20 flex flex-col gap-6 border-b border-zinc-200 bg-white p-4 data-[state=open]:bottom-0 dark:border-zinc-800 dark:bg-zinc-900 lg:right-auto  lg:w-80 lg:border-r lg:px-5 lg:py-8 lg:data-[state=closed]:bottom-0">
      <div className="flex items-center justify-between">
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button variant="ghost">
            <Menu className="h-6 w-6" />
          </Button>
        </Collapsible.Trigger>
      </div>
      <img src="/logo3.png" alt="Your Image" height="80" width="100" />
      <Collapsible.Content
        forceMount
        className="flex flex-1 flex-col gap-6 data-[state=closed]:hidden lg:data-[state=closed]:flex"
      >
      

        <nav className="space-y-0.5">
        <NavItem title="Home" icon={FileIcon} />
<NavItem title="Schemes" icon={LayoutDashboardIcon} />
<NavItem title="News" icon={DoneIcon} />
<NavItem title="Resources" icon={LowIcon} />
<NavItem title="Contact" icon={PersonIcon} />


        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <nav className="space-y-0.5">
          
            <NavItem 
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              icon={isDarkMode ? Sun : Moon}
              showExpandIcon={false}
              onClick={handleToggleTheme}
            />
          </nav>

          <UsedSpaceWidget />

          <div className="h-px bg-zinc-200 dark:bg-zinc-700" />

          <Profile />
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}