┌─────────────────────────────────────────────────────────────┐
│ 1. MOUNT CHAT COMPONENT                                      │
├─────────────────────────────────────────────────────────────┤
│ → Receive chatId or userId from route params                 │
│ → Validate user is connection (frontend check)               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. INITIALIZE CHAT                                           │
├─────────────────────────────────────────────────────────────┤
│ → If chatId exists:                                          │
│   - Fetch chat details (getChatById)                         │
│   - Fetch messages (getConversationMessages)                 │
│ → If only userId:                                            │
│   - Create/find chat (createChat)                            │
│   - Then fetch messages                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SETUP REAL-TIME LISTENERS                                 │
├─────────────────────────────────────────────────────────────┤
│ → socket.on('newMessage') - Append to chat                   │
│ → socket.on('messageEdited') - Update in UI                  │
│ → socket.on('messageDeleted') - Remove/mark deleted          │
│ → socket.on('messagesRead') - Update read status             │
│ → socket.on('typing') - Show typing indicator                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. MARK MESSAGES AS READ                                     │
├─────────────────────────────────────────────────────────────┤
│ → When chat becomes visible/focused                          │
│ → markMessagesAsRead({ senderId: otherUserId })             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. SENDING MESSAGES                                          │
├─────────────────────────────────────────────────────────────┤
│ → User types message                                         │
│ → Emit typing indicator (socket)                             │
│ → On send: POST /sendMessage                                 │
│ → Optimistically add to UI                                   │
│ → Socket broadcasts to receiver                              │
└─────────────────────────────────────────────────────────────┘