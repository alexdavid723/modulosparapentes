import App from "../App"
import Home from "../Pages/home/Home"
import Package from "../Pages/package/Package"
import Dashboard from "../dashboard/dashboard"

const routes = [
    {
        path: "/",
        element: <App />
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "start",
                element: <Home />
            },
            {
                path: "package",
                element: <Package />
            },
            {
                path: "loro",
                element: <div>hOME</div>
            }
        ]
    }
]

export default routes