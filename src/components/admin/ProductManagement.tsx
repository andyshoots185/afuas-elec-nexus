import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { formatUGX } from '@/utils/formatUGX';
import { toast } from 'sonner';
import { ImageUpload } from './ImageUpload';

interface Product {
  id: string;
  name: string;
  description: string;
  price_ugx: number;
  category_id: string;
  brand_id: string;
  stock_quantity: number;
  status: string;
  sku: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_ugx: '',
    category_id: '',
    brand_id: '',
    stock_quantity: '',
    status: 'active',
    sku: '',
    slug: '',
    image_url: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('id, name'),
        supabase.from('brands').select('id, name')
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (brandsRes.data) setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price_ugx: parseInt(formData.price_ugx),
        category_id: formData.category_id,
        brand_id: formData.brand_id,
        stock_quantity: parseInt(formData.stock_quantity),
        status: formData.status,
        sku: formData.sku,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        // Log admin action
        await supabase.rpc('log_admin_action', {
          p_action: 'update_product',
          p_resource_type: 'product',
          p_resource_id: editingProduct.id,
          p_details: { product_name: formData.name }
        });
        
        toast.success('Product updated successfully');
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        
        if (error) throw error;
        productId = data.id;
        
        // Log admin action
        await supabase.rpc('log_admin_action', {
          p_action: 'create_product',
          p_resource_type: 'product',
          p_resource_id: productId,
          p_details: { product_name: formData.name }
        });
        
        toast.success('Product created successfully - now visible on homepage!');
      }

      // Save product image if uploaded
      if (formData.image_url && productId) {
        await supabase.from('product_images').insert([{
          product_id: productId,
          image_url: formData.image_url,
          sort_order: 0
        }]);
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price_ugx: product.price_ugx.toString(),
      category_id: product.category_id,
      brand_id: product.brand_id || '',
      stock_quantity: product.stock_quantity?.toString() || '0',
      status: product.status,
      sku: product.sku || '',
      slug: product.slug || '',
      image_url: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const product = products.find(p => p.id === productId);
      
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action: 'delete_product',
        p_resource_type: 'product',
        p_resource_id: productId,
        p_details: { product_name: product?.name }
      });
      
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_ugx: '',
      category_id: '',
      brand_id: '',
      stock_quantity: '',
      status: 'active',
      sku: '',
      slug: '',
      image_url: ''
    });
    setEditingProduct(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || 'Unknown';
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
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Add, edit, and manage your products</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update product information' : 'Create a new product for your store'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Product Image</Label>
                  <ImageUpload
                    onImagesUploaded={(urls) => setFormData(prev => ({ ...prev, image_url: urls[0] || '' }))}
                  />
                  {formData.image_url && (
                    <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Product SKU"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_ugx">Price (UGX)</Label>
                    <Input
                      id="price_ugx"
                      name="price_ugx"
                      type="number"
                      value={formData.price_ugx}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select value={formData.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand_id">Brand</Label>
                    <Select value={formData.brand_id} onValueChange={(value) => handleSelectChange('brand_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="product-slug"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update Product' : 'Create Product'}
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
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getCategoryName(product.category_id)}</TableCell>
                <TableCell>{getBrandName(product.brand_id)}</TableCell>
                <TableCell>{formatUGX(product.price_ugx)}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.status === 'active' ? 'default' : 
                           product.status === 'draft' ? 'secondary' : 'destructive'}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
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