import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import Head from 'next/head';
import Link from 'next/link';

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    } catch (err) {
      // Invalid token, show landing page
    }
  }

  return { props: {} };
}

export default function Home() {
  return (
    <>
      <Head>
        <title>AutoBlog – AI Blogging for Any Site</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Nav */}
        <header className="w-full px-6 py-4 bg-white shadow flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AutoBlog</h1>
          <div className="space-x-4">
            <Link href="auth/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              AI Blog Content for Any Website
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Embed an iframe, get weekly SEO-optimized content on autopilot. No plugins. No setup.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-4">
          &copy; {new Date().getFullYear()} Alder Creek Digital
        </footer>
      </div>
    </>
  );
}
