import { Expo } from 'expo-server-sdk'
import PushToken from '../models/PushToken';
const expo = new Expo();
export const getTokens = async () => {
    let pushTokens = [];
    await PushToken.find({}, '-_id -createdAt -updatedAt -__v', (err, tokens) => {

        for (let item of tokens) {
            pushTokens.push(item.token);
        }
    })
    return pushTokens;

}
export const SendNotfication = (title: string, body: any, data: any, pushTokens: any) => {
    let notifications = [];
    for (let pushToken of pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: "default",
            title: title,
            body: body,
            data: data 
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();

}