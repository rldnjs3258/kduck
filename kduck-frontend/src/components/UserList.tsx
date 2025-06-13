import React, { useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/users')
            .then(res => {
                if (!res.ok) {
                    throw new Error('서버에서 사용자 데이터를 불러오는 데 실패했습니다.');
                }
                return res.json();
            })
            .then(data => setUsers(data))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div>
            <h1>사용자 목록</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        이름: {user.name}, 이메일: {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
