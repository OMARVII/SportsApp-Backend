import classModel from './../models/Class';
import clientModel from './../models/user/Client';
import IClient from './../interfaces/user/IClient';
import IClass from './../interfaces/class/IClass';

export async function refresh(){
    const currentDate = new Date();
    await classModel.find({})
    .then(async (classes:IClass[])=>{
        classes.forEach(async (classObj:IClass) => {
            if(classObj.date<currentDate){
                await clientModel.find({ '_id': { $in: classObj.users }})
                .then(async(clients:IClient[])=>{
                    clients.forEach(async(client) => {
                        if(client.reservedClasses.includes(classObj._id)){
                            const classIndex = client.reservedClasses.indexOf(classObj._id);
                            client.reservedClasses.splice(classIndex,1);
                            client.history.push(classObj._id);
                            await client.save();
                        }
                    });
                })
            }
        });
    })
}