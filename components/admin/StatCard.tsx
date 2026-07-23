interface StatCardProps {
  title: string;
  value: string | number;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = '#ec4899',
}: StatCardProps) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2
        className="text-3xl font-bold mt-2"
        style={{ color }}
      >
        {value}
      </h2>
    </div>
  );
}