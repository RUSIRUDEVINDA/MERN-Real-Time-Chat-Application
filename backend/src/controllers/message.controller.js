import User from '../models/user.model.js';
import Message from '../models/message.model.js';

export const getUsersForSidebar = async(req, res) => {
    try{
        const loggedInUser = req.user._id // from protectRoute middleware
        const fillteredUsers = await User.find({_id:{$ne:loggedInUser}}).select("-password -email -createdAt -updatedAt -__v")
        res.status(200).json(fillteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export const getMessages = async(req, res) =>{
    try{
       
        const {id:userToChatId} = req.params;
        const myId = req.user._id; // from protectRoute middleware

        // fetch messages between logged in user and userToChatId

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)

    }catch(error){
        console.log("Error in getMessages: ", error.message)
        res.status(500).json({error:"Internal server error"})
    }
}

export const sendMessage = async(req, res)=>{
    try{
        const {text, image} = req.body;
        const {id:receiverId} = req.params; // id of the user to whom message is to be sent
        const senderId = req.user._id; // from protectRoute middleware 

        let imageUrl
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url // get the uploaded image url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        // todo: emit socket event for real-time message update

        res.status(201).json(newMessage)

     }catch(error){
        console.log("Error in sendMessage controller: ", error.message)
        res.status(500).json({error:"Internal server error"})
     }

}

