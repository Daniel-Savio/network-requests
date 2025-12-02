import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


export default [
    index("routes/home.tsx"),
    layout("components/layout/index.tsx", [
        route("request", "routes/request.tsx"),
        route("new-ied", "routes/new-ied.tsx")
    ])
] satisfies RouteConfig;