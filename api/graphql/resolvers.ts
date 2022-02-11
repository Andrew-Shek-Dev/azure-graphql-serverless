//https://stackoverflow.com/questions/49996456/importing-json-file-in-typescript
import routes from './kmb.route.json';
import stops from './kmb.stop.json';
import fetch from 'node-fetch';

const db_routes = routes.map((route,idx)=>({...route,provider:"KMB",id:idx}));
const db_stops = (stops as any).map((stop:any,idx:number)=>({...stop,provider:"KMB"} ));


function getRouteByStop(parent:any){
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
        getNextETA:async(_:any,params:any)=>{
            const {route,stop} = params;
            const stopInfos = db_stops.filter((stop:any)=> stop.route === params.route && (stop.name_en === params.stop || stop.name_tc === params.stop || stop.name_sc === params.stop))

            let res:any = [];
            for (let stopInfo of stopInfos){
                const etaListRes = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/eta/${stopInfo.stop}/${route}/1`);
                const {data} = await etaListRes.json();
                const values = data.map((d:any)=>({
                    seq:d.seq,
                    co:"KMB",
                    bound:d.dir,
                    route,
                    stop,
                    eta:d.eta
                }));
                const outData = values.filter((d:any)=>d.bound === "O");
                const inData = values.filter((d:any)=>d.bound === "I");
                if (outData.length>0){
                    res.push(outData[0]);
                }
                if (inData.length>0){
                    res.push(inData[0]);
                }
            }
            return res;
        },
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
    },
    ETA:{
        route:async(parent:any)=>{
            const routes = db_routes.filter(route=>route.route === parent.route);
            return routes.filter((route:any)=>route.bound === parent.bound)[0];
        },
        stop:async(parent:any)=>{
            const stops =db_stops.filter((stop:any)=> stop.route === parent.route && (stop.name_en === parent.stop || stop.name_tc === parent.stop || stop.name_sc === parent.stop));
            return stops.filter((stop:any)=>stop.bound === parent.bound)[0];
        }
    }
}