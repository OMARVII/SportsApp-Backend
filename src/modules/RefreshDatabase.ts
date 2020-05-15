import classModel from './../models/Class';
import clientModel from './../models/user/Client';
import IClient from './../interfaces/user/IClient';
import IClass from './../interfaces/class/IClass';

export async function refresh(user:IClient):Promise<IClient>{
    return new Promise<IClient>(async (resolve,reject)=>{
        const currentDate = new Date();
        await(async ()=>{
            for(let i=0;i<user.reservedClasses.length;i++){
                await classModel.findById(user.reservedClasses[i])
                .then((classObj:IClass)=>{
                    if(classObj.date<currentDate){
                        user.history.push(classObj.id);
                        user.reservedClasses.splice(i,1);
                        i--;
                    }
                })
            }  
        })()
        await user.save().then((client:IClient)=>{
            resolve(client)
        })
        
    })
}