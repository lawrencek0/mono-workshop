import AuthServ from './AuthServ';

exports.register = function(req: { body: any }, res: { send: { (arg0: any): void; (arg0: any): void } }){
    const register = AuthServ.Register(req.body, function(err: any, result: any){
    if(err)
        res.send(err);
    res.send(result);
  });
};

exports.login = function(req: { body: any }, res: { send: { (arg0: any): void; (arg0: any): void } }){
    const login = AuthServ.Login(req.body, function(err: any, result: any){
        if(err)
           res.send(err);
        res.send(result);
    });
 };

 exports.validateToken = function(req: { body: { token: any } }, res: { send: { (arg0: any): void; (arg0: any): void } }){
    const validate = AuthServ.Validate(req.body.token,function(err: { message: any }, result: any){
        if(err)
            res.send(err.message);
        res.send(result);
    });
};
export default exports;