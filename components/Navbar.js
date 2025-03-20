'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  const menuItems = [
    { href: '/', label: '홈' },
    { href: '/search', label: '매물 검색' },
    { href: '/news', label: '부동산 뉴스' },
    { href: '/contact', label: '문의하기' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white text-black shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="부동산 앱 로고"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-2xl font-bold hidden sm:block">
                <span className="text-[var(--primary)]">모르면</span> 
                <span className="text-[var(--secondary)]">손해</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-200 hover:text-[var(--primary)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-md text-base font-medium bg-[var(--primary)] text-white hover:bg-opacity-90 transition-colors">
                    로그인
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 rounded-md text-base font-medium border border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:bg-opacity-10 transition-colors">
                    회원가입
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-200 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">메뉴 열기</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 text-[var(--primary)]`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 text-[var(--secondary)]`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-100`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="block px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-200 hover:text-[var(--primary)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 mt-4 px-3">
            {isSignedIn ? (
              <div className="flex justify-center py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-2 rounded-md text-base font-medium bg-[var(--primary)] text-white hover:bg-opacity-90 transition-colors">
                    로그인
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full px-4 py-2 rounded-md text-base font-medium border border-[var(--secondary)] text-[var(--secondary)] hover:bg-[var(--secondary)] hover:bg-opacity-10 transition-colors">
                    회원가입
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
