import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ data, startIndex, setStartIndex }) => {
  const totalPages = Math.ceil(data.length / 10);
  const currentPage = startIndex / 10 + 1;

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 10);
  };

  const handleNext = () => {
    if (startIndex < (totalPages - 1) * 10) setStartIndex(startIndex + 10);
  };

  return (
    <div className="flex items-center justify-start gap-2 mt-4">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className=" disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        if (i > 4 && i < totalPages - 1) {
          if (i === 5)
            return (
              <span key="dots" className="px-2">
                ...
              </span>
            );
          return null;
        }
        return (
          <button
            key={i}
            onClick={() => setStartIndex(i * 10)}
            className={`px-3 py-1 rounded-4xl ${
              startIndex === i * 10
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className=" disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
