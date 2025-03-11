import React, { useEffect, useState } from "react"
import { checkServerStatus } from "../../utils/serverStatus"
import { getPendingChangesCount } from "../../utils/offlineSync"
import { syncPendingChanges } from "../../utils/syncService"
import { AlertCircle, CloudOff, RefreshCw } from "lucide-react"

const OfflineNotification: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingChanges, setPendingChanges] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)

  // Check server status and pending changes
  const checkStatus = async () => {
    const online = await checkServerStatus()
    setIsOnline(online)
    setPendingChanges(getPendingChangesCount())
  }

  // Initial check and periodic checks
  useEffect(() => {
    checkStatus()

    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    // Listen for online/offline events
    const handleOnline = () => {
      checkStatus()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Handle sync button click
  const handleSync = async () => {
    if (!isOnline || pendingChanges === 0) return

    setIsSyncing(true)
    try {
      await syncPendingChanges()
      setPendingChanges(getPendingChangesCount())
    } catch (error) {
      console.error("Error syncing changes:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  // Don't show anything if online and no pending changes
  if (isOnline && pendingChanges === 0) {
    return null
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
        isOnline ? "bg-blue-50 text-blue-800" : "bg-red-50 text-red-800"
      }`}
    >
      {isOnline ? (
        <>
          <AlertCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">
              {pendingChanges} {pendingChanges === 1 ? "change" : "changes"}{" "}
              pending
            </p>
            <p className="text-sm">
              Your changes will be synced when you're online
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="ml-2 p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
            title="Sync changes"
          >
            <RefreshCw
              className={`h-5 w-5 ${isSyncing ? "animate-spin" : ""}`}
            />
          </button>
        </>
      ) : (
        <>
          <CloudOff className="h-5 w-5" />
          <div>
            <p className="font-medium">You're offline</p>
            <p className="text-sm">
              {pendingChanges > 0
                ? `${pendingChanges} ${
                    pendingChanges === 1 ? "change" : "changes"
                  } will sync when you're back online`
                : "Changes will be saved locally"}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default OfflineNotification

// Add this to your global CSS or tailwind.config.js
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in {
//   animation: fadeIn 0.3s ease-out forwards;
// }
