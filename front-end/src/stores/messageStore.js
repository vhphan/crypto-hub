import {defineStore} from "pinia";


const dateToString = (date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
export const useMessageStore = defineStore({
        id: 'message',
        state: () => ({

            notifications: [
                {
                    id: 1,
                    title: 'New message 1',
                    message: 'You have a new message',
                    read: false,
                    date: dateToString(new Date())
                },
                {
                    id: 2,
                    title: 'New message 2',
                    message: 'You have a new message',
                    read: false,
                    date: dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24))
                },
                {
                    id: 3,
                    title: 'New message 3',
                    message: 'You have a new message',
                    read: false,
                    date: dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2))
                },
                {
                    id: 4,
                    title: 'New message 4',
                    message: 'You have a new message',
                    read: true,
                    date: dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3))
                },
                {
                    id: 5,
                    title: 'New message 5',
                    message: 'You have a new message',
                    read: true,
                    date: dateToString(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 4))
                }

            ],
        }),
        getters: {
            getNumberOfNotifications() {
                return this.notifications.filter(n => !n.read).length;
            }
        },
        actions: {
            markRead(id) {
                const notification = this.notifications.find(n => n.id === id);
                notification.read = true;
            }
        }

    }
);
