const express = require("express")
const router = express.Router()
const {
    accessChats,fetchChats,createGroupChat,fetchGroups,groupExit,addSelfToGroup,fetchChatDetails
} = require("../Controllers/chatController")
const protect = require("../Utils/authMiddleware")

router.post("/",protect,accessChats)
router.get("/",protect,fetchChats)
router.post("/createGroup",protect,createGroupChat)
router.get("/fetchGroups",protect,fetchGroups)
router.post("/groupExit",protect,groupExit)
router.put("/addSelfToGroup",protect,addSelfToGroup)
router.post("/fetchChatDetails",protect,fetchChatDetails)
module.exports = router