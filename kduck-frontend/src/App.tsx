import React, { useState } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // 새 사용자 추가되면 목록 새로고침
  const handleUserAdded = () => {
    setRefreshKey(old => old + 1);
  };

  return (
      <div style={{ padding: '20px' }}>
        <UserForm onUserAdded={handleUserAdded} />
        <UserList key={refreshKey} />
      </div>
  );
};

export default App;
