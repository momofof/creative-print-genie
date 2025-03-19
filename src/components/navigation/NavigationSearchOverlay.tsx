
import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NavigationSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const NavigationSearchOverlay = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery
}: NavigationSearchOverlayProps) => {
  // Changed the type to match DialogContent which expects a ref to HTMLDivElement
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Since we now have a div reference instead of dialog, we don't need to call showModal
      // Just let the Dialog component handle the display based on the isOpen prop
    } else {
      // Similarly, we don't need to call close
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={dialogRef}
        className="fixed inset-0 z-50 p-0 bg-white/95 backdrop-blur-sm dark:border-none dark:bg-gray-950"
        style={{
          display: isOpen ? "block" : "none",
        }}
      >
        <DialogHeader className="pt-8 pb-6">
          <DialogTitle className="text-2xl">Rechercher</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Tapez quelque chose..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="outline-none border-0 h-11 focus:ring-0"
          />
          {searchQuery ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          ) : null}
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>T-shirts</span>
              </CommandItem>
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Mugs</span>
              </CommandItem>
              <CommandItem>
                <Search className="mr-2 h-4 w-4" />
                <span>Hoodies</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default NavigationSearchOverlay;
