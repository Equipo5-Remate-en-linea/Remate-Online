import { displayDate } from "../helpers";

export default function LogTableRow({ date, description }) {
  return (
    <tr className="border-b hover:bg-neutral-50">
      <td>{displayDate(date)}</td>
      <td>{description}</td>
    </tr>
  );
}
