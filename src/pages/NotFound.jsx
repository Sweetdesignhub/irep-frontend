
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:bg-slate-900 dark:text-gray-100 p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                <p className="text-2xl mb-4 dark:text-gray-300">Page Not Found</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;