package com.kduck.kduck.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    @Column(unique = true)
    private String nickname;

    @Column(unique = true)
    private String name;
    private Integer age;
    private String country;
    private String gender;
    private String bias;
    private String bio;

    // 기본 생성자
    public User() {}

    // 전체 필드 생성자
    public User(Long id, String email, String password, String nickname,
                Integer age, String country, String gender, String bias, String bio, String name) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.age = age;
        this.country = country;
        this.gender = gender;
        this.bias = bias;
        this.bio = bio;
    }

    // Getter & Setter
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getNickname() { return nickname; }

    public String getName() { return name; }

    public String getdoglike() {return "dog";}

    public void setNickname(String nickname) { this.nickname = nickname; }

    public Integer getAge() { return age; }

    public void setAge(Integer age) { this.age = age; }

    public String getCountry() { return country; }

    public void setCountry(String country) { this.country = country; }

    public String getGender() { return gender; }

    public void setGender(String gender) { this.gender = gender; }

    public String getBias() { return bias; }

    public void setBias(String bias) { this.bias = bias; }

    public String getBio() { return bio; }

    public void setBio(String bio) { this.bio = bio; }

    // 빌더 패턴 (선택)
    public static class Builder {
        private String email;
        private String password;
        private String nickname;
        private String name;
        private Integer age;
        private String country;
        private String gender;
        private String bias;
        private String bio;

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder password(String password) {
            this.password = password;
            return this;
        }

        public Builder nickname(String nickname) {
            this.nickname = nickname;
            return this;
        }

        public Builder age(Integer age) {
            this.age = age;
            return this;
        }

        public Builder country(String country) {
            this.country = country;
            return this;
        }

        public Builder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder bias(String bias) {
            this.bias = bias;
            return this;
        }

        public Builder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public User build() {
            User user = new User();
            user.email = this.email;
            user.password = this.password;
            user.nickname = this.nickname;
            user.name = this.name;
            user.age = this.age;
            user.country = this.country;
            user.gender = this.gender;
            user.bias = this.bias;
            user.bio = this.bio;
            return user;
        }
    }
}
