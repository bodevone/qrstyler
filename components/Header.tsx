import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import { Menu } from '@headlessui/react'

export default function Header() {
  const { data: session, status } = useSession();
  const photo: string | undefined = session?.user?.image || undefined

  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-2">
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          qrcodestyler
        </h1>
      </Link>

      {photo ? (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button>
              <Image
                alt="Profile picture"
                src={photo}
                className="w-10 rounded-full"
                width={32}
                height={28}
              />
            </Menu.Button>
          </div>
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1">
              <Menu.Item>
                  <Link
                    href='/generate'
                    className='text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm'
                  >
                    Generate
                  </Link>
              </Menu.Item>
              <Menu.Item>
                  <button
                    className='text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm'
                    onClick={() => signOut()}
                  >
                    Sign out
                  </button>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      ) : (
        <Link
          href="/generate"
          className="bg-black rounded-xl text-white font-medium px-4 py-3 hover:bg-black/80"
        >
          Sign in
        </Link>
      )}
    </header>
  );
}