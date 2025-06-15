package com.kduck.service;

import com.kduck.dto.UserDto;
import com.kduck.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto.Response createUser(UserDto.Request request) {
        // 이메일 중복 검사
        if (userMapper.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다: " + request.getEmail());
        }

        // 사용자명 중복 검사
        if (userMapper.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다: " + request.getUsername());
        }

        return userMapper.insertUser(request);
    }

    @Transactional(readOnly = true)
    public UserDto.Response getUserById(Long id) {
        return userMapper.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + id));
    }

    @Transactional(readOnly = true)
    public UserDto.Response getUserByEmail(String email) {
        return userMapper.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + email));
    }

    @Transactional(readOnly = true)
    public UserDto.Response getUserByUsername(String username) {
        return userMapper.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
    }

    @Transactional(readOnly = true)
    public List<UserDto.Response> getAllUsers() {
        return userMapper.findAll();
    }

    public UserDto.Response updateUser(Long id, UserDto.Request request) {
        // 사용자 존재 확인
        userMapper.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + id));

        // 이메일 변경 시 중복 검사
        if (request.getEmail() != null) {
            UserDto.Response currentUser = userMapper.findById(id).get();
            if (!request.getEmail().equals(currentUser.getEmail()) &&
                    userMapper.existsByEmail(request.getEmail())) {
                throw new RuntimeException("이미 존재하는 이메일입니다: " + request.getEmail());
            }
        }

        // 사용자명 변경 시 중복 검사
        if (request.getUsername() != null) {
            UserDto.Response currentUser = userMapper.findById(id).get();
            if (!request.getUsername().equals(currentUser.getUsername()) &&
                    userMapper.existsByUsername(request.getUsername())) {
                throw new RuntimeException("이미 존재하는 사용자명입니다: " + request.getUsername());
            }
        }

        return userMapper.updateUser(id, request);
    }

    public void deleteUser(Long id) {
        userMapper.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + id));

        userMapper.deleteUser(id);
    }

    public boolean validatePassword(String email, String password) {
        String storedPassword = userMapper.getPasswordByEmail(email);
        if (storedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(password, storedPassword);
    }
}