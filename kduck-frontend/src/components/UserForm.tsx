import React, { useState } from 'react';

interface UserFormProps {
    onUserAdded: () => void;  // 사용자 추가 후 호출되는 함수
}

const UserForm: React.FC<UserFormProps> = ({ onUserAdded }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const res = await fetch('http://localhost:8080/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa('admin:admin123'),
                },
                credentials: 'include',
                body: JSON.stringify({ nickname: name }),  // ✅ 여기 중요!
            });

            if (res.ok) {
                setName('');
                onUserAdded(); // 부모에게 알려서 목록 갱신 요청
            } else {
                alert('사용자 추가 실패');
            }
        } catch (error) {
            alert('에러 발생: ' + error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button type="submit">추가</button>
        </form>
    );
};

export default UserForm;
