import { FastifyReply, FastifyRequest } from "fastify";
import { buyHelp, getHistoryHelp } from "../../helper/history.help";
import { curPro, stokDefeat, stokHelp } from "../../helper/product.help";



export async function buyHandler(req: FastifyRequest<{Params: {id: string}}>, rply: FastifyReply) {
    const userId = req.user.uuid
    const id = req.params.id
    const defProduct = (await stokDefeat(id)).find((u) => u.stok)
    if(!defProduct?.stok){
      return rply.code(400).send({msg: "product out of stock"})
    }
    const limit = defProduct!.stok - 1
    await stokHelp(limit, id) 
    await buyHelp(id, userId)
    return rply.code(201).send({msg: "buy product succes"}) 
}

export async function historyHandler(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid
    const history = await getHistoryHelp()
    const product = await curPro()
    const cur_history = history.filter((u) => userId === u.userId)
    const result = cur_history.flatMap((u) => {
        const product_h = product.find((p) => p.cuid === u.productId);
        if (product_h) {
          return {
            history: u,
            product: product_h,
          };
        }
        return [];
      });
    return rply.code(200).send(result)
}