import { FastifyReply, FastifyRequest } from "fastify";
import { curPro } from "../../helper/product.help";
import { statusUpd } from "../../schemas/history.schema";
import { getHistoryHelp, sHisto, updateHelp } from "../../helper/history.help";


export async function updateStatusHandler(req: FastifyRequest<{
    Params: {id: number},
    Body: statusUpd
}>, rply: FastifyReply) {
    const userId = req.user.uuid
    const {status} = req.body
    const customerId = req.params.id
    const product = await curPro()
    const cur_Pro = product.filter((u) => userId === u.sellerId)
    const stats_Cur = await sHisto(customerId)
    const cur_stats = stats_Cur.find((u) => cur_Pro.some((p) => p.cuid === u.productId))
    if(!cur_stats) {
        return rply.code(203).send({msg: "not found"})
    }
    await updateHelp({status}, customerId)
    return rply.code(201).send({msg: "update status succes"})
}


export async function getHistoryCustomer(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid
    const product = await curPro()
    const history = await getHistoryHelp()
    const our_pro = product.filter((u) => userId === u.sellerId)
    const cur_history = history.filter((u) => our_pro.some((p) => p.cuid === u.productId))
    const result = cur_history.flatMap((u) => {
        const cur_pro = our_pro.find((p) => p.cuid === u.productId)
        return {
            history: u,
            product: cur_pro
        }
    })

    return rply.code(200).send(result)
}