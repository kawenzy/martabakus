import { FastifyReply, FastifyRequest } from "fastify";
import { curPro } from "../../helper/product.help";
import { getNoAlHe } from "../../helper/notification.help";
import { current } from "../../helper/user.help";



export async function listNotif(req: FastifyRequest, rply: FastifyReply) {
    const userId = req.user.uuid;
    const product = await curPro();
    const notif = await getNoAlHe();
    const customer = await current();
    const cur_pro = product.filter((u) => userId === u.sellerId);

    const results = cur_pro.map((p) => {
      const notifs = notif.find((u) => u.productId === p.cuid)
      const cust = customer.find((u) => u.uuid === notifs?.CusSelId)
      return{
        customer: cust,
        notif: notifs,
        product: p
      }
    }).sort((a,b) => {
      if (a.notif && b.notif) {
        return b.notif.createdAt.getTime() - a.notif.createdAt.getTime();
      } else if (a.notif && !b.notif) {
        return -1;
      } else if (!a.notif && b.notif) {
        return 1;
      } else {
        return 0;
      }
    });
    return rply.code(200).send(results);
  }