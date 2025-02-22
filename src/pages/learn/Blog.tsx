
import Navigation from "@/components/Navigation";

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Blog</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <article className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-3">
                Tendances Print-on-Demand 2024
              </h2>
              <p className="text-gray-600 mb-4">
                Découvrez les dernières tendances du marché et comment en tirer profit.
              </p>
              <div className="text-sm text-gray-500">Publié le 1 Mars 2024</div>
            </article>
            <article className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-3">
                Guide du Design Réussi
              </h2>
              <p className="text-gray-600 mb-4">
                Les meilleures pratiques pour créer des designs qui se vendent.
              </p>
              <div className="text-sm text-gray-500">Publié le 28 Février 2024</div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
