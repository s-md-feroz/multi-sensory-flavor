
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Candy, Cookie, Lollipop } from 'lucide-react';
import { TasteCategory, SmellCategory, TextureCategory } from '@/utils/flavor';

interface FilterPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFilters: {
    taste: TasteCategory[];
    smell: SmellCategory[];
    texture: TextureCategory[];
  };
  handleToggleFilter: (category: 'taste' | 'smell' | 'texture', value: any) => void;
  tasteCategories: { value: TasteCategory; label: string; color: string }[];
  smellCategories: { value: SmellCategory; label: string }[];
  textureCategories: { value: TextureCategory; label: string }[];
}

const FilterPanel = ({
  activeTab,
  setActiveTab,
  selectedFilters,
  handleToggleFilter,
  tasteCategories,
  smellCategories,
  textureCategories
}: FilterPanelProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="taste" className="flex gap-1 items-center">
          <Candy className="h-4 w-4" />
          <span>Taste</span>
        </TabsTrigger>
        <TabsTrigger value="smell" className="flex gap-1 items-center">
          <Cookie className="h-4 w-4" />
          <span>Smell</span>
        </TabsTrigger>
        <TabsTrigger value="texture" className="flex gap-1 items-center">
          <Lollipop className="h-4 w-4" />
          <span>Texture</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="taste">
        <h3 className="font-heading font-bold mb-3">Select Taste Profiles</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {tasteCategories.map(category => (
            <Badge
              key={category.value}
              variant={selectedFilters.taste.includes(category.value) ? "default" : "outline"}
              className={`cursor-pointer ${selectedFilters.taste.includes(category.value) ? category.color : ''}`}
              onClick={() => handleToggleFilter('taste', category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="smell">
        <h3 className="font-heading font-bold mb-3">Select Aroma Profiles</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {smellCategories.map(category => (
            <Badge
              key={category.value}
              variant={selectedFilters.smell.includes(category.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleFilter('smell', category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="texture">
        <h3 className="font-heading font-bold mb-3">Select Texture Profiles</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {textureCategories.map(category => (
            <Badge
              key={category.value}
              variant={selectedFilters.texture.includes(category.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleFilter('texture', category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default FilterPanel;
