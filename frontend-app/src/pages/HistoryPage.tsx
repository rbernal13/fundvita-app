import { useState } from "react";
import { getHistory } from "../services/history.service";

export default function HistoryPage() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getHistory(userId);
      setData(response);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Página de Historial</h1>
      <input
        type="text"
        placeholder="Ingrese User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Cargando..." : "Ver Historial"}
      </button>
      {data && (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fondo</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.historyId}>
                <td>{item.historyId}</td>
                <td>{item.fundId}</td>
                <td>{item.amount}</td>
                <td>{item.type}</td>
                <td>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

type HistoryItem = {
  historyId: string;
  fundId: string;
  amount: number;
  type: string;
  createdAt: string;
};
