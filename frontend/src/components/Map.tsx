import React, { ReactElement, useEffect } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

import { RMap, ROSM, RLayerVector, RPopup, RFeature, RFeatureUIEvent } from 'rlayers';
import { Icon, Style } from 'ol/style';
import { mapIcons } from '../mapIcons';
import { Modal } from 'react-bootstrap';
import { toLonLat } from 'ol/proj';
import GeoJSON from "ol/format/GeoJSON";
import { usePinMarkerRequest, usePostId, useSelectedTool } from '../states';
import ToolbarComponent from './Tooolbar';
import { Feature, MapBrowserEvent } from 'ol';
import { Geometry } from 'ol/geom';
import { NewPinModal } from './NewPinModal';
import { v4 as uuidv4 } from 'uuid';

/** Main map */
export function Map(): ReactElement {
    const [show, setShow] = React.useState(false);
    const [latitude, setLatitude] = React.useState(-30.0274557);
    const { setPostId } = usePostId();
    const [longitude, setLongitude] = React.useState(-51.2345937);
    const [zoom, setZoom] = React.useState(14);
    const [modalTitle, setModalTitle] = React.useState('')
    const popup = React.useRef<RPopup>()
    const vectorLayerRef = React.useRef<RLayerVector>();
    const { selectedTool } = useSelectedTool();
    const { pinMarkerRequest, setPinMarkerRequest } = usePinMarkerRequest();
    useEffect(() => {
        //void fetchMapData();
    }, [latitude, longitude, zoom]);

    if (vectorLayerRef === undefined) return <div></div>
    if (popup === undefined) return <div></div>


    const handleFeatureClick = (e: RFeatureUIEvent) => {
        const feature = e.target;
        const geometry = feature?.getGeometry();
        if (feature === undefined) return;
        if (geometry === undefined) return;
        const coordinates = e.map.getCoordinateFromPixel(e.pixel);
        console.log(coordinates);


        e.map.getView().fit(geometry.getExtent(), {
            duration: 250,
            maxZoom: 15,
        });

        // Set modal title to random title
        setModalTitle(Math.random().toString());
        setPostId(Math.random());
        //setShow(true);
    }

    const handlePinMarkerRequest = (e: MapBrowserEvent<UIEvent>) => {
        const coordinates = toLonLat(
            e.map.getCoordinateFromPixel(e.pixel)
        )
        setPinMarkerRequest({
            latitude: coordinates[1],
            longitude: coordinates[0],
            uuid: uuidv4()
        });
    }

    return (
        <div>
            <NewPinModal/>
            <ToolbarComponent />
            <RMap
                className='example-map'
                initial={{ center: fromLonLat([longitude, latitude]), zoom: zoom }}
                onClick={(e) => {
                    if (pinMarkerRequest === null && selectedTool === 'Pin') {
                        handlePinMarkerRequest(e);
                    }
                }}
            >
                <ROSM />

                <RLayerVector
                    url={`/api/mapData?latitude=${latitude}&longitude=${longitude}&zoom=${zoom}`}
                    format={new GeoJSON({ featureProjection: "EPSG:3857" })}
                    style={(feature) => {
                        // selects random mapIcons (based on random funciton and size of mapIcons object)
                        function getRandomKey(obj: Record<string, any>): string {
                            const keys = Object.keys(obj);
                            return keys[Math.floor(Math.random() * keys.length)];
                        }
                        const randomIcon = mapIcons[getRandomKey(mapIcons)];


                        return new Style({
                            image: new Icon({
                                src: randomIcon,
                                anchor: [0.5, 0.8],
                            }),
                        });
                    }}
                    onClick={(e) => {
                        if (e.target !== undefined && selectedTool === 'Mouse') {
                            handleFeatureClick(e);
                        }
                    }}
                >
                    <RFeature

                    >

                    </RFeature>

                </RLayerVector>
            </RMap>
        </div>
    );
}

