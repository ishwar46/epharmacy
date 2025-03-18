import Lottie from "react-lottie";
import animationData from "../assets/animations/paper-plane.json";

const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Lottie options={defaultOptions} height={200} width={200} />
      <p className="mt-4 text-lg font-semibold text-gray-600 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;
