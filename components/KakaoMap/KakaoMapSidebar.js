import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaBuilding, FaRulerCombined, FaWonSign, FaChartLine } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const generatePriceData = () => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
  const basePrice = Math.floor(Math.random() * 50000) + 30000; 
  
  return {
    labels: months,
    datasets: [
      {
        label: '평균 매매가(만원)',
        data: months.map(() => basePrice + Math.floor(Math.random() * 5000 - 2500)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };
};

const getDummyPropertyInfo = (complexName) => {
  return {
    buildYear: 2000 + Math.floor(Math.random() * 22),
    totalUnits: Math.floor(Math.random() * 500) + 100,
    areaSize: Math.floor(Math.random() * 40) + 20,
    pyeongSize: Math.floor(Math.random() * 30) + 15,
    floorInfo: `${Math.floor(Math.random() * 15) + 1}층 / ${Math.floor(Math.random() * 20) + 5}층`,
    price: Math.floor(Math.random() * 50000) + 30000,
    pricePerPyeong: Math.floor(Math.random() * 3000) + 1500,
    recentTransactions: [
      { date: '2023.11.15', price: Math.floor(Math.random() * 50000) + 30000, floor: Math.floor(Math.random() * 15) + 1 },
      { date: '2023.10.22', price: Math.floor(Math.random() * 50000) + 30000, floor: Math.floor(Math.random() * 15) + 1 },
      { date: '2023.09.05', price: Math.floor(Math.random() * 50000) + 30000, floor: Math.floor(Math.random() * 15) + 1 },
    ]
  };
};

const KakaoMapSidebar = ({ selectedMarker, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [propertyInfo, setPropertyInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (selectedMarker) {
      setIsOpen(true);
      setPriceData(generatePriceData());
      setPropertyInfo(getDummyPropertyInfo(selectedMarker.complexName));
    } else {
      setIsOpen(false);
    }
  }, [selectedMarker]);

  if (!selectedMarker) return null;

  const formatPrice = (price) => {
    if (price >= 10000) {
      const uk = Math.floor(price / 10000);
      const man = price % 10000;
      return `${uk}억 ${man > 0 ? `${man}만` : ''}원`;
    }
    return `${price}만원`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-0 left-0 h-full bg-white shadow-xl overflow-y-auto z-[9999]"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ width: "380px", maxWidth: "90vw" }}
        >
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-5">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold truncate">
                  {selectedMarker.complexName || "아파트 정보"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-green-700 transition-colors"
                  aria-label="닫기"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <p className="text-green-100 mt-1">{selectedMarker.dong || "정보 없음"}</p>
              
              {propertyInfo && (
                <div className="mt-4 bg-white/10 p-3 rounded-lg flex justify-between">
                  <div className="text-center">
                    <p className="text-sm text-green-100">평균 매매가</p>
                    <p className="font-bold">{formatPrice(propertyInfo.price)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-100">평당 가격</p>
                    <p className="font-bold">{propertyInfo.pricePerPyeong}만원</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-green-100">건축년도</p>
                    <p className="font-bold">{propertyInfo.buildYear}년</p>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <a 
                  href={`/estate/${selectedMarker.complexUniqueId || 'unknown'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2 bg-white text-green-700 rounded-md text-center font-medium hover:bg-green-50 transition-colors"
                >
                  자세히 보기
                </a>
              </div>
            </div>
            
            <div className="flex border-b">
              <button 
                className={`flex-1 py-3 font-medium text-center ${activeTab === 'info' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('info')}
              >
                상세정보
              </button>
              <button 
                className={`flex-1 py-3 font-medium text-center ${activeTab === 'price' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('price')}
              >
                시세정보
              </button>
              <button 
                className={`flex-1 py-3 font-medium text-center ${activeTab === 'nearby' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('nearby')}
              >
                주변정보
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'info' && propertyInfo && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FaBuilding className="mr-2 text-green-600" /> 단지 정보
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">단지명</p>
                        <p className="font-medium">{selectedMarker.complexName || "정보 없음"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">세대수</p>
                        <p className="font-medium">{propertyInfo.totalUnits}세대</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">건축년도</p>
                        <p className="font-medium">{propertyInfo.buildYear}년</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">주소</p>
                        <p className="font-medium">{selectedMarker.dong || "정보 없음"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FaRulerCombined className="mr-2 text-green-600" /> 면적 정보
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">공급면적</p>
                        <p className="font-medium">{propertyInfo.areaSize}m² ({propertyInfo.pyeongSize}평)</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">해당 층/전체 층</p>
                        <p className="font-medium">{propertyInfo.floorInfo}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FaWonSign className="mr-2 text-green-600" /> 거래 정보
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">거래일</th>
                            <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">거래가</th>
                            <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">층</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propertyInfo.recentTransactions.map((transaction, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="py-2 px-3 text-sm">{transaction.date}</td>
                              <td className="py-2 px-3 text-sm font-medium">{formatPrice(transaction.price)}</td>
                              <td className="py-2 px-3 text-sm">{transaction.floor}층</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'price' && priceData && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <FaChartLine className="mr-2 text-green-600" /> 시세 추이
                    </h3>
                    <div className="h-64 md:h-80">
                      <Line 
                        data={priceData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                            title: {
                              display: true,
                              text: '최근 6개월 평균 매매가 추이'
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">시세 정보</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-3 bg-white">
                        <p className="text-sm text-gray-500">현재 평균 매매가</p>
                        <p className="text-xl font-bold text-green-600">{formatPrice(propertyInfo.price)}</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                        <p className="text-sm text-gray-500">평당 가격</p>
                        <p className="text-xl font-bold text-green-600">{propertyInfo.pricePerPyeong}만원</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                        <p className="text-sm text-gray-500">전세가율</p>
                        <p className="text-xl font-bold text-green-600">{Math.floor(Math.random() * 30) + 60}%</p>
                      </div>
                      <div className="border rounded-lg p-3 bg-white">
                        <p className="text-sm text-gray-500">3개월 전 대비</p>
                        <p className="text-xl font-bold text-red-500">+{Math.floor(Math.random() * 5) + 1}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'nearby' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">주변 시설</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-2 border-b">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                          <span className="text-lg">🏫</span>
                        </div>
                        <div>
                          <p className="font-medium">OO초등학교</p>
                          <p className="text-sm text-gray-500">도보 10분 (650m)</p>
                        </div>
                      </div>
                      <div className="flex items-center p-2 border-b">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                          <span className="text-lg">🚇</span>
                        </div>
                        <div>
                          <p className="font-medium">OO역</p>
                          <p className="text-sm text-gray-500">도보 8분 (520m)</p>
                        </div>
                      </div>
                      <div className="flex items-center p-2 border-b">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-3">
                          <span className="text-lg">🏥</span>
                        </div>
                        <div>
                          <p className="font-medium">OO병원</p>
                          <p className="text-sm text-gray-500">도보 15분 (980m)</p>
                        </div>
                      </div>
                      <div className="flex items-center p-2">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-3">
                          <span className="text-lg">🛒</span>
                        </div>
                        <div>
                          <p className="font-medium">OO마트</p>
                          <p className="text-sm text-gray-500">도보 5분 (320m)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                  onClick={() => window.open(`https://map.kakao.com/link/to/${selectedMarker.complexName || "목적지"},${selectedMarker.latitude},${selectedMarker.longitude}`, '_blank')}
                >
                  길찾기
                </button>
                <button
                  className="py-3 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium"
                >
                  관심 등록
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KakaoMapSidebar;
