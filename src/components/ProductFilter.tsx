"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { X, Filter as FilterIcon } from 'lucide-react';

const availableStyles = ['All', 'Formal', 'Casual', 'Urban', 'Elegant', 'Basic'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = [
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Deep Indigo', hex: '#C8A2C8' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Silver', hex: '#C0C0C0' },
];

export function ProductFilter() {
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColors(prev =>
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };
  
  const handleResetFilters = () => {
    setSelectedStyle('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 200]);
  };

  // In a real app, these changes would trigger a re-fetch or client-side filter of products.
  // console.log({ selectedStyle, selectedSizes, selectedColors, priceRange });

  return (
    <Card className="shadow-md sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center"><FilterIcon className="mr-2 h-5 w-5" /> Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs">
            <X className="mr-1 h-3 w-3" /> Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="style-filter" className="text-sm font-medium">Style</Label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger id="style-filter" className="w-full mt-1">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {availableStyles.map(style => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Size</h4>
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map(size => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeChange(size)}
                />
                <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">{size}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Color</h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <button
                key={color.name}
                title={color.name}
                onClick={() => handleColorChange(color.name)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  selectedColors.includes(color.name) ? 'ring-2 ring-offset-2 ring-primary' : 'border-muted'
                }`}
                style={{ backgroundColor: color.hex }}
                aria-pressed={selectedColors.includes(color.name)}
              >
                <span className="sr-only">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="mt-2">
             <Slider
              defaultValue={[priceRange[0], priceRange[1]]}
              min={0}
              max={500} // Example max price
              step={10}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
