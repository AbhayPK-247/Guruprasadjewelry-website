import logo from '@/assets/loading.png';

const LoadingSpinner = () => {
  return (
    <div className="relative w-24 h-24">
      <img src={logo} alt="Loading..." className="absolute inset-0 m-auto w-16 h-16" />
      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;