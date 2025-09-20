"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

export interface FilterField {
  id: string;
  name: string;
  label: string;
  type: "text" | "select" | "number" | "date";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface GenericFiltersProps {
  title?: string;
  fields: FilterField[];
  onFiltersChange: (filters: Record<string, string>) => void;
  initialFilters?: Record<string, string>;
  className?: string;
}

export function GenericFilters({
  title = "Filtros",
  fields,
  onFiltersChange,
  initialFilters = {},
  className = "",
}: GenericFiltersProps) {
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = useCallback(
    (fieldId: string, value: string) => {
      const newFilters = { ...filters, [fieldId]: value };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    const clearedFilters = Object.keys(filters).reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as Record<string, string>
    );
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [filters, onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const renderField = (field: FilterField) => {
    const value = filters[field.id] || "";

    switch (field.type) {
      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={value}
              onValueChange={(newValue) =>
                handleFilterChange(field.id, newValue)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={field.placeholder || "Selecione..."}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="date"
              value={value}
              onChange={(e) => handleFilterChange(field.id, e.target.value)}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id={field.id}
                type="text"
                placeholder={field.placeholder}
                value={value}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Hook para gerenciar filtros
export function useFilters(initialFilters: Record<string, string> = {}) {
  const [filters, setFilters] =
    useState<Record<string, string>>(initialFilters);

  const updateFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
