
import { Link } from "react-router-dom";
import categoryElectronics from "../assets/category-electronics.jpg";
import categoryFashion from "../assets/category-fashion.jpg";
import categoryFurniture from "../assets/category-furniture.jpg";
import categoryHomeKitchen from "../assets/category-home-kitchen.jpg";
import categorySports from "../assets/category-sports.jpg";
import categoryBooks from "../assets/category-books.jpg";
import categoryToys from "../assets/category-toys.jpg";
import categoryBeauty from "../assets/category-beauty.jpg";

const CategoriesSection = () => {
  const categories = [
    { name: "Electronics", image: categoryElectronics, link: "/categories?category=Electronics" },
    { name: "Fashion", image: categoryFashion, link: "/categories?category=Fashion" },
    { name: "Furniture", image: categoryFurniture, link: "/categories?category=Furniture" },
    { name: "Home & Kitchen", image: categoryHomeKitchen, link: "/categories?category=Home%20%26%20Kitchen" },
    { name: "Sports", image: categorySports, link: "/categories?category=Sports" },
    { name: "Books", image: categoryBooks, link: "/categories?category=Books" },
    { name: "Toys", image: categoryToys, link: "/categories?category=Toys" },
    { name: "Beauty", image: categoryBeauty, link: "/categories?category=Beauty" },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-500">Browse our wide selection of products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={category.link}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all transform hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-lg drop-shadow-lg">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
