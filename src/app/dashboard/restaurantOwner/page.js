import { getProcessedOrders } from "@/actions/restOwner/getProcessedOrders";
import RenderOrders from "@/components/restaurantAdmin/orders/RenderOrders";
import { cookies } from "next/headers";

// Function to get token from cookies
const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
};

// Function to fetch menu data
const fetchMenuData = async (token) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/menu/get`, {
    headers: { Authorization: token },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load menu");
  }

  return response.json();
};

// Function to fetch order requests 
const fetchOrderRequests = async (token) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/order/get`, {
    headers: { Authorization: token },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  const data = await response.json();
  // console.log(data.orders);
  const { todayOrders, previousOrders } = await getProcessedOrders(data.orders); // Call the function to get 
  // console.log(previousOrders);
  return {todayOrders, previousOrders}
};

// Main function
const OfficeAdmin = async () => {
  const token = await getAuthToken();

  if (!token) {
    return <p className="text-red-500 text-center">Authentication required</p>;
  }

  try {
    const menuData = await fetchMenuData(token);
    const { todayOrders, previousOrders } = await fetchOrderRequests(token);

    console.log("Menu Data:", menuData);
    // console.log("Order Data:", todayOrders, previousOrders );

    // Get today's menu
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDay = daysOfWeek[new Date().getDay()];
    const todaysMenu = menuData?.menu?.regularItem?.[currDay] ?? "Menu not available yet";

    return (
      <div className="my-12 mx-2">
        <h2 className="text-center text-section-heading my-6">Dashboard</h2>

        <div className="text-center">
          <p >
            Hello, Today is <b>{todaysMenu.Theme} - {currDay}</b>, below are the order requests.
          </p>
        </div>

        <div>
          <RenderOrders todayOrders={todayOrders} allDaysMenu={menuData} todaysMenu={todaysMenu} previousOrders={previousOrders} />
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500 text-center">{error.message}</p>;
  }
};

export default OfficeAdmin;
