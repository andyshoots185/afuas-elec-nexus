import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Store, Mail, Phone, MapPin, Clock } from 'lucide-react';

export function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState({
    name: "Afuwah's Electronics",
    email: 'support@afuwahs.com',
    phone: '+256 XXX XXXXXX',
    address: 'Kampala, Uganda',
    description: 'Your trusted electronics store',
    businessHours: '9:00 AM - 6:00 PM'
  });

  const handleSave = () => {
    // In a real app, this would save to database
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>Update your store details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              value={storeSettings.name}
              onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={storeSettings.description}
              onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={storeSettings.email}
                onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="phone"
                value={storeSettings.phone}
                onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="address"
              value={storeSettings.address}
              onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Business Hours
            </Label>
            <Input
              id="hours"
              value={storeSettings.businessHours}
              onChange={(e) => setStoreSettings({ ...storeSettings, businessHours: e.target.value })}
            />
          </div>

          <Button onClick={handleSave} className="w-full md:w-auto">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
