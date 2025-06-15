package com.kduck.controller;

import lombok.Getter;
import lombok.Setter;
import com.kduck.dto.AuthDto;
import com.kduck.dto.UserDto;
import com.kduck.common.ApiResponse;
import com.kduck.service.UserService;
import com.kduck.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 회원가입 (기존 UserController 로직 활용)
    @PostMapping("/register")
    public ApiResponse<UserDto.Response> register(@RequestBody UserDto.Request request) {
        try {
            UserDto.Response user = userService.createUser(request);
            return ApiResponse.success(user);
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
        }
    }

    // 로그인
    @PostMapping("/login")
    public ApiResponse<AuthDto.LoginResponse> login(@RequestBody AuthDto.LoginRequest request) {
        try {
            // 이메일로 사용자 조회
            UserDto.Response user = userService.getUserByEmail(request.getEmail());

            System.out.println(user);
            if (user == null) {
                System.out.println("해당 이메일 유저 없음");
                return ApiResponse.error("존재하지 않는 사용자입니다.");
            }

            // 비밀번호 검증
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                System.out.println(request.getPassword());
                System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                System.out.println(user.getPassword()); // 얘가 문제네
                System.out.println("검증 시도");
                return ApiResponse.error("비밀번호가 일치하지 않습니다.");
            }

            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());

            // 응답에서 비밀번호 제거
            user.setPassword(null);

            AuthDto.LoginResponse response = new AuthDto.LoginResponse(token, user);
            return ApiResponse.success(response);

        } catch (Exception e) {
            return ApiResponse.error("로그인 중 오류가 발생했습니다.");
        }
    }

    // 토큰 검증
    @GetMapping("/verify")
    public ApiResponse<UserDto.Response> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ApiResponse.error("유효하지 않은 토큰입니다.");
            }

            String token = authHeader.substring(7);

            if (!jwtUtil.validateToken(token)) {
                return ApiResponse.error("만료되거나 유효하지 않은 토큰입니다.");
            }

            String email = jwtUtil.getEmailFromToken(token);
            UserDto.Response user = userService.getUserByEmail(email);
            user.setPassword(null); // 비밀번호 제거

            return ApiResponse.success(user);

        } catch (Exception e) {
            return ApiResponse.error("토큰 검증 중 오류가 발생했습니다.");
        }
    }
}