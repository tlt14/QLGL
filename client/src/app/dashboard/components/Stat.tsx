export default function Stat({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="w-full mt-2 content-center px-2">
      <div className=" rounded-[25px] w-full bg-white p-8 ">
        <div className="h-12">{icon}</div>
        <div className="my-2">
          <h2 className="text-4xl font-bold text-gray-800">
            <span>{value}</span> +
          </h2>
        </div>
        <div>
          <p className="mt-2 font-sans text-base font-medium text-gray-500">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
