import { AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Disclaimer({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className={className}>
          <Info className="h-4 w-4" />
          Disclaimer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            Disclaimer
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm text-foreground">
          This is a fork of{" "}
          <a
            href="https://github.com/pcaversaccio"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4"
          >
            @pcaversaccio
          </a>{" "}
          script that introduces an UI on top. This tool is intended to be used as playground and proof of concept and by
          any means it is ready for production use since it has not undergone any security assessment.
          <br /><br />
          While we tried to keep dependencies as minimal as possible, it is advised to always do your own research and{" "}
          <a 
            href="#" 
            className="font-medium underline underline-offset-4"
          >
            run the tool locally
          </a>{" "}
          whenever possible.
          <br /><br />
          OpenZeppelin doesn't take responsibility for any incident resulting from the use of this tool.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}