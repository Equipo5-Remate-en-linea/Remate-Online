import { useEffect, useState } from "react";
import axios from "axios";
import endpoints from "../../api/endpoints";
import LogTableRow from "../../components/LogTableRow";

export default function AdministracionLogs() {
  const [logs, setLogs] = useState([]);

  const getLogs = async () => {
    try {
      const { data } = await axios.get(endpoints.logs);
      setLogs(data);
    } catch (error) {
      console.error("Ha ocurrido un error al obtener los logs:", error);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  return (
    <main className="mx-auto my-8 space-y-8">
      <h1 className="text-3xl font-bold">Logs</h1>
      {logs.length === 0 ? (
        <p className="text-xl text-center">No hay logs registrados</p>
      ) : (
        <table className="w-3/4 table-auto border-collapse border border-slate-700 mx-auto">
          <thead>
            <tr className="border-b">
              <th className="w-2/5 px-4 py-2">Fecha</th>
              <th className="w-3/5 px-4 py-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <LogTableRow key={log._id} log={log} />
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
