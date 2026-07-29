package com.fitai.backend.dto.auth;

public class AuthResponseDto {
    private String token;
    private String tokenType;
    private String id;
    private String name;
    private String email;
    private String message;

    public AuthResponseDto() {}

    public AuthResponseDto(String token, String tokenType, String id, String name, String email, String message) {
        this.token = token;
        this.tokenType = tokenType;
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static AuthResponseDtoBuilder builder() {
        return new AuthResponseDtoBuilder();
    }

    public static class AuthResponseDtoBuilder {
        private String token;
        private String tokenType = "Bearer";
        private String id;
        private String name;
        private String email;
        private String message;

        public AuthResponseDtoBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseDtoBuilder tokenType(String tokenType) {
            this.tokenType = tokenType;
            return this;
        }

        public AuthResponseDtoBuilder id(String id) {
            this.id = id;
            return this;
        }

        public AuthResponseDtoBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AuthResponseDtoBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponseDtoBuilder message(String message) {
            this.message = message;
            return this;
        }

        public AuthResponseDto build() {
            return new AuthResponseDto(token, tokenType, id, name, email, message);
        }
    }
}
