
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Code,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Pin,
  Archive,
  Trash2,
  Copy,
  Reply,
} from "lucide-react"


export function ChatSystem() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const connections = [
    {
      id: "1",
      name: "Emma Wilson",
      username: "@emmawilson",
      avatar: "/developer-woman.png",
      status: "online",
      lastMessage: "Hey! How's the new project going?",
      lastMessageTime: "2m ago",
      unreadCount: 2,
      isTyping: false,
    },
    {
      id: "2",
      name: "David Kim",
      username: "@davidkim",
      avatar: "/developer-man.png",
      status: "away",
      lastMessage: "Thanks for the code review!",
      lastMessageTime: "1h ago",
      unreadCount: 0,
    },
    {
      id: "3",
      name: "Lisa Zhang",
      username: "@lisazhang",
      avatar: "/developer-woman-2.jpg",
      status: "online",
      lastMessage: "Let's schedule that pair programming session",
      lastMessageTime: "5m ago",
      unreadCount: 1,
      isTyping: true,
    },
    {
      id: "4",
      name: "Carlos Rodriguez",
      username: "@carlosrodriguez",
      avatar: "/developer-man-2.jpg",
      status: "offline",
      lastMessage: "Great work on the Vue component!",
      lastMessageTime: "2h ago",
      unreadCount: 0,
    },
  ]

  const chatMessages = [
    {
      id: "1",
      sender: "Emma Wilson",
      senderId: "1",
      message: "Hey! How's the new project going?",
      time: "2:30 PM",
      isMe: false,
      type: "text",
      reactions: [{ emoji: "👍", count: 1, users: ["You"] }],
    },
    {
      id: "2",
      sender: "You",
      senderId: "me",
      message: "Going great! Just finished implementing the authentication system. Here's a quick snippet:",
      time: "2:32 PM",
      isMe: true,
      type: "text",
    },
    {
      id: "3",
      sender: "You",
      senderId: "me",
      message: `const authenticateUser = async (credentials) => {\n  try {\n    const response = await fetch('/api/auth', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify(credentials)\n    });\n    return response.json();\n  } catch (error) {\n    console.error('Auth failed:', error);\n  }\n};`,
      time: "2:32 PM",
      isMe: true,
      type: "code",
    },
    {
      id: "4",
      sender: "Emma Wilson",
      senderId: "1",
      message: "Awesome! I'd love to see the full implementation when you're ready to share.",
      time: "2:33 PM",
      isMe: false,
      type: "text",
      reactions: [
        { emoji: "❤️", count: 1, users: ["You"] },
        { emoji: "🔥", count: 1, users: ["David Kim"] },
      ],
    },
    {
      id: "5",
      sender: "You",
      senderId: "me",
      message: "I'll push it to the repo later today. The error handling could use some work though.",
      time: "2:35 PM",
      isMe: true,
      type: "text",
    },
  ]

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConnection = connections.find((c) => c.id === selectedChat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      console.log("[v0] Sending message:", message, "to:", selectedChat)
      setMessage("")
      // Handle send message logic here
    }
  }

  const handleReaction = (messageId, emoji) => {
    console.log("[v0] Adding reaction:", emoji, "to message:", messageId)
    // Handle reaction logic here
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const formatTime = (time) => {
    return time
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[600px]">
      {/* Chat List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-1 p-3">
              {filteredConnections.map((connection) => (
                <div
                  key={connection.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === connection.id ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedChat(connection.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={connection.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {connection.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(connection.status)}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{connection.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{connection.lastMessageTime}</span>
                          {connection.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                            >
                              {connection.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {connection.isTyping ? (
                            <span className="text-primary italic">typing...</span>
                          ) : (
                            connection.lastMessage
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2">
        {selectedConnection ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConnection.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedConnection.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(selectedConnection.status)}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedConnection.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {selectedConnection.status}
                      {selectedConnection.isTyping && " • typing..."}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <Pin className="h-4 w-4 mr-2" />
                          Pin Chat
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </Button>
                        <Separator />
                        <Button variant="ghost" className="w-full justify-start text-destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Chat
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] group`}>
                        <div
                          className={`p-3 rounded-lg ${msg.isMe ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          {msg.type === "code" ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4" />
                                <span className="text-xs font-medium">Code Snippet</span>
                              </div>
                              <pre
                                className={`text-xs p-2 rounded border overflow-x-auto ${
                                  msg.isMe ? "bg-primary-foreground/10" : "bg-background"
                                }`}
                              >
                                <code>{msg.message}</code>
                              </pre>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <p
                              className={`text-xs ${msg.isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                            >
                              {formatTime(msg.time)}
                            </p>

                            {/* Message Actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Smile className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align="end">
                                  <div className="flex gap-1">
                                    {["👍", "❤️", "😂", "😮", "😢", "😡"].map((emoji) => (
                                      <Button
                                        key={emoji}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-lg"
                                        onClick={() => handleReaction(msg.id, emoji)}
                                      >
                                        {emoji}
                                      </Button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Reply className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Reactions */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {msg.reactions.map((reaction, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs bg-transparent"
                                onClick={() => handleReaction(msg.id, reaction.emoji)}
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Code className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</div>
                    </div>
                  </div>
                  <Button onClick={handleSendMessage} disabled={!message.trim()} className="mb-8">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a connection to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
