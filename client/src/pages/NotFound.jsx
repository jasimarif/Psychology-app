import { Link } from 'react-router-dom';
import error404Svg from '@/assets/error 404.svg';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <img
        src={error404Svg}
        alt="404 - Page not found"
        className="w-full max-w-md mb-8"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2 font-nunito">
        Page Not Found
      </h1>
      <p className="text-gray-600 mb-6 text-center font-nunito">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-customGreen text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors font-nunito"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
