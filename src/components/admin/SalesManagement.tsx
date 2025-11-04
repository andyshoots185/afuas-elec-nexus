import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Database } from '@/integrations/supabase/types';

type Promotion = Database['public']['Tables']['promotions']['Row'];

export function SalesManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    value: '',
    type: 'percentage',
    code: '',
    starts_at: '',
    expires_at: '',
    is_active: true,
    usage_limit: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promotionData = {
        name: formData.name,
        description: formData.description,
        value: parseFloat(formData.value),
        type: formData.type,
        code: formData.code.toUpperCase(),
        starts_at: formData.starts_at || null,
        expires_at: formData.expires_at || null,
        is_active: formData.is_active,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null
      };

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingPromotion.id);

        if (error) throw error;
        toast.success('Promotion updated successfully');
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([promotionData]);

        if (error) throw error;
        toast.success('Promotion created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchPromotions();
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast.error(error.message || 'Failed to save promotion');
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      name: promotion.name,
      description: promotion.description || '',
      value: promotion.value?.toString() || '',
      type: promotion.type || 'percentage',
      code: promotion.code || '',
      starts_at: promotion.starts_at?.split('T')[0] || '',
      expires_at: promotion.expires_at?.split('T')[0] || '',
      is_active: promotion.is_active ?? true,
      usage_limit: promotion.usage_limit?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionId);

      if (error) throw error;
      toast.success('Promotion deleted successfully');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      toast.error(error.message || 'Failed to delete promotion');
    }
  };

  const toggleActive = async (promotionId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !currentStatus })
        .eq('id', promotionId);

      if (error) throw error;
      toast.success('Promotion status updated');
      fetchPromotions();
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      toast.error('Failed to update promotion');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      value: '',
      type: 'percentage',
      code: '',
      starts_at: '',
      expires_at: '',
      is_active: true,
      usage_limit: ''
    });
    setEditingPromotion(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales & Offers Management</CardTitle>
            <CardDescription>Create and manage promotional campaigns</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Create Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
                </DialogTitle>
                <DialogDescription>
                  Set up discounts and promotional offers
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Discount Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SUMMER2024"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="starts_at">Start Date</Label>
                    <Input
                      id="starts_at"
                      type="date"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires_at">End Date</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit (optional)</Label>
                  <Input
                    id="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Valid Period</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell>
                  {promotion.code && (
                    <code className="px-2 py-1 bg-muted rounded">{promotion.code}</code>
                  )}
                </TableCell>
                <TableCell>{promotion.value}{promotion.type === 'percentage' ? '%' : ' UGX'}</TableCell>
                <TableCell className="text-sm">
                  {promotion.starts_at && new Date(promotion.starts_at).toLocaleDateString()}
                  {' - '}
                  {promotion.expires_at && new Date(promotion.expires_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {promotion.used_count || 0} / {promotion.usage_limit || '∞'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={promotion.is_active ? 'default' : 'secondary'}>
                      {promotion.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={promotion.is_active ?? false}
                      onCheckedChange={() => toggleActive(promotion.id, promotion.is_active)}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promotion)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promotion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
