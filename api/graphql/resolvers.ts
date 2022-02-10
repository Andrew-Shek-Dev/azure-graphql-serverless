//https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript
import routes from './kmb.route.json';
import stops from './kmb.stop.json';

const db_routes = routes.map((route,idx)=>({...route,provider:"KMB",id:idx}));
const db_stops = (stops as any).map((stop:any,idx:number)=>({...stop,provider:"KMB"} ));


function getRouteByStop(parent:any){
    console.log(parent)
    const routesObj = db_stops.filter((stop:any) => stop.stop === parent.stop);
    const routeIds = routesObj.map((route:any)=>route.route);
    return db_routes.filter((route:any)=>routeIds.includes(route.route));
}

export const resolvers = {
    Query:{
        getRoutes:()=>db_routes,
        getRoute:(_:any,params:any)=>params.route?db_routes.filter(route=>route.route === params.route):getRouteByStop(params),
        getStops:()=>db_stops,
        getStop:(_:any,params:any)=>params.stop?
        db_stops.filter((stop:any)=> stop.route === params.route && (stop.name_en === params.stop || stop.name_tc === params.stop || stop.name_sc === params.stop)):
        db_stops.filter((stop:any)=> stop.route === params.route),
        getProfile:()=>{
            return [
                {id:0,name:"Personal Assistant",route:"35A",stop:"深水埗楓樹街"},
            ]
        }
    },
    Route:{
        stops:(parent:any,params:any,context:any)=>{
            return db_stops.filter((stop:any)=>stop.route === parent.route && stop.bound === parent.bound);
        }
    },
    Stop:{
        routes:(parent:any,params:any,context:any)=>getRouteByStop(parent),
        route:(parent:any,params:any,context:any)=>{
            const routesObj = db_stops.filter((stop:any) => stop.stop === parent.stop);
            const routeIds = routesObj.map((route:any)=>route.route);
            return db_routes.filter((route:any)=>routeIds.includes(route.route)).filter(route=> route.route === params.route && route.bound === parent.bound)[0];
        }
    }
}