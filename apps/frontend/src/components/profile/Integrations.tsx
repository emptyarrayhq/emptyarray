import React, { useMemo } from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown"
import { useAuth } from "@/src/contexts/AuthContext"
import useGoogleCalendarLogin from "@/src/hooks/useCalendar"
import useGitHubLogin from "@/src/hooks/useGithubLogin"
import installGitHub from "@/src/hooks/useInstallGitHub"
import useLinear from "@/src/hooks/useLinear"
import { Integration, User } from "@/src/lib/@types/auth/user"
import { Cal } from "@/src/lib/icons/Calendar"
import { GithubDark } from "@/src/lib/icons/Github"
import { LinearDark } from "@/src/lib/icons/LinearCircle"
import useUserStore from "@/src/lib/store/user.store"

interface IntegrationItemProps {
  integration: Integration
  connected: boolean
  onConnect: () => void
  onRevoke: () => void
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({
  integration,
  connected,
  onConnect,
  onRevoke,
}) => {
  return (
    <div className="flex items-center py-2.5">
      <div className="flex items-center min-w-0 flex-1">
        <div className="w-6 h-6 flex items-center justify-center mr-3">
          {integration.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <h3 className="text-sm font-medium text-gray-900 whitespace-nowrap">{integration.name}</h3>
            <span className="text-xs text-gray-500 truncate ml-2 mr-4">{integration.description}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        {connected ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-xs text-gray-500 hover:text-gray-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              <span>Connected</span>
              <ChevronDown size={14} className="ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={onRevoke}
                className="text-red-600 hover:text-red-700"
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Connect
            <ChevronRight size={14} className="ml-0.5" />
          </button>
        )}
      </div>
    </div>
  )
}

interface IntegrationsProps {
  user: User
}

const Integrations: React.FC<IntegrationsProps> = ({ user }) => {
  const { session } = useAuth()
  const { handleLogin: handleCalLogin, handleRevoke: handleCalRevoke } =
    useGoogleCalendarLogin("/profile")
  const { handleLogin: handleLinearLogin, handleRevoke: handleLinearRevoke } =
    useLinear()
  const { handleRevoke: handleGithubRevoke } = useGitHubLogin(session)

  const integrations: Integration[] = useMemo(
    () => [
      {
        key: "googleCalendar",
        icon: <Cal className="w-4 h-4" />,
        name: "Google Calendar",
        description: "Sync agenda",
        handleConnect: handleCalLogin,
        handleRevoke: handleCalRevoke,
      },
      {
        key: "github",
        icon: <GithubDark className="w-4 h-4" />,
        name: "Github",
        description: "Issues & PRs",
        handleConnect: installGitHub,
        handleRevoke: handleGithubRevoke,
      },
      {
        key: "linear",
        icon: <LinearDark className="w-4 h-4" />,
        name: "Linear",
        description: "Tasks",
        handleConnect: handleLinearLogin,
        handleRevoke: handleLinearRevoke,
      },
    ],
    [
      handleCalLogin,
      handleCalRevoke,
      handleLinearLogin,
      handleLinearRevoke,
      handleGithubRevoke,
    ]
  )

  return (
    <div className="divide-y divide-gray-100">
      {integrations.map((integration) => (
        <IntegrationItem
          key={integration.key}
          integration={integration}
          connected={user.integrations?.[integration.key]?.connected ?? false}
          onConnect={integration.handleConnect}
          onRevoke={integration.handleRevoke}
        />
      ))}
    </div>
  )
}

export default Integrations
