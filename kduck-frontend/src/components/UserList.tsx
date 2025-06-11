import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    nickname: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        const res = await fetch('http://localhost:8080/users', {
            credentials: 'include',
            headers: {
                'Authorization': 'Basic ' + btoa('admin:admin123')
            }
        });
        const data = await res.json();
        setUsers(data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>사용자 닉네임 목록</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.nickname}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
