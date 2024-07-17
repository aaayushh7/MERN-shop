import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-4 mt-10">
          <AdminMenu />

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left px-4 py-2">ITEMS</th>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">USER</th>
                  <th className="text-left px-4 py-2">DATE</th>
                  <th className="text-left px-4 py-2">TOTAL</th>
                  <th className="text-left px-4 py-2">PAID</th>
                  <th className="text-left px-4 py-2">DELIVERED</th>
                  <th className="text-left px-4 py-2"></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="px-4 py-2">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-20 h-20 object-cover"
                      />
                    </td>
                    <td className="px-4 py-2">{order._id}</td>

                    <td className="px-4 py-2">{order.user ? order.user.username : "N/A"}</td>

                    <td className="px-4 py-2">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>

                    <td className="px-4 py-2">$ {order.totalPrice}</td>

                    <td className="px-4 py-2">
                      {order.isPaid ? (
                        <p className="p-1 text-center bg-green-400 w-24 rounded-full">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-24 rounded-full">
                          Pending
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {order.isDelivered ? (
                        <p className="p-1 text-center bg-green-400 w-24 rounded-full">
                          Completed
                        </p>
                      ) : (
                        <p className="p-1 text-center bg-red-400 w-24 rounded-full">
                          Pending
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                          More
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderList;
