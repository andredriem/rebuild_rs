import React, { ReactElement, useCallback, useEffect } from 'react';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

import { RMap, ROSM, RLayerVector, RPopup, RFeature, RFeatureUIEvent, ROverlay, RLayerCluster, RControl, RLayerTile } from 'rlayers';
import {
    RStyle,
    RFill,
    RStroke,
    RRegularShape,
    RCircle,
    RText,
    RIcon,
} from "rlayers/style";
import { Icon, Style } from 'ol/style';
import { mapIcons } from '../mapIcons';
import { toLonLat } from 'ol/proj';
import GeoJSON from "ol/format/GeoJSON";
import { useChangeGenericError, useChangePinSelectedTopicId, useCurrentLayer, useLoginData, useOpenTopic, usePinMarkerRequest, usePostId, useSelectedTool, useShowLoginModal } from '../states';
import ToolbarComponent from './Tooolbar';
import { Feature, MapBrowserEvent } from 'ol';
import { NewPinModal } from './NewPinModal';
import { v4 as uuidv4 } from 'uuid';
import { useMapRefreshCount } from '../states';
import { getDistance } from 'ol/sphere';
import { Geometry, Point } from 'ol/geom';
import { createEmpty, extend, getHeight, getWidth } from 'ol/extent';
import "ol/ol.css";
import "rlayers/control/layers.css";
import LayerModal from './LayerModal';


const DEFAULT_LATITUDE = -30.343501569973775;
const DEFAULT_LONGITUDE = -52.745430653510944;
const DEFAULT_ZOOM = 7;

function buildRlayerUrl(latitude: number, longitude: number, zoom: number, refreshCount: number) {
    return `/forum/topics/maps_data.json?latitude=${latitude}&longitude=${longitude}&zoom=${zoom}&refreshCount=${refreshCount}`
}

const colorBlob = (size: number) => {
    // alpha is min 100 and max 255
    // it gets att 255 when size is 10 or more
    let alpha = Math.min(255, 100 + (size * 15) - 15);

    return "rgba(" +
        [255, 153, 0, alpha / 255].join() +
        ")";
}

const radiusStar = (feature: Feature<Geometry>) => {
    return feature.get('icon')
}



/** Main map */
export function Map(): ReactElement {
    // get latitude and longitude from the querystring
    let queryLatitude = parseFloat(new URLSearchParams(window.location.search).get('latitude') ?? DEFAULT_LATITUDE.toString())
    let queryLongitude = parseFloat(new URLSearchParams(window.location.search).get('longitude') ?? DEFAULT_LONGITUDE.toString())
    let queryZoom = parseFloat(new URLSearchParams(window.location.search).get('zoom') ?? DEFAULT_ZOOM.toString())
    if (isNaN(queryLatitude) || isNaN(queryLongitude)) {
        queryLatitude = DEFAULT_LATITUDE;
        queryLongitude = DEFAULT_LONGITUDE;
    }
    if (isNaN(queryZoom)) {
        queryZoom = DEFAULT_ZOOM;
    }

    const [latitude, setLatitude] = React.useState(queryLatitude);
    const { setPostId, postId } = usePostId();
    const [longitude, setLongitude] = React.useState(queryLongitude);
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
    const popup = React.useRef<RPopup>()
    const vectorLayerRef = React.useRef<RLayerCluster>();
    const { selectedTool, setSelectedTool } = useSelectedTool();
    const { pinMarkerRequest, setPinMarkerRequest } = usePinMarkerRequest();
    const { refreshCount, setRefreshCount } = useMapRefreshCount();
    // Make ref to store first refreshcount
    const oldRefreshCount = React.useRef(refreshCount);
    const [refreshTimoutCalled, setRefreshTimoutCalled] = React.useState(false);
    const [popupContent, setPopupContent] = React.useState<string | null>('');
    const [overlayLonLat, setOverlayLonLat] = React.useState<[number, number]>([0, 0]);
    const { loginData } = useLoginData()
    const { setShowLoginModal } = useShowLoginModal()
    const { setOpenTopic } = useOpenTopic();
    const [lastRefresh, setLastRefresh] = React.useState(Date.now());
    const [rlayerUrl, setRlayerUrl] = React.useState(buildRlayerUrl(latitude, longitude, zoom, refreshCount));
    const [featureLoadedCount, setFeatureLoadedCount] = React.useState(0);
    const { currentLayer } = useCurrentLayer();
    const { changePinSelectedTopicId, setChangePinSelectedTopicId } = useChangePinSelectedTopicId();
    const { setChangeGenericError, changeGenericError } = useChangeGenericError();



    const clusterCacheFunction = (feature: Feature<Geometry>, resolution: number) => {
        // This is the hashing function, it takes a feature as its input
        // and returns a string
        // It must be dependant of the same inputs as the rendering function
        return feature.get("features").length > 1
            ? "#" + extentFeatures(feature.get("features"), resolution)
            : "$" + radiusStar(feature.get("features")[0])
    }

    // This returns the north/south east/west extent of a group of features
    // divided by the resolution
    const extentFeatures = (features: Feature<Geometry>[], resolution: number) => {
        const extent = createEmpty();
        for (const f of features) {
            const geometry = f.getGeometry();
            if (geometry === undefined) continue;
            extend(extent, geometry.getExtent());
        }
        return Math.round(0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
    };

    const renderCache = (feature: Feature<Geometry>, resolution: number) => {
        // This is the rendering function
        // It has access to the cluster which appears as a single feature
        // and has a property with an array of all the features that make it
        const size = feature.get("features").length;
        console.log(size);
        console.log(feature.get("features"));
        // This is the size (number of features) of the cluster
        if (size > 1 && zoom < 15) {
            // Render a blob with a number
            const radius = extentFeatures(
                feature.get("features"),
                resolution
            );

            return (
                // A dynamic style should return a fragment instead of a
                // full-blown RStyle - returning a full RStyle here
                // will simply replace the style used by the vector layer
                // with a fixed one
                <React.Fragment>
                    <RCircle radius={32}>
                        <RFill color={colorBlob(size)} />
                    </RCircle>
                    <RText scale={2} text={size.toString()}>
                        <RFill color="#fff" />
                        <RStroke color="rgba(0, 0, 0, 0.6)" width={3} />
                    </RText>
                </React.Fragment>
            );
        }
        // We have a single feature cluster
        const icons = []
        function getRandomKey(obj: Record<string, any>): string {
            const keys = Object.keys(obj);
            return keys[Math.floor(Math.random() * keys.length)];
        }

        for (const unclusteredFeature of feature.get("features")) {


            const icon = mapIcons[unclusteredFeature.get('icon')];
            const randomIcon = mapIcons[getRandomKey(mapIcons)];
            icons.push(<RIcon src={icon ?? randomIcon} />)
        }

        return <>
            {icons}
        </>

        /*
        // Render a star
        return (
            <RRegularShape
                radius={radiusStar(unclusteredFeature)}
                radius2={3}
                points={5}
                angle={Math.PI}
            >
                <RFill color="rgba(255, 153, 0, 0.8)" />
                <RStroke color="rgba(255, 204, 0, 0.2)" width={1} />
            </RRegularShape>
        ); */
    };


    useEffect(() => {

    }, [postId, refreshCount]);

    // Use effect to restore generic error in case of tool change
    useEffect(() => {
        setChangeGenericError(null);
    }, [selectedTool, setChangeGenericError]);

    useEffect(() => {
        // Only refresh if lastRefresh was 30 seconds ago
        const now = Date.now()
        const timeCondition = now - lastRefresh > 30000;
        const refreshCountCondition = oldRefreshCount.current !== refreshCount;

        if (timeCondition || refreshCountCondition) {
            setLastRefresh(now);
            setRlayerUrl(buildRlayerUrl(latitude, longitude, zoom, refreshCount));
            setLastRefresh(now);
            // Update ref
            oldRefreshCount.current = refreshCount
        }
    }, [refreshCount, latitude, longitude, zoom, lastRefresh]);

    if (vectorLayerRef === undefined) return <div></div>
    if (popup === undefined) return <div></div>


    const handleFeatureClick = (e: RFeatureUIEvent) => {
        const features = e.target.get("features") ?? [];
        const geometry = e.target?.getGeometry();

        if (features.length === 0) return;
        if (geometry === undefined) return;

        //const coordinates = e.map.getCoordinateFromPixel(e.pixel);

        e.map.getView().fit(geometry.getExtent(), {
            duration: 250,
            maxZoom: 15,
        });

        // If we are targetting a single feature, open the topic
        if (features.length > 1) {
            return;
        }

        const postId = features[0].get('postId');
        setPostId(postId);
        setOpenTopic(true);
    }

    const handleSetChangePinSelectedTopicId = (e: RFeatureUIEvent) => {
        const features = e.target.get("features") ?? [];
        if (features.length === 0) return;
        if (features.length > 1) return;

        const postId = features[0].get('postId');
        setChangePinSelectedTopicId(postId.toString());
    }

    const handleNewPinLocationSelected = async (e: MapBrowserEvent<UIEvent>) => {
        const coordinates = toLonLat(
            e.map.getCoordinateFromPixel(e.pixel)
        )
        if (changePinSelectedTopicId === null) return;


        // Post new latitute and longitude to the backend
        const response = await fetch(`/forum/topics/${changePinSelectedTopicId}/update_lonlat.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: coordinates[1],
                longitude: coordinates[0]
            })
        });
        let responseJson;
        try{
            responseJson = await response.json();
        } catch (error) {
            setChangeGenericError('Failed to parse response');
            setChangePinSelectedTopicId(null);
            return;
        }

        if (!response.ok) {
            setChangeGenericError('Falha ao mover tópico, você tem certeza que criout este tópico?');
            setChangePinSelectedTopicId(null);
            return
        }

        setChangePinSelectedTopicId(null);
        setRefreshCount(refreshCount + 1);
        // Change too back to mouse
        setSelectedTool('Mouse');
        

    }

    const handlePinMarkerRequest = (e: MapBrowserEvent<UIEvent>) => {
        // Check if the user is logged in
        if (loginData === null) {
            setShowLoginModal(true);
            return;
        }

        const coordinates = toLonLat(
            e.map.getCoordinateFromPixel(e.pixel)
        )
        setPinMarkerRequest({
            latitude: coordinates[1],
            longitude: coordinates[0],
            uuid: uuidv4()
        });
    }

    const layersButton = <button>&#9776;</button>;

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <NewPinModal />
            <LayerModal />
            <ToolbarComponent style={
                {
                    position: 'absolute',
                    top: '0%',
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                    zIndex: 1000,
                    backgroundColor: 'white',
                    padding: '10px',
                    boxShadow: '0 1px 5px rgba(0,0,0,0.65)'
                }
            } />
            <RMap
                className='example-map'
                initial={{ center: fromLonLat([longitude, latitude]), zoom: zoom }}
                onClick={(e) => {
                    if (pinMarkerRequest === null && selectedTool === 'Pin') {
                        handlePinMarkerRequest(e);
                    } else if (selectedTool === 'ChangePin') {
                        handleNewPinLocationSelected(e);
                    }
                }}
                onMoveEnd={(e) => {
                    const map = e.map;
                    if (map === undefined) return;
                    const view = map.getView()
                    const center = view.getCenter();
                    if (center === undefined) return;
                    const zoom = view.getZoom();
                    const newCoordinates = toLonLat(center);

                    const lastCount = refreshCount;
                    const distance = getDistance(
                        [longitude, latitude],
                        newCoordinates
                    );
                    if (distance > 5000) {
                        setLatitude(newCoordinates[1]);
                        setLongitude(newCoordinates[0]);
                        setRefreshCount(lastCount + 1);
                    }

                    // Set latitude and longitude in the querystring without reloading the page
                    window.history.pushState({}, '', `?latitude=${newCoordinates[1]}&longitude=${newCoordinates[0]}&post_id=${postId}&zoom=${zoom}`);

                }}
            >
                {/*(() => {
                    switch (currentLayer) {
                        case 'default':
                            return <ROSM />;
                        case 'topo':
                        default:
                            return <RLayerTile
                                properties={{ label: "Topologia" }}
                                url="https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"
                                attributions="Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)"
                            />
                    }
                })()*/}

                <ROSM properties={{ visible: currentLayer === 'default' }} />
                <RLayerTile
                    properties={{ visible: currentLayer === 'topo' }}
                    url="https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    attributions="Kartendaten: © OpenStreetMap-Mitwirkende, SRTM | Kartendarstellung: © OpenTopoMap (CC-BY-SA)"
                />
                <RLayerCluster
                    ref={vectorLayerRef as any}
                    url={rlayerUrl}
                    format={new GeoJSON({ featureProjection: "EPSG:3857" })}
                    onClick={(e) => {
                        if (e.target !== undefined) {
                            if (selectedTool === 'Mouse') {
                                handleFeatureClick(e);
                            } if (selectedTool === 'ChangePin') {
                                handleSetChangePinSelectedTopicId(e);
                            }
                        }
                    }}
                    onFeaturesLoadStart={(e) => { setFeatureLoadedCount(featureLoadedCount + 1) }}
                    onPointerMove={(e) => {
                        const feature = e.map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
                        if (feature === undefined) { setPopupContent(null); return; }
                        const lonlat = toLonLat(e.coordinate);
                        const featureCluster = feature.get('features');
                        if (featureCluster === undefined) { setPopupContent(null); return; }
                        if (featureCluster.length > 1) {
                            setPopupContent(`Clique aqui para ver os tópicos agrupados`);
                            setOverlayLonLat([lonlat[0], lonlat[1]]);
                        } else if (featureCluster.length === 1) {
                            const singleFeature = featureCluster[0];
                            setPopupContent(singleFeature.get('title'));
                            setOverlayLonLat([lonlat[0], lonlat[1]]);
                        } else {
                            setPopupContent(null);
                        }
                    }}
                    onPointerLeave={(e) => {
                        setPopupContent(null);
                    }}

                >
                    <RStyle
                        cacheId={clusterCacheFunction}
                        render={renderCache}
                    >
                        {popupContent && (
                            <ROverlay className="example-overlay">
                                {popupContent}
                            </ROverlay>)
                        }
                    </RStyle>
                    <RStyle>

                        <RFeature
                            geometry={new Point(fromLonLat(overlayLonLat))}
                        >
                            {popupContent && (
                                <ROverlay className="example-overlay">
                                    {popupContent}
                                </ROverlay>)
                            }
                        </RFeature>
                    </RStyle>
                </RLayerCluster>
            </RMap>
        </div>
    );
}

