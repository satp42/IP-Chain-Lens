"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"
import type { SearchFilters } from "@/lib/story/types"

interface FilterPanelProps {
  onFilterChange: (filters: SearchFilters) => void
  onClear: () => void
}

export function FilterPanel({ onFilterChange, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({})
  const [depthRange, setDepthRange] = useState([0, 10])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClear = () => {
    setFilters({})
    setDepthRange([0, 10])
    onClear()
  }

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length

  return (
    <div className="w-full">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="mt-4 space-y-6 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Creator Address */}
            <div className="space-y-2">
              <Label htmlFor="creator">Creator Address</Label>
              <Input
                id="creator"
                placeholder="0x..."
                value={filters.creator || ""}
                onChange={(e) => handleFilterChange("creator", e.target.value)}
              />
            </div>

            {/* License Type */}
            <div className="space-y-2">
              <Label htmlFor="licenseType">License Type</Label>
              <Select
                value={filters.licenseType || ""}
                onValueChange={(value) => handleFilterChange("licenseType", value)}
              >
                <SelectTrigger id="licenseType">
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  <SelectItem value="commercial">Commercial Use</SelectItem>
                  <SelectItem value="non-commercial">Non-Commercial</SelectItem>
                  <SelectItem value="derivatives">Derivatives Allowed</SelectItem>
                  <SelectItem value="no-derivatives">No Derivatives</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Usage Category */}
            <div className="space-y-2">
              <Label htmlFor="usageCategory">Usage Category</Label>
              <Select
                value={filters.usageCategory || ""}
                onValueChange={(value) => handleFilterChange("usageCategory", value)}
              >
                <SelectTrigger id="usageCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="art">Art & Design</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="video">Video & Film</SelectItem>
                  <SelectItem value="text">Written Content</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Derivative Depth Range */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label>Derivative Depth Range: {depthRange[0]} - {depthRange[1]}</Label>
              <Slider
                min={0}
                max={20}
                step={1}
                value={depthRange}
                onValueChange={(value) => {
                  setDepthRange(value)
                  handleFilterChange("minDerivativeDepth", value[0])
                  handleFilterChange("maxDerivativeDepth", value[1])
                }}
                className="w-full"
              />
            </div>

            {/* Search Query */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="searchQuery">Keyword Search</Label>
              <Input
                id="searchQuery"
                placeholder="Search in metadata, descriptions..."
                value={filters.searchQuery || ""}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleClear} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


