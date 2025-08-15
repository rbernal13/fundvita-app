import { use, useEffect, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { getAllFunds } from "../services/funds.service";

export default function FundForm({ onSubmit, submitLabel }: FundFormProps) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [userId, setUserId] = useState("");
  const [fundId, setFundId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);

  //Obtener lista de fondos de inversion
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const funds = await getAllFunds();
        setFunds(funds);
        setSelectedValue(`${funds[0]?.fundId} - ${funds[0]?.name}` || ""); // Seleccionar el primer fondo por defecto
      } catch (error) {
        console.error("Error fetching funds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(userId, fundId);
      }}
    >
      <Row>
        <Col xs={12} md={6}>
          <Row>
            <Col xs={12} md={6}>
              <label>Ingres el ID del Usuario: </label>
            </Col>
            <Col xs={12} md="auto">
              <input
                value={userId}
                type="text"
                placeholder="ID del Usuario, por defecto: u1"
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6}>
          <Row>
            <Col>
              <label>Selecciona un fondo de inversión: </label>
            </Col>
            <Col>
              <DropdownButton
                title={selectedValue ? `${selectedValue}` : " - "}
                onSelect={(eventKey) => {
                  if (eventKey) {
                    const selectedFund = funds.find(
                      (fund) => fund.fundId === eventKey
                    );
                    if (selectedFund) {
                      setSelectedValue(
                        `${selectedFund.fundId} - ${selectedFund.name}`
                      );
                      setFundId(selectedFund.fundId);
                    }
                  }
                }}
              >
                {funds.map((fund) => (
                  <Dropdown.Item
                    key={fund.fundId}
                    eventKey={fund.fundId}
                    active={selectedValue === fund.fundId}
                  >
                    {fund.fundId} - {fund.name} - {fund.minInvestment} -{" "}
                    {fund.category}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
        </Col>
        <Col xs={12} md={6}>
          <Button variant="primary" type="submit">
            {submitLabel}
          </Button>
        </Col>
      </Row>
    </form>
  );
}

type Fund = {
  fundId: string;
  name: string;
  minInvestment: number;
  category: string;
};

type FundFormProps = {
  onSubmit: (userId: string, fundId: string) => void;
  submitLabel: string;
};
