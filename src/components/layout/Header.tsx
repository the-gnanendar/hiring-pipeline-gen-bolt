
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ats-600 text-[10px] text-white">
            3
          </span>
        </Button>
        <Button className="gap-1 bg-ats-600 hover:bg-ats-700">
          <Plus className="h-4 w-4" />
          <span>New</span>
        </Button>
      </div>
    </header>
  );
}
