package com.kduck.service;

import com.kduck.dto.UserDto;
import com.kduck.mapper.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserMapper userMapper;

    public UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public List<UserDto> getAllUsers() {
        return userMapper.getAllUsers();
    }

    public void addUser(UserDto user) {
        userMapper.insertUser(user);
    }
}
