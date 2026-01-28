import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/User/input";

interface PackagesSearchBarProps {
  onSearchChange: (search: string) => void;
  initialValue?: string;
}

export const PackagesSearchBar: React.FC<PackagesSearchBarProps> = ({
  onSearchChange,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
        style={{ color: "#8B6F47" }}
      />
      <Input
        type="text"
        placeholder="Search packages by name, category, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 w-full"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          color: "#7C5A3B",
        }}
      />
    </div>
  );
};





