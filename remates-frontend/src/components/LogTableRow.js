import { displayDate } from "../helpers";

export default function LogTableRow({ log }) {
  return (
    <tr className="border-b hover:bg-neutral-50">
      <td className="px-4 py-2">{displayDate(log.realizadoEn)}</td>
      <td className="px-4 py-2">{log.descripcion}</td>
    </tr>
  );
}
