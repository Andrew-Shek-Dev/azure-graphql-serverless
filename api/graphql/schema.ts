import { gql } from 'apollo-server-azure-functions';
export const typeDefs = gql`
type Query{
    getRoutes:[Route]
    getRoute(route:String,stop:String):[Route]
    getStops:[Stop]
    getStop(stop:String,route:String):[Stop]
    getNextETA(route:String,stop:String):[ETA]
    getProfile:[Profile]
}

enum PROVIDER{
    KMB
}

type Route{
    id:ID!
    provider:PROVIDER!
    route:String
    bound:String
    service_type:String
    orig_en:String
    orig_sc:String
    orig_tc:String
    dest_en:String
    dest_tc:String
    dest_sc:String
    stops:[Stop]
}

type Stop{
    stop:ID!
    provider:PROVIDER!
    route(route:String):Route
    bound:String
    service_type:String
    seq:String
    name_en:String
    name_tc:String
    name_sc:String
    routes:[Route]
}

type ETA{
    seq:Int!
    co:PROVIDER!
    bound:String
    route:Route!
    stop:Stop!
    eta:String
}

type Profile{
    id:ID!
    name:String
    route:String
    bound:String
    stop:String
}
`;