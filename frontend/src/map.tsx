import React, { ReactElement } from 'react';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import 'ol/ol.css';

import { RMap, ROSM, RLayerVector, RFeature, ROverlay, RStyle, RPopup } from 'rlayers';
import locationIcon from './svg/dam-svgrepo-com.svg';
import { Accordion, Modal } from 'react-bootstrap';

/** Main map */
export function Map(): ReactElement {
    const [show, setShow] = React.useState(false);
    const popup = React.useRef<RPopup>()
    if (popup === undefined) return <div></div>


    return (
        <div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Proposta de reforma do muro do Cais Mauá</Modal.Title>
                </Modal.Header>
                <Modal.Body>Aumentar para 7m</Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>

            <RMap className='example-map' initial={{ center: fromLonLat([-51.2345937, -30.0274557]), zoom: 14 }}>
                <ROSM />

                <RLayerVector zIndex={10}>
                    <RStyle.RStyle>
                        <RStyle.RIcon src={locationIcon} anchor={[0.5, 0.8]} />
                    </RStyle.RStyle>
                    <RFeature
                        geometry={new Point(fromLonLat([-51.2345937, -30.0274557]))}
                        onClick={(e) => {
                            const geometry = e.target?.getGeometry();
                            if (geometry === undefined) return;

                            e.map.getView().fit(geometry.getExtent(), {
                                duration: 250,
                                maxZoom: 15,
                            });

                            setShow(!show);
                        }}
                    ></RFeature>
                </RLayerVector>
            </RMap>
        </div>
    );
}

