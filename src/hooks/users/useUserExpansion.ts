
import { useState } from 'react';

export const useUserExpansion = () => {
  const [expandedUsers, setExpandedUsers] = useState<{ [key: number]: boolean }>({});

  const toggleUserExpansion = (userId: number) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return {
    expandedUsers,
    toggleUserExpansion
  };
};
