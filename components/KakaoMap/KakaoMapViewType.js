import React, { useEffect, useState, useRef } from "react";
import { getApartmentMarkers } from "@/app/library/fetchApartMarker";
import { toast } from "sonner";
import KakaoMapSidebar from "./KakaoMapSidebar";

const KakaoMapViewType = ({ map, scriptLoad, markerType, onMarkerTypeChange }) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apartmentClusterer, setApartmentClusterer] = useState(null);
  const apartmentMarkersRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [selectedDong, setSelectedDong] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    async function fetchApartments() {
      try {
        setLoading(true);
        const data = await getApartmentMarkers();

        setApartments(data);
        toast.success('아파트 데이터를 성공적으로 로드했습니다', { duration: 1000 });
      } catch (err) {
        console.error('아파트 데이터 로딩 오류:', err);
        toast.error(err.message || '아파트 데이터를 불러오지 못했습니다', { duration: 1000 });
      } finally {
        setLoading(false);
      }
    }

    fetchApartments();
  }, []);

  useEffect(() => {
    if (!map || loading || apartments.length === 0 || !window.kakao || !window.kakao.maps) return;
    
    if (!infoWindowRef.current && window.kakao && window.kakao.maps) {
      infoWindowRef.current = new window.kakao.maps.InfoWindow({
        content: '',
        removable: false
      });
    }
    
    if (markerType === "apartment") {
      let cancelled = false;
      
      const createApartmentMarkers = async () => {
        const markers = [];
        const batchSize = 50; 
        
        const dongGroups = {};
        apartments.forEach(apartment => {
          const dongName = apartment.dong || '기타';
          if (!dongGroups[dongName]) {
            dongGroups[dongName] = [];
          }
          dongGroups[dongName].push(apartment);
        });
        
        const clustererStyles = [
          {
            width: '60px', height: '60px',
            background: 'rgba(0, 128, 76, 0.8)',
            color: '#fff',
            borderRadius: '50%',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '20px',
            padding: '10px 0',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
          },
          {
            width: '70px', height: '70px',
            background: 'rgba(0, 128, 76, 0.9)',
            color: '#fff',
            borderRadius: '50%',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '22px',
            padding: '13px 0',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
          },
          {
            width: '80px', height: '80px',
            background: 'rgba(0, 128, 76, 1)',
            color: '#fff',
            borderRadius: '50%',
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '24px',
            padding: '16px 0',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)'
          }
        ];
        
        const dongClusterers = {};
        
        for (const [dongName, apartmentGroup] of Object.entries(dongGroups)) {
          if (cancelled) return;
          
          dongClusterers[dongName] = new window.kakao.maps.MarkerClusterer({
            map: map,
            averageCenter: true,
            minLevel: 7,
            minClusterSize: 1,
            gridSize: 120,
            disableClickZoom: false,
            styles: clustererStyles,
            calculator: [10, 30, 100],
            texts: function(count) {
              return `${dongName}<br/>${count}개`;
            },
            disableClickZoom: true
          });
          
          window.kakao.maps.event.addListener(dongClusterers[dongName], 'clusterclick', function(cluster) {
            const markers = cluster.getMarkers();
            const bounds = new window.kakao.maps.LatLngBounds();
            
            markers.forEach(marker => {
              bounds.extend(marker.getPosition());
            });
            
            map.setBounds(bounds);
            map.setLevel(5);
            
            localStorage.setItem('selectedDong', dongName);
            
            const event = new CustomEvent('localStorageChange', {
              detail: {
                key: 'selectedDong',
                value: dongName
              }
            });

            window.dispatchEvent(event);
          });
          
          for (let i = 0; i < apartmentGroup.length; i += batchSize) {
            if (cancelled) return;
            
            const batch = apartmentGroup.slice(i, i + batchSize);
            const batchMarkers = batch.map(apartment => {
              if (!apartment.latitude || !apartment.longitude) return null;
              
              const position = new window.kakao.maps.LatLng(apartment.latitude, apartment.longitude);
              const marker = new window.kakao.maps.Marker({
                position: position,
                clickable: true
              });
              
              marker.dongName = dongName;
              
              window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                const infoContent = `
                  <div style="padding:5px;width:200px;">
                    <strong>${apartment.complexName || apartment.complexUniqueId}</strong><br/>
                    동: ${dongName}<br/>
                    위치: ${apartment.latitude}, ${apartment.longitude}
                  </div>
                `;
                
                infoWindowRef.current.setContent(infoContent);
                infoWindowRef.current.open(map, marker);
              });
              
              window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                infoWindowRef.current.close();
              });
              
              window.kakao.maps.event.addListener(marker, 'click', function() {
                handleMarkerClick(apartment);
              });
              
              return marker;
            }).filter(Boolean);
            
            markers.push(...batchMarkers);
            
            if (batchMarkers.length > 0) {
              dongClusterers[dongName].addMarkers(batchMarkers);
            }
            
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
        
        if (!cancelled) {
          setApartmentClusterer(dongClusterers);
          apartmentMarkersRef.current = markers;
          toast.success(`아파트 마커 ${markers.length}개 표시 완료`, { duration: 1000 });
        }
      };
      
      createApartmentMarkers();
      
      return () => {
        cancelled = true;
        if (apartmentClusterer) {
          setTimeout(() => {
            // Clear all clusterers if apartmentClusterer is an object with multiple clusterers
            if (typeof apartmentClusterer === 'object' && !Array.isArray(apartmentClusterer)) {
              Object.values(apartmentClusterer).forEach(clusterer => {
                if (clusterer && typeof clusterer.clear === 'function') {
                  clusterer.clear();
                }
              });
            } else if (apartmentClusterer && typeof apartmentClusterer.clear === 'function') {
              apartmentClusterer.clear();
            }
            
            apartmentMarkersRef.current = [];
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }
            
            toast.info('아파트 마커를 제거했습니다', { duration: 1000 });
          }, 0);
        }
      };
    } else {
      if (apartmentClusterer) {
        setTimeout(() => {
          // Clear all clusterers if apartmentClusterer is an object with multiple clusterers
          if (typeof apartmentClusterer === 'object' && !Array.isArray(apartmentClusterer)) {
            Object.values(apartmentClusterer).forEach(clusterer => {
              if (clusterer && typeof clusterer.clear === 'function') {
                clusterer.clear();
              }
            });
          } else if (apartmentClusterer && typeof apartmentClusterer.clear === 'function') {
            apartmentClusterer.clear();
          }
          
          apartmentMarkersRef.current = [];
          if (infoWindowRef.current) {
            infoWindowRef.current.close();
          }
          
          document.querySelectorAll('.custom-marker').forEach(el => {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
          
          toast.info('아파트 마커를 제거했습니다', { duration: 1000 });
        }, 0);
      }
    }
  }, [map, apartments, loading, markerType, scriptLoad]);

  useEffect(() => {
    const checkSelectedDong = () => {
      const storedDong = localStorage.getItem('selectedDong');
      if (storedDong) {
        setSelectedDong(storedDong);
      }
    };

    checkSelectedDong();

    const handleLocalStorageChange = (event) => {
      if (event && event.detail && event.detail.key === 'selectedDong') {
        setSelectedDong(event.detail.value);
      } else {
        checkSelectedDong();
      }
    };
    
    window.addEventListener('localStorageChange', handleLocalStorageChange);
    window.addEventListener('storage', checkSelectedDong);

    return () => {
      window.removeEventListener('localStorageChange', handleLocalStorageChange);
      window.removeEventListener('storage', checkSelectedDong);
    };
  }, []);

  const handleMarkerClick = (apartment) => {
    setSelectedMarker(apartment);
  };
  
  const handleSidebarClose = () => {
    setSelectedMarker(null);
  };

  return (
    <>
      <div className="absolute top-20 left-4 md:left-10 z-9999 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-2">
        <select 
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={markerType}
          onChange={(e) => onMarkerTypeChange(e.target.value)}
        >
          <option value="apartment">아파트</option>
        </select>
      </div>
      
      <KakaoMapSidebar 
        selectedMarker={selectedMarker}
        onClose={handleSidebarClose}
      />
    </>
  );
};

export default KakaoMapViewType;
