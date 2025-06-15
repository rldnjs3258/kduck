package com.kduck.mapper;

import com.kduck.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class UserMapper {

    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserMapper(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    private final RowMapper<UserDto.Response> userRowMapper = new RowMapper<UserDto.Response>() {
        @Override
        public UserDto.Response mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserDto.Response user = new UserDto.Response();
            user.setId(rs.getLong("id"));
            user.setUsername(rs.getString("username"));
            user.setEmail(rs.getString("email"));
            user.setNickname(rs.getString("nickname"));
            user.setProfileImageUrl(rs.getString("profile_image_url"));
            user.setAnonymous(rs.getBoolean("is_anonymous"));
            user.setPassword(rs.getString("password"));

            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                user.setCreatedAt(createdAt.toLocalDateTime());
            }

            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                user.setUpdatedAt(updatedAt.toLocalDateTime());
            }

            return user;
        }
    };

    public UserDto.Response insertUser(UserDto.Request request) {
        String sql = "INSERT INTO users (username, email, password, nickname) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, request.getUsername());
            ps.setString(2, request.getEmail());
            ps.setString(3, passwordEncoder.encode(request.getPassword()));
            ps.setString(4, request.getNickname());
            return ps;
        }, keyHolder);

        Long id = null;

        // getKeyList()로 키 리스트를 받아서 첫번째 행의 id를 가져오기
        if (!keyHolder.getKeyList().isEmpty()) {
            Map<String, Object> keys = keyHolder.getKeyList().get(0);
            Object idObj = keys.get("id");
            if (idObj != null) {
                id = Long.valueOf(idObj.toString());
            }
        }

        if (id == null) {
            throw new RuntimeException("Failed to retrieve generated user ID");
        }

        return findById(id).orElse(null);
    }

    public Optional<UserDto.Response> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            UserDto.Response user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<UserDto.Response> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
//        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//        System.out.println(sql);
        try {
            UserDto.Response user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (Exception e) {
//            System.out.println("None");
            return Optional.empty();
        }
    }

    public Optional<UserDto.Response> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try {
            UserDto.Response user = jdbcTemplate.queryForObject(sql, userRowMapper, username);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<UserDto.Response> findAll() {
        String sql = "SELECT * FROM users ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public UserDto.Response updateUser(Long id, UserDto.Request request) {
        StringBuilder sql = new StringBuilder("UPDATE users SET ");
        StringBuilder setClauses = new StringBuilder();

        if (request.getUsername() != null) {
            setClauses.append("username = ?, ");
        }
        if (request.getEmail() != null) {
            setClauses.append("email = ?, ");
        }
        if (request.getNickname() != null) {
            setClauses.append("nickname = ?, ");
        }

        setClauses.append("updated_at = CURRENT_TIMESTAMP ");
        sql.append(setClauses.toString());
        sql.append("WHERE id = ?");

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql.toString());
            int paramIndex = 1;

            if (request.getUsername() != null) {
                ps.setString(paramIndex++, request.getUsername());
            }
            if (request.getEmail() != null) {
                ps.setString(paramIndex++, request.getEmail());
            }
            if (request.getNickname() != null) {
                ps.setString(paramIndex++, request.getNickname());
            }

            ps.setLong(paramIndex, id);
            return ps;
        });

        return findById(id).orElse(null);
    }

    public void deleteUser(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public String getPasswordByEmail(String email) {
        String sql = "SELECT password FROM users WHERE email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, String.class, email);
        } catch (Exception e) {
            return null;
        }
    }
}
