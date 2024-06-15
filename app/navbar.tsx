'use client';

import styles from '@/app/styles/root/navbar.module.scss';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import cn from 'classnames';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';

const navigation = [
  { name: 'Monthly Report', href: '/monthly-report' },
  { name: 'Reservations', href: '/reservations-data' },
  { name: 'Playground', href: '/playground' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Disclosure as="nav" className={cn('shadow-sm', styles.disclosure)}>
      {({ open }) => (
        <>
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
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="avatar placeholder">
                  <div className="text-primary-content bg-primary mask-square h-8 w-20">
                    <span className="text-base">{user.name}</span>
                  </div>
                </div>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full text-sm hover:text-accent">
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user && (
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'flex w-full px-4 py-2 text-sm text-gray-700'
                              )}
                              onClick={async () => {
                                await signOut();
                                router.push('/');
                              }}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center square bg-gray-100 p-2 text-neutral hover:bg-gray-100 hover:text-accent">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    pathname === item.href
                      ? 'bg-primary-content w-48 border-neutral text-neutral'
                      : 'border-transparent w-48 text-primary-content hover:bg-primary-content hover:border-neutral hover:text-neutral',
                    'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="border-t-2 border-primary-content pt-4 pb-3">
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <div className="avatar placeholder">
                      <div className="text-primary-content bg-primary mask-square h-8 w-20">
                        <span className="text-base">{user.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={async () => {
                      await signOut();
                      router.push('/');
                    }}
                    className="block px-4 py-2 text-base font-medium text-primary-content hover:bg-primary-content hover:text-neutral ml-1"
                  >
                    Sign out
                  </button>
                </div>
              </>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
