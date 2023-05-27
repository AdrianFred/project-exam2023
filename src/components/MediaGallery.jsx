import { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

export default function MediaGallery({ media }) {
  const [imageIndex, setImageIndex] = useState(0);
  const nextImage = () => {
    if (imageIndex === media.length - 1) {
      setImageIndex(0);
    } else {
      setImageIndex(imageIndex + 1);
    }
  };

  const prevImage = () => {
    if (imageIndex === 0) {
      setImageIndex(media.length - 1);
    } else {
      setImageIndex(imageIndex - 1);
    }
  };

  const goToImage = (index) => {
    setImageIndex(index);
  };

  return (
    <div className="max-w-[800px] max-h-[600px] h-full w-full mx-auto relative group z-10">
      <div style={{ backgroundImage: `url(${media[imageIndex]})` }} className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>
      <div className="hidden absolute group-hover:block top-[50%] -translate-x-0 translate-y-[50%] right-5 text2xl rounded-full p-2 bg-black/50 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextImage} size={30} />
      </div>
      <div className="hidden absolute group-hover:block top-[50%] -translate-x-0 translate-y-[50%] left-5 text2xl rounded-full p-2 bg-black/50 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevImage} size={30} />
      </div>
      <div className="flex top-4 justify-center py-2">
        {media.map((image, index) => (
          <RxDotFilled
            onClick={() => goToImage(index)}
            key={index}
            size={25}
            className={`mx-1 cursor-pointer ${imageIndex === index ? "text-black" : "text-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
}
