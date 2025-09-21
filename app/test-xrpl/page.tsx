import { Navigation } from "@/components/navigation"
import { XRPLTestComponent } from "@/components/xrpl-test-component"

export default function TestXRPLPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">XRPL Integration Test</h1>
            <p className="text-lg text-muted-foreground">
              Verify XRPL testnet connectivity and cross-chain payment functionality
            </p>
          </div>
          
          <XRPLTestComponent />
        </div>
      </div>
    </div>
  )
}
