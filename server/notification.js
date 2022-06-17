import Notification from './db/notification.js';

export default class {
    static getNotifications = async (req, res) => {
        const username = req.session.username;
        const notifications = await Notification.find({username}).sort({created_at:-1}).exec();
        res.json({
            messages: [],
            notifications
        })
    }
    static removeNotification = async (req, res) => {
        const username = req.session.username;
        const notification_id = req.body.notification_id;
        const notification = await Notification.findOne({username, _id: notification_id}).exec();
        if(!notification){
            res.json({
                messages: [{type: 'warning', text: 'notification is not found.'}]
            })
            return;
        }
        await Notification.findOneAndRemove({_id: notification_id}).exec();
        res.json({
            messages: []
        })
    }
}