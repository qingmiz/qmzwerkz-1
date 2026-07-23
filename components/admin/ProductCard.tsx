interface ProductCardProps {
  name: string;
  image: string;
  price: number;
  category: string;
}

export default function ProductCard({
  name,
  image,
  price,
  category,
}: ProductCardProps) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-pink-500 transition">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>

        <p className="text-sm text-gray-400 mt-1">
          {category}
        </p>

        <p className="text-pink-500 font-bold text-xl mt-3">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}