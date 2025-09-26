import { Context } from "../context";
import {friendService} from "../services/friend.service";

export const friendResolvers = {
    Query: {
        getFriends: (_: any, {id}: {id: string}, ctx: Context) => friendService.getFriends(_, {id}, ctx),
    }
}