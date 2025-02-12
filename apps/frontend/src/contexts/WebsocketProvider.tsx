import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

import { getSession } from "../lib/server/actions/sessions"
import { useCycleItemStore } from "../lib/store/cycle.store"

const WEBSOCKET_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "localhost://8080"

interface WebSocketContextType {
  isConnected: boolean
  messages: any[]
  sendMessage: (message: any, isBinary?: boolean) => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

let socketInstance: WebSocket | null = null

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const { handleWebSocketMessage } = useCycleItemStore()

  useEffect(() => {
    const initializeWebSocket = async () => {
      if (socketInstance) {
        return
      }

      try {
        const session = await getSession()
        socketInstance = new WebSocket(WEBSOCKET_URL, session)

        socketInstance.onopen = () => {
          setIsConnected(true)
        }

        socketInstance.onmessage = async (event) => {
          try {
            let message
            if (
              event.data instanceof Blob ||
              event.data instanceof ArrayBuffer
            ) {
              const arrayBuffer =
                event.data instanceof Blob
                  ? await event.data.arrayBuffer()
                  : event.data
              const textDecoder = new TextDecoder("utf-8")
              const decodedMessage = textDecoder.decode(arrayBuffer)
              message = JSON.parse(decodedMessage)
            } else {
              message = JSON.parse(event.data.toString())
            }

            if (message?.type === "linear" && message?.item) {
              handleWebSocketMessage(message)
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error)
          }
        }

        socketInstance.onclose = () => {
          setIsConnected(false)
          socketInstance = null
        }

        socketInstance.onerror = (error) => {
          console.error("WebSocket error:", error)
        }
      } catch (error) {
        console.error("Error initializing WebSocket:", error)
      }
    }

    initializeWebSocket()

    const pingInterval = setInterval(() => {
      if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
        socketInstance.send(JSON.stringify({ type: "ping" }))
      }
    }, 30000)

    return () => {
      if (socketInstance) {
        socketInstance.close()
        socketInstance = null
      }
      clearInterval(pingInterval)
    }
  }, [handleWebSocketMessage])

  const sendMessage = (message: any, isBinary: boolean = false) => {
    if (socketInstance && socketInstance.readyState === WebSocket.OPEN) {
      const msgToSend = isBinary
        ? new TextEncoder().encode(JSON.stringify(message))
        : JSON.stringify(message)
      socketInstance.send(msgToSend)
    } else {
      console.warn("Cannot send message, WebSocket is not open")
    }
  }

  const value = {
    isConnected,
    messages,
    sendMessage,
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
