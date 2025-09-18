// import React from 'react';
// import { Link } from 'react-router-dom';
// import { categories } from '../data/products';
// import { Grid, Tv, Fridge, WashingMachine, Speaker, ChefHat, Iron, Zap } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// const categoryIcons = {
//   tvs: Tv,
//   refrigerators: Fridge,
//   'washing-machines': WashingMachine,
//   'sound-systems': Speaker,
//   cooking: ChefHat,
//   irons: Iron,
//   other: Zap,
// };

// const AllCategories = () => {
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto py-8 px-4">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-4">Shop by Category</h1>
//           <p className="text-muted-foreground max-w-md mx-auto">
//             Discover our wide range of electronics. Browse products by category to find what you need.
//           </p>
//         </div>

//         {/* Categories Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6">
//           {categories.map((category) => {
//             const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Grid;
//             return (
//               <Link
//                 key={category.id}
//                 to={`/shop?category=${category.id}`}
//                 className="group"
//               >
//                 <Card className="h-full flex flex-col items-center p-4 hover:shadow-md transition-shadow border-0 hover:border-primary/50">
//                   <div className="mb-3 p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
//                     <Icon className="h-6 w-6 text-primary group-hover:text-primary" />
//                   </div>
//                   <CardContent className="pt-0 text-center">
//                     <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
//                     <Badge variant="outline" className="text-xs">
//                       Explore
//                     </Badge>
//                   </CardContent>
//                 </Card>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllCategories;
