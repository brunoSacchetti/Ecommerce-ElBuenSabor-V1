import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import IArticulo from '../../../types/IArticulo';
import "./ModalArticulo.css"

interface ModalArticuloProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  item: IArticulo | null;
}

export const ModalArticulo = ({ visible, setVisible, item }: ModalArticuloProps) => {
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="ScrollingLongContentExampleLabel"
      
      /* style={{
        backgroundColor:'#F3C99A'
      }} */
    >
      <CModalHeader className="custom-modal-title" >
        <CModalTitle id="ScrollingLongContentExampleLabel">{item?.denominacion}</CModalTitle>
      </CModalHeader>
      <CModalBody className="custom-modal-body">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
          <img style={{ height: '150px', width: '150px' }} src={item?.imagenes[0]?.url} alt={item?.denominacion} />
        </div>
      </CModalBody>
      {item?.descripcion ?  <CModalBody className="custom-modal-body">
      <p>{item?.descripcion}</p>
      </CModalBody> : <></>}
      <CModalFooter className="custom-modal-price">
      <h5>$ {item?.precioVenta}</h5>
      </CModalFooter>
    </CModal>
  );
};
