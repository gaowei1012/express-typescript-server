import express from 'express';
import {resSuccess} from '@/utils/utils'
const router: express.Router = express.Router();

router.get("/testgateway", function (req: any, res: any) {
    res.send(resSuccess('gateway重定向成功', {}));
})


export default router;
