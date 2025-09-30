export const chatKeys = {
  all: ['chats'],
  lists: () => [...chatKeys.all, 'list'],
  list: (filters) => [...chatKeys.lists(), filters],
  details: () => [...chatKeys.all, 'detail'],
  detail: (id) => [...chatKeys.details(), id],
  messages: (userId) => [...chatKeys.all, 'messages', userId],
  unreadCount: () => [...chatKeys.all, 'unreadCount'],
  search: (userId, query) => [...chatKeys.all, 'search', userId, query],
};
