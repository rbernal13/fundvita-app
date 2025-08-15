import { useState } from "react";
import FundForm from "../components/FundForm";
import { subscribeFund } from "../services/funds.service";

export default function CancelPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel(userId: string, fundId: string) {
    setLoading(true);
    setError(null);
    try {
      await subscribeFund(userId, fundId);
      alert("Cancelación realizada con éxito.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Salirse de un fondo de inversion</h2>
      <FundForm onSubmit={handleCancel} submitLabel="Salir del fondo" />
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>⚠ {error}</p>}
    </div>
  );
}
