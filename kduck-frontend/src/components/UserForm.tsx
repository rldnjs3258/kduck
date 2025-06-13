import React, { useState } from 'react';

interface UserFormProps {
    onUserAdded: () => void; // 사용자가 추가된 후 부모 컴포넌트에 알리기 위한 콜백
}

const UserForm: React.FC<UserFormProps> = ({ onUserAdded }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '사용자 생성 실패');
            }

            setName('');
            setEmail('');
            onUserAdded();
        } catch (err: any) {
            setError(err.message || '알 수 없는 오류');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div>
                <label>
                    이름:{' '}
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="이름 입력"
                    />
                </label>
            </div>
            <div>
                <label>
                    이메일:{' '}
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="이메일 입력"
                    />
                </label>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? '등록 중...' : '등록'}
            </button>
            {error && <p style={{ color: 'red' }}>오류: {error}</p>}
        </form>
    );
};

export default UserForm;
