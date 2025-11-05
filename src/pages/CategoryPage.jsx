import React from "react";
import { useParams, Link } from "react-router-dom";
import { categories } from "../data/products";
import { ProductCard } from "../components/shared/ProductCard";
import { useAllProducts } from "../hooks/useAllProducts";

export default function CategoryPage() {
  const { categoryId } = useParams();
  // Fetch merged products (local + Supabase)
  const { products } = useAllProducts();

  const category = categories.find((c) => c.id === categoryId);
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/shop" className="text-blue-500 hover:underline">
            Go back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => p.category === categoryId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">
              No products in this category yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new arrivals.
            </p>
            <Link to="/shop">
              <button className="px-4 py-2 border border-border rounded-md hover:bg-accent">
                Browse All Products
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
