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
}