"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { toast } from "sonner";
import { FaLandmark } from "react-icons/fa";
import hallImage from "@/app/assets/hall.webp";
import Script from 'next/script';

import MapTypeButton from "./MapTypeButton";
import ZoomControls from "./ZoomControls";
import KakaoMapSettings from "./KakaoMapSettings";
import KakaoAbstractOverlay from "./KakaoAbstractOverlay";
import KakaoMapViewType from "./KakaoMapViewType";

const KakaoMap = () => {
  const [scriptLoad, setScriptLoad] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const defaultPosition = { lat: 35.1803, lng: 128.1087 };
  const [map, setMap] = useState(null);
  const [mapType, setMapType] = useState("ROADMAP");
  const [activeOverlays, setActiveOverlays] = useState({
    apartment: false
  });
  const [markerType, setMarkerType] = useState("apartment");

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
    if (!apiKey) {
      toast.error("Kakao API Key가 없습니다", { duration: 1000 });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        toast.success("카카오 맵이 로드되었습니다", { duration: 1000 });
        setScriptLoad(true);
      });
    };
    script.onerror = () => {
      toast.error("카카오 맵 로드에 실패했습니다", { duration: 1000 });
    };

    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleMarkerClick = () => {
    toast.info("카카오 맵에 오신 것을 환영합니다!", { duration: 1000 });
    if (map) {
      map.panTo(
        new window.kakao.maps.LatLng(defaultPosition.lat, defaultPosition.lng)
      );
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setLevel(map.getLevel() - 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setLevel(map.getLevel() + 1);
    }
  };

  const handleMapTypeChange = () => {
    if (map) {
      setMapType((prev) => (prev === "ROADMAP" ? "SKYVIEW" : "ROADMAP"));
      map.setMapTypeId(
        mapType === "ROADMAP"
          ? window.kakao.maps.MapTypeId.HYBRID
          : window.kakao.maps.MapTypeId.ROADMAP
      );
    }
  };

  const handleTrackerClick = () => {
    if (map) {
      map.panTo(new window.kakao.maps.LatLng(defaultPosition.lat, defaultPosition.lng));
    }
  };

  const onKakaoMapLoad = () => {
    window.kakao.maps.load(() => {
      try {
        const mapContainer = document.getElementById('map');
        const mapOptions = {
          center: new window.kakao.maps.LatLng(35.180344, 128.107897),
          level: 7
        };
        
        const newMap = new window.kakao.maps.Map(mapContainer, mapOptions);
        setMap(newMap);
      } catch (error) {
        console.error("카카오 맵 초기화 오류:", error);
        toast.error("카카오 맵을 초기화하지 못했습니다", { duration: 1000 });
      }
    });
  };

  const handleApartmentToggle = () => {
    setActiveOverlays(prev => ({ ...prev, apartment: !prev.apartment }));
  };

  const handleMarkerTypeChange = (type) => {
    setMarkerType(type);
  };

  return (
    <div className="w-full h-full relative">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`}
        onLoad={onKakaoMapLoad}
      />
      {scriptLoad ? (
        <>
          <Map
            center={defaultPosition}
            style={{ width: "100%", height: "100%" }}
            level={7}
            onCreate={(mapInstance) => {
              console.log("카카오 맵 인스턴스 생성 완료", mapInstance);
              setMap(mapInstance);
            }}
          >
            <MapMarker
              position={defaultPosition}
              onClick={handleMarkerClick}
              onMouseOver={() => setIsOpen(true)}
              onMouseOut={() => setIsOpen(false)}
              image={{
                src: hallImage.src,
                size: { width: 50, height: 50 },
                options: { offset: { x: 20, y: 20 } },
              }}
            >
              {isOpen && (
                <div className="bg-white rounded-lg shadow-md p-4 min-w-[150px] border border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="bg-red-50 p-2 rounded-full mb-2">
                      <FaLandmark size={16} className="text-red-600" />
                    </div>
                    <div className="text-gray-800 font-semibold text-center">
                      진주시청
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      경상남도 진주시
                    </div>
                  </div>
                </div>
              )}
            </MapMarker>
          </Map>

          <KakaoAbstractOverlay 
            position={defaultPosition}
            map={map}
            scriptLoad={scriptLoad}
            imageSrc={hallImage.src}
            onClick={handleTrackerClick}
          />

          <MapTypeButton
            mapType={mapType}
            onMapTypeChange={handleMapTypeChange}
          />
          <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
          <KakaoMapSettings 
            map={map} 
            scriptLoad={scriptLoad} 
          />
          <KakaoMapViewType 
            activeOverlays={activeOverlays} 
            onApartmentToggle={handleApartmentToggle}
            map={map}
            scriptLoad={scriptLoad}
            markerType={markerType}
            onMarkerTypeChange={handleMarkerTypeChange}
          />
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          Loading Kakao Map...
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
