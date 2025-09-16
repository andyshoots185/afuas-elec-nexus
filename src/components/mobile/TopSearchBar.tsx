import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TopSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-background border-b border-border px-4 py-3 md:hidden">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="I am searching for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-12 h-10 rounded-lg border-2 border-red-200 focus:border-red-500 text-sm"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1 rounded-lg h-8 w-8 p-0 bg-red-500 hover:bg-red-600"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}