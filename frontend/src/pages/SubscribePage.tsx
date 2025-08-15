import { useState } from "react";
import FundForm from "../components/FundForm";
import { subscribeFund } from "../services/funds.service";

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe(userId: string, fundId: string) {
    setLoading(true);
    setError(null);
    try {
      await subscribeFund(userId, fundId);
      alert("Apertura realizada con éxito.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Suscribir a un fondo de inversion</h2>
      <FundForm onSubmit={handleSubscribe} submitLabel="Suscribir" />
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>⚠ {error}</p>}
    </div>
  );
}
