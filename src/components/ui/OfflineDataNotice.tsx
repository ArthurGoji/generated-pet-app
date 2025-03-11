import React from "react"
import { Database } from "lucide-react"

interface OfflineDataNoticeProps {
  entityType: string
}

/**
 * Component to display when data is being loaded from local storage in offline mode
 */
const OfflineDataNotice: React.FC<OfflineDataNoticeProps> = ({
  entityType,
}) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return null
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm">
      <Database className="h-4 w-4 text-amber-500" />
      <span className="text-amber-800">
        Viewing {entityType} from local storage (offline mode)
      </span>
    </div>
  )
}

export default OfflineDataNotice
