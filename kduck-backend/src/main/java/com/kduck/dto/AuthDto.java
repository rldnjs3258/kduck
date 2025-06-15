// Login - Auth dto
package com.kduck.dto;

import lombok.Getter;
import lombok.Setter;

public class AuthDto {

    @Getter
    @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter
    @Setter
    public static class LoginResponse {
        private String token;
        private UserDto.Response user;

        public LoginResponse(String token, UserDto.Response user) {
            this.token = token;
            this.user = user;
        }
    }

    @Getter
    @Setter
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String nickname;
    }
}
