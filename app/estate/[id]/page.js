'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaRulerCombined, FaWonSign, FaChartLine, FaMapMarkerAlt, FaHome, FaFileDownload } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const dummyImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
];

const generatePropertyData = (id) => {
  const randomIndex = Math.floor(Math.random() * 100);
  
  return {
    id,
    complexName: `그린파크 아파트 ${randomIndex}차`,
    address: `서울시 강남구 테헤란로 ${randomIndex}길 ${id}`,
    buildYear: 2000 + Math.floor(Math.random() * 22),
    totalUnits: Math.floor(Math.random() * 500) + 100,
    totalFloors: Math.floor(Math.random() * 20) + 10,
    areaSize: Math.floor(Math.random() * 40) + 20,
    pyeongSize: Math.floor(Math.random() * 30) + 15,
    price: Math.floor(Math.random() * 50000) + 30000,
    pricePerPyeong: Math.floor(Math.random() * 3000) + 1500,
    maintenanceFee: Math.floor(Math.random() * 30) + 10,
    parkingRatio: (Math.random() * 1 + 1).toFixed(1),
    heatType: ['개별난방', '중앙난방', '지역난방'][Math.floor(Math.random() * 3)],
    recentTransactions: Array(5).fill().map(() => ({
      date: `2023.${Math.floor(Math.random() * 12) + 1}.${Math.floor(Math.random() * 28) + 1}`,
      price: Math.floor(Math.random() * 50000) + 30000,
      floor: Math.floor(Math.random() * 15) + 1,
      type: ['매매', '전세', '월세'][Math.floor(Math.random() * 3)],
      area: Math.floor(Math.random() * 40) + 20,
    })),
    nearbyFacilities: [
      { name: '그린초등학교', distance: '650m', time: '10분', type: '교육' },
      { name: '그린역 (2호선)', distance: '520m', time: '8분', type: '교통' },
      { name: '그린병원', distance: '980m', time: '15분', type: '의료' },
      { name: '그린마트', distance: '320m', time: '5분', type: '쇼핑' },
      { name: '그린공원', distance: '450m', time: '7분', type: '여가' },
    ],
    images: dummyImages,
    description: `그린파크 아파트는 쾌적한 주거환경과 편리한 교통망을 갖춘 프리미엄 아파트입니다. 단지 내 다양한 커뮤니티 시설과 함께 인근에 공원, 학교, 상업시설이 위치해 있어 생활 편의성이 뛰어납니다. 특히 남향 위주의 배치로 일조권이 우수하며, 효율적인 평면 설계로 공간 활용도가 높습니다.`,
  };
};

const formatPrice = (price) => {
  if (price >= 10000) {
    const uk = Math.floor(price / 10000);
    const man = price % 10000;
    return `${uk}억 ${man > 0 ? `${man}만` : ''}원`;
  }
  return `${price}만원`;
};

const generatePriceData = () => {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const basePrice = Math.floor(Math.random() * 50000) + 30000; 
  
  return {
    labels: months,
    datasets: [
      {
        label: '평균 매매가(만원)',
        data: months.map(() => basePrice + Math.floor(Math.random() * 5000 - 2500)),
        borderColor: 'rgb(22, 163, 74)',
        backgroundColor: 'rgba(22, 163, 74, 0.5)',
        tension: 0.3,
      },
    ],
  };
};

export default function PropertyDetail({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [selectedImage, setSelectedImage] = useState(0);
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    setProperty(generatePropertyData(id));
    setPriceData(generatePriceData());
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleGoBack = () => {
    window.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-20 mb-20">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleGoBack}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.complexName}</h1>
            <p className="text-gray-600 flex items-center mt-1">
              <FaMapMarkerAlt className="mr-1 text-green-600" /> {property.address}
            </p>
          </div>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg text-sm inline-block">
          <span className="font-medium">단지 고유번호: </span>
          <span className="text-green-700">{id}</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-2">
          <Image 
            src={property.images[selectedImage]} 
            alt={property.complexName} 
            fill
            className="object-cover"
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {property.images.map((image, index) => (
            <div 
              key={index} 
              className={`relative h-20 w-32 rounded-lg overflow-hidden cursor-pointer transition-all ${selectedImage === index ? 'ring-2 ring-green-600' : 'opacity-70'}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image 
                src={image} 
                alt={`${property.complexName} 이미지 ${index + 1}`} 
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-green-800 mb-2 flex items-center">
              <FaFileDownload className="mr-2" /> 상세 매물 보고서
            </h2>
            <p className="text-green-700 max-w-2xl">
              이 매물의 상세 분석 보고서를 다운로드하세요. 가격 추이, 투자 가치 분석, 주변 시설 정보 등 
              중요한 정보를 한눈에 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="py-3 px-6 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium flex items-center">
              <FaFileDownload className="mr-2" /> PDF 다운로드
            </button>
            <button className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center">
              <span className="mr-2">✉️</span> 이메일로 받기
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-700">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium mr-2">NEW</span>
          최근 업데이트: {new Date().toLocaleDateString('ko-KR', {year: 'numeric', month: 'long', day: 'numeric'})}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-1">평균 매매가</p>
          <p className="text-2xl font-bold text-green-600">{formatPrice(property.price)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-1">평당 가격</p>
          <p className="text-2xl font-bold text-green-600">{property.pricePerPyeong}만원</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-1">건축년도</p>
          <p className="text-2xl font-bold text-green-600">{property.buildYear}년 <span className="text-sm font-normal text-gray-500">({new Date().getFullYear() - property.buildYear}년차)</span></p>
        </div>
      </div>

      <div className="border-b mb-6">
        <div className="flex">
          <button 
            className={`py-3 px-5 font-medium text-center ${activeTab === 'info' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('info')}
          >
            단지 정보
          </button>
          <button 
            className={`py-3 px-5 font-medium text-center ${activeTab === 'price' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('price')}
          >
            시세 정보
          </button>
          <button 
            className={`py-3 px-5 font-medium text-center ${activeTab === 'nearby' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('nearby')}
          >
            주변 환경
          </button>
        </div>
      </div>

      <div className="mb-10">
        {activeTab === 'info' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaHome className="mr-2 text-green-600" /> 단지 개요
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {property.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">단지명</p>
                  <p className="font-medium">{property.complexName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">주소</p>
                  <p className="font-medium">{property.address}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">건축년도</p>
                  <p className="font-medium">{property.buildYear}년 ({new Date().getFullYear() - property.buildYear}년차)</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">세대수</p>
                  <p className="font-medium">{property.totalUnits}세대</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">최고층</p>
                  <p className="font-medium">{property.totalFloors}층</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">난방방식</p>
                  <p className="font-medium">{property.heatType}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">주차</p>
                  <p className="font-medium">세대당 {property.parkingRatio}대</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">관리비</p>
                  <p className="font-medium">약 {property.maintenanceFee}만원/월</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaRulerCombined className="mr-2 text-green-600" /> 면적 정보
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">타입</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">전용면적</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">공급면적</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">평형</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(3)].map((_, idx) => {
                      const area = property.areaSize + (idx * 10);
                      const pyeong = Math.floor(area / 3.3);
                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{String.fromCharCode(65 + idx)}타입</td>
                          <td className="py-3 px-4 text-sm">{area}m²</td>
                          <td className="py-3 px-4 text-sm">{area + Math.floor(Math.random() * 10) + 5}m²</td>
                          <td className="py-3 px-4 text-sm">{pyeong}평</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'price' && priceData && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaChartLine className="mr-2 text-green-600" /> 시세 추이
              </h2>
              <div className="h-80">
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
                        text: '최근 12개월 평균 매매가 추이'
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FaWonSign className="mr-2 text-green-600" /> 최근 거래 내역
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">거래일</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">타입</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">면적</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">층수</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">거래가</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {property.recentTransactions.map((transaction, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">{transaction.date}</td>
                        <td className="py-3 px-4 text-sm font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === '매매' ? 'bg-green-100 text-green-800' : 
                            transaction.type === '전세' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">{transaction.area}m²</td>
                        <td className="py-3 px-4 text-sm">{transaction.floor}층</td>
                        <td className="py-3 px-4 text-sm font-medium">{formatPrice(transaction.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nearby' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">주변 시설</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.nearbyFacilities.map((facility, idx) => (
                  <div key={idx} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      facility.type === '교육' ? 'bg-blue-100 text-blue-600' :
                      facility.type === '교통' ? 'bg-green-100 text-green-600' :
                      facility.type === '의료' ? 'bg-red-100 text-red-600' :
                      facility.type === '쇼핑' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {facility.type === '교육' ? '🏫' :
                       facility.type === '교통' ? '🚇' :
                       facility.type === '의료' ? '🏥' :
                       facility.type === '쇼핑' ? '🛒' : '🏞️'}
                    </div>
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="text-sm text-gray-500">도보 {facility.time} ({facility.distance})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">교통 환경</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3">
                    <span className="text-lg">🚇</span>
                  </div>
                  <div>
                    <p className="font-medium">그린역 (2호선)</p>
                    <p className="text-sm text-gray-500">도보 8분 (520m)</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                    <span className="text-lg">🚌</span>
                  </div>
                  <div>
                    <p className="font-medium">그린아파트 버스정류장</p>
                    <p className="text-sm text-gray-500">도보 3분 (200m)</p>
                    <p className="text-xs text-gray-500 mt-1">운행버스: 102, 240, 301, 720, 2412</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:static md:bg-transparent md:border-0 md:p-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
          <button className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex-1">
            문의하기
          </button>
          <button className="py-3 px-6 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium flex-1">
            관심 등록
          </button>
        </div>
      </div>
    </div>
  );
} 