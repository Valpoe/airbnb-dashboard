'use client';

import styles from '@/app/styles/root/navbar.module.scss';
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const navigation = [
  { name: 'Monthly Report', href: '/monthly-report' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Calculators', href: '/calculators' }
];

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  return (
    <nav className={cn('shadow-sm', styles.navContainer)}>
      <div className={styles.mainContainer}>
        <div className={styles.secondContainer}>
          <div className={styles.thirdContainer}>
            <div className={styles.fourthContainer}>
              <Link href="/monthly-report">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="text-gray-100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="100%"
                    height="100%"
                    rx="16"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>
            <div className={styles.navLinkContainer}>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? styles.activeLink
                      : styles.inactiveLink,
                    styles.navLink
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className={styles.userContainer}>
            <div className="avatar placeholder">
              <div className={styles.userName}>
                <span>{user.name}</span>
              </div>
            </div>
            <div
              className={styles.menu}
              ref={menuRef}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <button className={styles.menuButton}>
                <span className={styles.srOnly}>Open user menu</span>
                <UserCircleIcon
                  className={styles.userIcon}
                  aria-hidden="true"
                />
              </button>
              {menuOpen && (
                <div className={styles.menuItems}>
                  <button
                    className={styles.signOutButton}
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.mobileNavContainer}>
            <button
              className={styles.mobileButton}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={styles.srOnly}>Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className={styles.mobileIcon} aria-hidden="true" />
              ) : (
                <Bars3Icon className={styles.mobileIcon} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileLinksContainer}>
          <div className={styles.mobileLinks}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  pathname === item.href
                    ? styles.mobileLinkActive
                    : styles.mobileLinkInactive,
                  styles.mobileLink
                )}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className={styles.border}>
            <div className={styles.mobileContentContainer}>
              <div className={styles.userIconContainer}>
                <UserCircleIcon
                  className={styles.userIcon}
                  aria-hidden="true"
                />
              </div>
              <div>
                <div className="avatar placeholder">
                  <div className={styles.userName}>
                    <span>{user.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mobileSignOutContainer}>
              <button
                onClick={handleSignOut}
                className={styles.mobileSignOutButton}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
