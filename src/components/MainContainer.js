import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MapContainer from './MapContainer'



function MainContainer() {
  return (
        <Col md={7} className="p-0">
          <MapContainer />
        </Col>
  );
}

export default MainContainer;