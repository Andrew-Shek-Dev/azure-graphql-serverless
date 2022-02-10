import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import moment from 'moment-timezone';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const str_datetime = (req.query.datetime || (req.body && req.body.datetime));
    context.res = {
        body: {
            datetime:moment(str_datetime).format("DD/MM/YYYY HH:mm:ss")
        }
    };

};

export default httpTrigger;