import Layout from "../components/Layout";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700">Welcome to your blog dashboard. More features coming soon.</p>
      </div>
    </Layout>
  );
}



export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return { props: {} };
  } catch {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
}
