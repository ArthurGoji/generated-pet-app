import React from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Download, Share } from "lucide-react"

interface QRCodeGeneratorProps {
  data: string
  title?: string
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  data,
  title = "Pet Care Information",
}) => {
  const downloadQRCode = () => {
    const canvas = document.getElementById(
      "qr-code-canvas"
    ) as HTMLCanvasElement
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "pet-care-qrcode.png"
      link.href = url
      link.click()
    }
  }

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pet Care Information",
          text: "Scan this QR code to access pet care information",
          url: data,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(data)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-muted/50">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="bg-white p-4 rounded-lg mb-4">
          <QRCodeSVG
            id="qr-code-canvas"
            value={data}
            size={200}
            level="H"
            includeMargin={true}
            className="mx-auto"
          />
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={downloadQRCode}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            className="flex-1 flex items-center justify-center gap-2 bg-dark-green hover:bg-dark-green/90"
            onClick={shareQRCode}
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default QRCodeGenerator
