import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  featured_category: boolean;
  flash_sale_category: boolean;
  is_active: boolean;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, featured_category, flash_sale_category, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (
    categoryId: string,
    field: 'featured_category' | 'flash_sale_category',
    value: boolean
  ) => {
    setUpdating(categoryId);
    try {
      const { error } = await supabase
        .from('categories')
        .update({ [field]: value })
        .eq('id', categoryId);

      if (error) throw error;

      setCategories(prev =>
        prev.map(cat =>
          cat.id === categoryId ? { ...cat, [field]: value } : cat
        )
      );

      toast({
        title: "Success",
        description: `Category ${field === 'featured_category' ? 'featured status' : 'flash sale status'} updated`,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle>Category Display Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`featured-${category.id}`}
                        checked={category.featured_category}
                        onCheckedChange={(checked) =>
                          updateCategory(category.id, 'featured_category', checked)
                        }
                        disabled={updating === category.id}
                      />
                      <Label htmlFor={`featured-${category.id}`} className="cursor-pointer">
                        Featured
                      </Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`flash-${category.id}`}
                        checked={category.flash_sale_category}
                        onCheckedChange={(checked) =>
                          updateCategory(category.id, 'flash_sale_category', checked)
                        }
                        disabled={updating === category.id}
                      />
                      <Label htmlFor={`flash-${category.id}`} className="cursor-pointer">
                        Flash Sale
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </div>
  );
}
