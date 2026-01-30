import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

// create chat store
export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null, // user with whom chat is open
    isUsersLoading: false,// for sidebar users
    isMessagesLoading: false,// for messages of selected user

    // select a user to chat with
    getUsers: async () => {
        set({ isUsersLoading: true }) // start loading
        try {
            const res = await axiosInstance.get("/message/users")
            set({ users: res.data })
        } catch (error) {
            toast.error(error.response.data.messages)
        } finally {
            set({ isUsersLoading: false }) // stop loading
        }
    },

    // get messages of selected user
    getMessages: async (userId) => {
        set({ isMessagesLoading: true }) // start loading
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data }) // set messages, means chat history with selected user
        } catch (error) {
            toast.error(error.response.data.messages)
        } finally {
            set({ isMessagesLoading: false }) // stop loading
        }
    },
     sendMessage: async (messagedata) => {
        const {selectedUser, messages} = get();
        try{
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messagedata);
            set({messages: [...messages, res.data]}) // append new message to messages array
        }catch(error){
            toast.error(error.response.data.message);
        }

     },
    // todo: optimize later this
    setSelectedUser: (selectedUser) => set({ selectedUser })
     
}))

