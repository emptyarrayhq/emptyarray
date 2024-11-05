import React, { useMemo } from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown"
import useGoogleCalendarLogin from "@/src/hooks/useCalendar"
import installGitHub from "@/src/hooks/useInstallGitHub"
import useLinear from "@/src/hooks/useLinear"
import { Integration, User } from "@/src/lib/@types/auth/user"
import { Cal } from "@/src/lib/icons/Calendar"
import { GithubDark } from "@/src/lib/icons/Github"
import { LinearDark } from "@/src/lib/icons/LinearCircle"
import { NotionDark } from "@/src/lib/icons/Notion"
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
  const updateIntegrationStatus = useUserStore(
    (state) => state.updateIntegrationStatus
  )

  const handleConnect = async () => {
    try {
      onConnect()
    } catch (error) {
      console.error("Failed to connect:", error)
    }
  }

  const handleRevoke = async () => {
    try {
      // Update the UI immediately
      updateIntegrationStatus(integration.key, false)

      // Perform the revoke operation
      onRevoke()
    } catch (error) {
      // Revert on error
      console.error("Failed to revoke:", error)
      updateIntegrationStatus(integration.key, true)
    }
  }

  return (
    <div className="flex items-center justify-between rounded-lg p-4 text-foreground">
      <div className="flex items-center space-x-4">
        <div className="flex size-5 items-center justify-center">
          {integration.icon}
        </div>
        <div className="max-w-md text-left">
          <h4 className="text-[13px] font-medium">{integration.name}</h4>
          <p className="text-[13px] text-secondary-foreground">
            {integration.description}
          </p>
        </div>
      </div>
      {connected ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <button
              onClick={handleRevoke}
              className="flex items-center text-secondary-foreground"
            >
              <div className="mr-2 size-1.5 rounded-full bg-green-500"></div>
              <span className="text-[13px]">Connected</span>
              <ChevronDown size={13} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="hover-bg border-border text-primary-foreground ">
            <DropdownMenuItem
              onClick={handleRevoke}
              className="flex cursor-pointer items-center justify-center text-center text-[13px]"
            >
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center rounded-md bg-primary px-4 py-2 text-[13px] text-primary-foreground"
        >
          Connect
          <ChevronRight size={13} className="ml-1" />
        </button>
      )}
    </div>
  )
}

interface IntegrationsProps {
  user: User
}

const Integrations: React.FC<IntegrationsProps> = ({ user }) => {
  const { handleLogin: handleCalLogin, handleRevoke: handleCalRevoke } =
    useGoogleCalendarLogin("/profile")
  const { handleLogin: handleLinearLogin } = useLinear()

  const integrations: Integration[] = useMemo(
    () => [
      {
        key: "googleCalendar",
        icon: <Cal />,
        name: "Google Calendar",
        description:
          "Sync with google calendar to bring daily agenda to march today.",
        handleConnect: handleCalLogin,
        handleRevoke: handleCalRevoke,
      },
      {
        key: "github",
        icon: <GithubDark />,
        name: "Github",
        description:
          "Link your github account to pull assigned issues, PR to your workflow.",
        handleConnect: installGitHub,
        handleRevoke: () => console.log("Github revoke not implemented yet"),
      },
      {
        key: "linear",
        icon: <LinearDark />,
        name: "Linear",
        description: "Bring all your assigned linear issues to march inbox.",
        handleConnect: handleLinearLogin,
        handleRevoke: () => console.log("Linear revoke not implemented yet"),
      },
      {
        key: "notion",
        icon: <NotionDark />,
        name: "Notion",
        description:
          " Pull notion database items into march to actually add in your daily action plan.",
        handleConnect: () =>
          console.log("Notion connection not implemented yet"),
        handleRevoke: () => console.log("Notion revoke not implemented yet"),
      },
    ],
    [handleCalLogin, handleCalRevoke, handleLinearLogin]
  )

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-semibold text-foreground">
        Connect your stack
      </h3>
      <div className="-ml-8 space-y-4">
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
    </div>
  )
}

export default Integrations
