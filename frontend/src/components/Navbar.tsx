import { Nav } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import NavbarComponent from "react-bootstrap/Navbar";

export default function Navbar() {
  return (
    <NavbarComponent
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container>
        <Nav className="me-auto">
          <Nav.Link href="/home">Inicio</Nav.Link>
          <Nav.Link href="/subscribe">Aperturas</Nav.Link>
          <Nav.Link href="/cancel">Cancelaciones</Nav.Link>
          <Nav.Link href="/history">Historial</Nav.Link>
        </Nav>
      </Container>
    </NavbarComponent>
  );
}
