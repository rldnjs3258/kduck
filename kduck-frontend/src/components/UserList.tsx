import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Smile, CheckCircle, AlertTriangle, Star, Heart, Users } from 'lucide-react';

interface UserRegisterRequest {
    username: string;
    email: string;
    password: string;
    nickname?: string;
}

interface ValidationErrors {
    username?: string;
    email?: string;
    password?: string;
    nickname?: string;
}

export default function KDuckSignup() {
    const [formData, setFormData] = useState<UserRegisterRequest>({
        username: '',
        email: '',
        password: '',
        nickname: ''
    });

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [duckAnimation, setDuckAnimation] = useState(false);

    // 오리 애니메이션 효과
    useEffect(() => {
        const interval = setInterval(() => {
            setDuckAnimation(true);
            setTimeout(() => setDuckAnimation(false), 800);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'username':
                if (!value.trim()) return '사용자명은 필수입니다';
                if (value.length < 3 || value.length > 20) return '사용자명은 3-20자 사이여야 합니다';
                break;
            case 'email':
                if (!value.trim()) return '이메일은 필수입니다';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return '유효한 이메일을 입력하세요';
                break;
            case 'password':
                if (!value.trim()) return '비밀번호는 필수입니다';
                if (value.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다';
                break;
        }
        return undefined;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        newErrors.username = validateField('username', formData.username);
        newErrors.email = validateField('email', formData.email);
        newErrors.password = validateField('password', formData.password);

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            console.log('전송할 데이터:', JSON.stringify(formData, null, 2));

            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('응답 상태:', response.status);
            console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));

            if (response.ok) {
                const responseData = await response.json();
                console.log('성공 응답:', responseData);
                setIsSuccess(true);
                setFormData({ username: '', email: '', password: '', nickname: '' });
            } else {
                // 에러 응답 내용 확인
                let errorMessage = '회원가입에 실패했습니다.';
                try {
                    const errorData = await response.text();
                    console.error('에러 응답 내용:', errorData);

                    // JSON 형태의 에러 응답인지 확인
                    try {
                        const errorJson = JSON.parse(errorData);
                        if (errorJson.message) {
                            errorMessage = errorJson.message;
                        }
                    } catch {
                        // JSON이 아닌 경우 텍스트 그대로 사용
                        if (errorData) {
                            errorMessage = errorData;
                        }
                    }
                } catch (parseError) {
                    console.error('에러 응답 파싱 실패:', parseError);
                }

                // 상태 코드별 처리
                // 상태 코드별 처리
                switch (response.status) {
                    case 400:
                        console.error('400 에러 상세 정보:');
                        console.error('전송 데이터:', formData);
                        console.error('에러 메시지:', errorMessage);

                        // 에러 메시지에 따른 사용자 친화적 메시지
                        let userMessage = '회원가입에 실패했습니다.';
                        if (errorMessage.includes('이미 존재하는 이메일')) {
                            userMessage = '이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.';
                            // 이메일 필드에 에러 표시
                            setErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
                        } else if (errorMessage.includes('이미 존재하는 사용자명')) {
                            userMessage = '이미 사용 중인 사용자명입니다. 다른 사용자명을 사용해주세요.';
                            // 사용자명 필드에 에러 표시
                            setErrors(prev => ({ ...prev, username: '이미 사용 중인 사용자명입니다.' }));
                        } else if (errorMessage.includes('UserMapper') || errorMessage.includes('MyBatis')) {
                            userMessage = '데이터베이스 연결에 문제가 있습니다. 관리자에게 문의해주세요.';
                        }

                        alert(userMessage);
                        break;
                    case 409:
                        alert('중복된 데이터입니다. 다시 확인해주세요.');
                        break;
                    case 500:
                        alert('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                        break;
                    default:
                        alert(`오류가 발생했습니다 (${response.status}): ${errorMessage}`);
                }
            }

        } catch (error) {
            console.error('네트워크 오류:', error);
            alert('네트워크 연결을 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                    <div className="text-6xl mb-4">🦆</div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">환영합니다! 🎉</div>
                    <div className="text-gray-600 mb-6">KDuck 덕후 세상에 오신 것을 환영해요!</div>
                    <div className="flex justify-center items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>팬 매칭</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>덕후 온도계</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            <span>뱃지 자랑</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSuccess(false)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                    >
                        시작하기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full shadow-2xl">
                {/* 헤더 */}
                <div className="text-center mb-8">
                    <div className={`text-6xl mb-4 transition-transform duration-800 ${duckAnimation ? 'animate-bounce' : ''}`}>
                        <div className="relative inline-block">
                            🦆
                            <div className="absolute inset-0 text-4xl">🕶️</div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        KDuck
                    </h1>
                    <p className="text-gray-600 text-sm">힙한 덕후들의 특별한 공간</p>
                </div>

                {/* 기능 미리보기 */}
                <div className="grid grid-cols-3 gap-3 mb-6 text-xs">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-xl text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                        <div className="text-purple-800 font-medium">팬 매칭</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-3 rounded-xl text-center">
                        <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600" />
                        <div className="text-pink-800 font-medium">덕후 온도계</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-3 rounded-xl text-center">
                        <Star className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                        <div className="text-orange-800 font-medium">뱃지 자랑</div>
                    </div>
                </div>

                {/* 회원가입 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 사용자명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            사용자명 *
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                                    errors.username ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                                }`}
                                placeholder="3-20자 사이로 입력해주세요"
                            />
                        </div>
                        {errors.username && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {errors.username}
                            </div>
                        )}
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            이메일 *
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                                }`}
                                placeholder="이메일을 입력해주세요"
                            />
                        </div>
                        {errors.email && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호 *
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-purple-300'
                                }`}
                                placeholder="최소 8자 이상 입력해주세요"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                                <AlertTriangle className="w-4 h-4" />
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* 닉네임 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임 (선택)
                        </label>
                        <div className="relative">
                            <Smile className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                placeholder="다른 덕후들에게 보여질 닉네임"
                            />
                        </div>
                    </div>

                    {/* 회원가입 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 active:scale-95'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                가입 중...
                            </div>
                        ) : (
                            '덕후 세상으로 떠나기 🚀'
                        )}
                    </button>
                </form>

                {/* 하단 텍스트 */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    이미 계정이 있으신가요?{' '}
                    <button className="text-purple-600 hover:text-purple-700 font-medium">
                        로그인하기
                    </button>
                </div>

                {/* 소셜 기능 힌트 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-center text-sm text-gray-600">
                        <div className="font-medium mb-1">🎯 KDuck에서 할 수 있는 것들</div>
                        <div className="text-xs space-y-1">
                            <div>• 같은 덕질하는 친구들과 매칭</div>
                            <div>• 익명으로 자유롭게 소통</div>
                            <div>• 나만의 덕후 방 꾸미기</div>
                            <div>• 콘서트/굿즈 인증으로 뱃지 획득</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}