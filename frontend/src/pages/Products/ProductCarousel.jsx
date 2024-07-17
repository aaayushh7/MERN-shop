import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 w-full max-w-[1200px] mx-auto px-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="outline-none">
                <div className="grid md:grid-cols-2 gap-4">
                  <img
                    src={image}
                    alt={name}
                    className="w-full rounded-lg object-cover h-[300px] md:h-[400px]"
                  />
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{name}</h2>
                      <p className="text-xl font-semibold mb-4">$ {price}</p>
                      <p className="mb-4 line-clamp-3">{description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="flex items-center mb-2">
                          <FaStore className="mr-2" /> Brand: {brand}
                        </p>
                        <p className="flex items-center mb-2">
                          <FaClock className="mr-2" /> Added: {moment(createdAt).fromNow()}
                        </p>
                        <p className="flex items-center mb-2">
                          <FaStar className="mr-2" /> Reviews: {numReviews}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center mb-2">
                          <FaStar className="mr-2" /> Ratings: {Math.round(rating)}
                        </p>
                        <p className="flex items-center mb-2">
                          <FaShoppingCart className="mr-2" /> Quantity: {quantity}
                        </p>
                        <p className="flex items-center mb-2">
                          <FaBox className="mr-2" /> In Stock: {countInStock}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;