import React, { useEffect, useState } from "react"
import { getServerStatus } from "../../utils/localStorage"
import { checkServerStatus } from "../../utils/serverStatus"
import { Wifi, WifiOff } from "lucide-react"

const ServerStatusIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [lastChecked, setLastChecked] = useState<number>(0)

  useEffect(() => {
    // Get initial status from localStorage
    const { isOnline: initialStatus, lastChecked: initialLastChecked } =
      getServerStatus()
    setIsOnline(initialStatus)
    setLastChecked(initialLastChecked)

    // Check server status immediately
    checkServerStatus().then((status) => {
      setIsOnline(status)
      setLastChecked(Date.now())
    })

    // Set up interval to check server status
    const intervalId = setInterval(async () => {
      const status = await checkServerStatus()
      setIsOnline(status)
      setLastChecked(Date.now())
    }, 60000) // Check every minute

    return () => clearInterval(intervalId)
  }, [])

  // Format the last checked time
  const formatLastChecked = () => {
    if (lastChecked === 0) return "Never"

    const now = Date.now()
    const diff = now - lastChecked

    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    return `${Math.floor(diff / 86400000)} days ago`
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Server online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-amber-500" />
          <span className="text-amber-700">Offline mode</span>
        </>
      )}
      <span className="text-xs text-gray-500">
        (Checked: {formatLastChecked()})
      </span>
    </div>
  )
}

export default ServerStatusIndicator
