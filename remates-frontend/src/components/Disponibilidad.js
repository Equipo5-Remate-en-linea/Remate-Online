export default function Disponibilidad({ disponibilidad, center }) {
  return center ? (
    <div className="flex items-center justify-center w-full">
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-xl ${
          disponibilidad === "no disponible"
            ? "bg-gray-200 text-gray-700"
            : "bg-green-200 text-green-700"
        }`}
      >
        {disponibilidad}
      </span>
    </div>
  ) : (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-xl ${
        disponibilidad === "no disponible"
          ? "bg-gray-200 text-gray-700"
          : "bg-green-200 text-green-700"
      }`}
    >
      {disponibilidad}
    </span>
  );
}
