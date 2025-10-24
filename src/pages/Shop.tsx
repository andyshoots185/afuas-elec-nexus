import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/shared/ProductCard";
import { products, categories } from "@/data/products";

type ViewMode = "grid" | "list";
type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all" // ✅ default to "all"
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands") ? searchParams.get("brands")!.split(",") : []
  );
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("priceMin") || 0),
    Number(searchParams.get("priceMax") || 1500000),
  ]);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "newest"
  );
  const [inStockOnly, setInStockOnly] = useState(!!searchParams.get("inStock"));

  // Get unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (selectedBrands.length > 0)
      params.set("brands", selectedBrands.join(","));
    if (priceRange[0] > 0 || priceRange[1] < 1500000) {
      params.set("priceMin", priceRange[0].toString());
      params.set("priceMax", priceRange[1].toString());
    }
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (inStockOnly) params.set("inStock", "true");

    setSearchParams(params);
  }, [
    searchQuery,
    selectedCategory,
    selectedBrands,
    priceRange,
    sortBy,
    inStockOnly,
    setSearchParams,
  ]);

  // Sync states from URL params
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "all");
    const brandsParam = searchParams.get("brands");
    setSelectedBrands(brandsParam ? brandsParam.split(",") : []);
    const minPrice = Number(searchParams.get("priceMin") || 0);
    const maxPrice = Number(searchParams.get("priceMax") || 1500000);
    setPriceRange([minPrice, maxPrice]);
    setSortBy((searchParams.get("sort") as SortOption) || "newest");
    setInStockOnly(!!searchParams.get("inStock"));
  }, [searchParams]);

  // ✅ Filtering logic
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default: // newest
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return filtered;
  }, [
    searchQuery,
    selectedCategory,
    selectedBrands,
    priceRange,
    sortBy,
    inStockOnly,
  ]);

  // Reset filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrands([]);
    setPriceRange([0, 1500000]);
    setSortBy("newest");
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "all",
    selectedBrands.length > 0,
    priceRange[0] > 0 || priceRange[1] < 1500000,
    inStockOnly,
  ].filter(Boolean).length;

  const FiltersSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold mb-3">Search</h3>
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <Separator />
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all"
              checked={selectedCategory === "all"}
              onCheckedChange={() => setSelectedCategory("all")}
            />
            <label htmlFor="all" className="text-sm">
              All Categories
            </label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategory === category.id}
                onCheckedChange={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? "all" : category.id
                  )
                }
              />
              <label htmlFor={category.id} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(
                      selectedBrands.filter((b) => b !== brand)
                    );
                  }
                }}
              />
              <label htmlFor={brand} className="text-sm">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1500000}
          min={0}
          step={1000}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>UGX {priceRange[0].toLocaleString()}</span>
          <span>UGX {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="in-stock"
          checked={inStockOnly}
          onCheckedChange={(checked) => setInStockOnly(!!checked)}
        />
        <label htmlFor="in-stock" className="text-sm">
          In Stock Only
        </label>
      </div>

      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto container-padding py-6">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Shop</span>
            {selectedCategory !== "all" && (
              <>
                <span className="mx-2">/</span>
                <span className="capitalize">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {selectedCategory !== "all"
                  ? categories.find((c) => c.id === selectedCategory)?.name ||
                    "Shop"
                  : "All Products"}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none border-l">
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filters */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 pb-6">
                    <FiltersSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
              <FiltersSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6"
                    : "space-y-4"
                }>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    className={viewMode === "list" ? "flex" : ""}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or clearing some filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// import { useState, useEffect, useMemo } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import {
//   Filter,
//   Grid,
//   List,
//   SlidersHorizontal,
//   Search,
//   ChevronDown,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Slider } from "@/components/ui/slider";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ProductCard } from "@/components/shared/ProductCard";
// import { products, categories } from "@/data/products";

// // import React, { useState } from "react";
// // import { products, categories } from "../data/products";
// // import ProductCard from "../components/ProductCard";

// type ViewMode = "grid" | "list";
// type SortOption = "newest" | "price-low" | "price-high" | "rating" | "popular";

// export default function Shop() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [viewMode, setViewMode] = useState<ViewMode>("grid");
//   const [filtersOpen, setFiltersOpen] = useState(false);

//   // Filter states
//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("search") || ""
//   );
//   const [selectedCategory, setSelectedCategory] = useState(
//     searchParams.get("category") || ""
//   );
//   const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState([0, 150000]);
//   const [sortBy, setSortBy] = useState<SortOption>("newest");
//   const [inStockOnly, setInStockOnly] = useState(false);

//   // Get unique brands
//   const brands = useMemo(() => {
//     return Array.from(new Set(products.map((p) => p.brand))).sort();
//   }, []);

//   // Update URL when filters change
//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (searchQuery) params.set("search", searchQuery);
//     if (selectedCategory) params.set("category", selectedCategory);
//     if (selectedBrands.length > 0)
//       params.set("brands", selectedBrands.join(","));
//     if (priceRange[0] > 0 || priceRange[1] < 1500000) {
//       params.set("priceMin", priceRange[0].toString());
//       params.set("priceMax", priceRange[1].toString());
//     }
//     if (sortBy !== "newest") params.set("sort", sortBy);
//     if (inStockOnly) params.set("inStock", "true");

//     setSearchParams(params);
//   }, [
//     searchQuery,
//     selectedCategory,
//     selectedBrands,
//     priceRange,
//     sortBy,
//     inStockOnly,
//     setSearchParams,
//   ]);

//   // Filter and sort products
//   const filteredProducts = useMemo(() => {
//     let filtered = products;

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (product) =>
//           product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           product.category.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // 🔹 Filtering logic
//     let filteredProducts = products;

//     // ✅ Updated category filter
//     if (selectedCategory !== "all") {
//       filteredProducts = filteredProducts.filter(
//         (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }

//     // Price filter
//     // filteredProducts = filteredProducts.filter(
//     //   (p) => p.price >= minPrice && p.price <= maxPrice
//     // );

//     // Sorting
//     // if (sortOrder === "low") {
//     //   filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
//     // } else if (sortOrder === "high") {
//     //   filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
//     // }

//     // Category filter
//     if (selectedCategory) {
//       filtered = filtered.filter(
//         (product) => product.category === selectedCategory
//       );
//     }

//     // Brand filter
//     if (selectedBrands.length > 0) {
//       filtered = filtered.filter((product) =>
//         selectedBrands.includes(product.brand)
//       );
//     }

//     // Price filter
//     filtered = filtered.filter(
//       (product) =>
//         product.price >= priceRange[0] && product.price <= priceRange[1]
//     );

//     // Stock filter
//     if (inStockOnly) {
//       filtered = filtered.filter((product) => product.inStock);
//     }

//     // Sort
//     switch (sortBy) {
//       case "price-low":
//         filtered.sort((a, b) => a.price - b.price);
//         break;
//       case "price-high":
//         filtered.sort((a, b) => b.price - a.price);
//         break;
//       case "rating":
//         filtered.sort((a, b) => b.rating - a.rating);
//         break;
//       case "popular":
//         filtered.sort((a, b) => b.reviewCount - a.reviewCount);
//         break;
//       default: // newest
//         filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
//     }

//     return filtered;
//   }, [
//     searchQuery,
//     selectedCategory,
//     selectedBrands,
//     priceRange,
//     sortBy,
//     inStockOnly,
//   ]);

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("");
//     setSelectedBrands([]);
//     setPriceRange([0, 1500000]);
//     setSortBy("newest");
//     setInStockOnly(false);
//     setSearchParams({});
//   };

//   const activeFiltersCount = [
//     searchQuery,
//     selectedCategory,
//     selectedBrands.length > 0,
//     priceRange[0] > 0 || priceRange[1] < 1500000,
//     inStockOnly,
//   ].filter(Boolean).length;

//   const FiltersSidebar = () => (
//     <div className="space-y-6">
//       <div>
//         <h3 className="font-semibold mb-3">Search</h3>
//         <Input
//           placeholder="Search products..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full"
//         />
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-3">Categories</h3>
//         <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="all-categories"
//               checked={!selectedCategory}
//               onCheckedChange={() => setSelectedCategory("")}
//             />
//             <label htmlFor="all-categories" className="text-sm">
//               All Categories
//             </label>
//           </div>
//           {categories.map((category) => (
//             <div key={category.id} className="flex items-center space-x-2">
//               <Checkbox
//                 id={category.id}
//                 checked={selectedCategory === category.id}
//                 onCheckedChange={() =>
//                   setSelectedCategory(
//                     selectedCategory === category.id ? "" : category.id
//                   )
//                 }
//               />
//               <label htmlFor={category.id} className="text-sm">
//                 {category.name}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-3">Brands</h3>
//         <div className="space-y-2 max-h-48 overflow-y-auto">
//           {brands.map((brand) => (
//             <div key={brand} className="flex items-center space-x-2">
//               <Checkbox
//                 id={brand}
//                 checked={selectedBrands.includes(brand)}
//                 onCheckedChange={(checked) => {
//                   if (checked) {
//                     setSelectedBrands([...selectedBrands, brand]);
//                   } else {
//                     setSelectedBrands(
//                       selectedBrands.filter((b) => b !== brand)
//                     );
//                   }
//                 }}
//               />
//               <label htmlFor={brand} className="text-sm">
//                 {brand}
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <h3 className="font-semibold mb-3">Price Range</h3>
//         <div className="space-y-4">
//           <Slider
//             value={priceRange}
//             onValueChange={setPriceRange}
//             max={1500000}
//             min={0}
//             step={1000}
//             className="w-full"
//           />
//           <div className="flex items-center justify-between text-sm text-muted-foreground">
//             <span>UGX {priceRange[0].toLocaleString()}</span>
//             <span>UGX {priceRange[1].toLocaleString()}</span>
//           </div>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="in-stock"
//             checked={inStockOnly}
//             onCheckedChange={(checked) => setInStockOnly(!!checked)}
//           />
//           <label htmlFor="in-stock" className="text-sm">
//             In Stock Only
//           </label>
//         </div>
//       </div>

//       {activeFiltersCount > 0 && (
//         <>
//           <Separator />
//           <Button variant="outline" onClick={clearFilters} className="w-full">
//             Clear All Filters
//           </Button>
//         </>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto container-padding py-6">
//         {/* Header */}
//         <div className="mb-8">
//           <nav className="text-sm text-muted-foreground mb-4">
//             <Link to="/" className="hover:text-primary">
//               Home
//             </Link>
//             <span className="mx-2">/</span>
//             <span>Shop</span>
//             {selectedCategory && (
//               <>
//                 <span className="mx-2">/</span>
//                 <span className="capitalize">
//                   {categories.find((c) => c.id === selectedCategory)?.name}
//                 </span>
//               </>
//             )}
//           </nav>

//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">
//                 {selectedCategory
//                   ? categories.find((c) => c.id === selectedCategory)?.name ||
//                     "Shop"
//                   : "All Products"}
//               </h1>
//               <p className="text-muted-foreground">
//                 {filteredProducts.length} product
//                 {filteredProducts.length !== 1 ? "s" : ""} found
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               {/* Sort */}
//               <Select
//                 value={sortBy}
//                 onValueChange={(value) => setSortBy(value as SortOption)}>
//                 <SelectTrigger className="w-48">
//                   <SelectValue placeholder="Sort by" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="newest">Newest First</SelectItem>
//                   <SelectItem value="price-low">Price: Low to High</SelectItem>
//                   <SelectItem value="price-high">Price: High to Low</SelectItem>
//                   <SelectItem value="rating">Highest Rated</SelectItem>
//                   <SelectItem value="popular">Most Popular</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* View Mode */}
//               <div className="flex border border-border rounded-md">
//                 <Button
//                   variant={viewMode === "grid" ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => setViewMode("grid")}
//                   className="rounded-r-none">
//                   <Grid className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === "list" ? "default" : "ghost"}
//                   size="sm"
//                   onClick={() => setViewMode("list")}
//                   className="rounded-l-none border-l">
//                   <List className="h-4 w-4" />
//                 </Button>
//               </div>

//               {/* Mobile Filters */}
//               <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="outline" size="sm" className="lg:hidden">
//                     <SlidersHorizontal className="h-4 w-4 mr-2" />
//                     Filters
//                     {activeFiltersCount > 0 && (
//                       <Badge className="ml-2 h-5 w-5 p-0 text-xs">
//                         {activeFiltersCount}
//                       </Badge>
//                     )}
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-80">
//                   <SheetHeader>
//                     <SheetTitle>Filters</SheetTitle>
//                   </SheetHeader>
//                   <div className="mt-6">
//                     <FiltersSidebar />
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>

//           {/* Active Filters */}
//           {activeFiltersCount > 0 && (
//             <div className="flex flex-wrap items-center gap-2 mt-4">
//               <span className="text-sm text-muted-foreground">
//                 Active filters:
//               </span>
//               {searchQuery && (
//                 <Badge variant="secondary" className="gap-1">
//                   Search: {searchQuery}
//                   <button onClick={() => setSearchQuery("")}>×</button>
//                 </Badge>
//               )}
//               {selectedCategory && (
//                 <Badge variant="secondary" className="gap-1">
//                   {categories.find((c) => c.id === selectedCategory)?.name}
//                   <button onClick={() => setSelectedCategory("")}>×</button>
//                 </Badge>
//               )}
//               {selectedBrands.map((brand) => (
//                 <Badge key={brand} variant="secondary" className="gap-1">
//                   {brand}
//                   <button
//                     onClick={() =>
//                       setSelectedBrands(
//                         selectedBrands.filter((b) => b !== brand)
//                       )
//                     }>
//                     ×
//                   </button>
//                 </Badge>
//               ))}
//               {inStockOnly && (
//                 <Badge variant="secondary" className="gap-1">
//                   In Stock Only
//                   <button onClick={() => setInStockOnly(false)}>×</button>
//                 </Badge>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="flex gap-8">
//           {/* Desktop Filters Sidebar */}
//           <aside className="hidden lg:block w-64 flex-shrink-0">
//             <div className="sticky top-24">
//               <FiltersSidebar />
//             </div>
//           </aside>

//           {/* Products Grid */}
//           <main className="flex-1">
//             {filteredProducts.length > 0 ? (
//               <div
//                 className={
//                   viewMode === "grid"
//                     ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6"
//                     : "space-y-4"
//                 }>
//                 {filteredProducts.map((product) => (
//                   <ProductCard
//                     key={product.id}
//                     product={product}
//                     className={viewMode === "list" ? "flex" : ""}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-muted-foreground mb-6">
//                   Try adjusting your search criteria or clearing some filters
//                 </p>
//                 <Button onClick={clearFilters} variant="outline">
//                   Clear All Filters
//                 </Button>
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }
