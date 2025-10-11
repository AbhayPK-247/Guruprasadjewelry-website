import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FilterSection {
  title: string;
  options: string[];
  selected?: string[];
  onToggle?: (value: string) => void;
}

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterSection[];
  onClearAll: () => void;
  onApply: () => void;
}

export const FilterDialog = ({
  open,
  onOpenChange,
  filters,
  onClearAll,
  onApply,
}: FilterDialogProps) => {
  const handleApply = () => {
    onApply();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Filters</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {filters.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                {section.title}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {section.options.map((option) => {
                  const isChecked = section.selected?.includes(option) || false;
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => section.onToggle?.(option)}
                    >
                      <Checkbox checked={isChecked} />
                      <span className="text-sm">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClearAll}
            className="w-full sm:w-auto"
          >
            Clear All
          </Button>
          <Button onClick={handleApply} className="w-full sm:w-auto">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
