import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      {cartItems.length === 0 ? (
        <div className="text-center">
          Your cart is empty <Link to="/shop" className="text-blue-500 hover:underline">Go To Shop</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="lg:w-2/3 pr-4">
            <h1 className="text-2xl font-semibold mb-4 mt-9">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center mb-6 pb-6 border-b">
                <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left sm:ml-4">
                  <Link to={`/product/${item._id}`} className="text-pink-500 hover:underline">
                    {item.name}
                  </Link>

                  <div className="mt-2 text-white">{item.brand}</div>
                  <div className="mt-2 text-white font-bold">
                    ₨ {item.price}
                  </div>
                </div>

                <div className="flex items-center mt-4 sm:mt-0">
                  <select
                    className="w-20 p-1 border rounded text-black mr-4"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    className="text-red-500"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className=" p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>

              <div className="text-2xl font-bold mb-4">
                ₨ {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </div>

              <button
                className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full hover:bg-pink-600 transition-colors"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;