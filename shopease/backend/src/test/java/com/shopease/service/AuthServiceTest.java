package com.shopease.service;

import com.shopease.dto.request.LoginRequest;
import com.shopease.dto.request.RegisterRequest;
import com.shopease.dto.response.AuthResponse;
import com.shopease.entity.User;
import com.shopease.enums.Role;
import com.shopease.exception.BadRequestException;
import com.shopease.repository.UserRepository;
import com.shopease.security.UserDetailsImpl;
import com.shopease.service.impl.AuthServiceImpl;
import com.shopease.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtil jwtUtil;
    @InjectMocks private AuthServiceImpl authService;

    @Test
    @DisplayName("Should register user successfully")
    void register_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setName("Shreya"); req.setEmail("shreya@test.com");
        req.setPassword("pass123"); req.setPhone("9876543210");

        User saved = User.builder().id(1L).name("Shreya")
                .email("shreya@test.com").role(Role.ROLE_CUSTOMER).build();

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(userRepository.save(any())).thenReturn(saved);
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getEmail()).isEqualTo("shreya@test.com");
        assertThat(response.getRole()).isEqualTo("ROLE_CUSTOMER");
    }

    @Test
    @DisplayName("Should throw exception for duplicate email")
    void register_DuplicateEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@test.com");
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Email already registered");
    }

    @Test
    @DisplayName("Should login successfully")
    void login_Success() {
        User user = User.builder().id(1L).name("Shreya")
                .email("shreya@test.com").role(Role.ROLE_CUSTOMER).build();
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(auth.getPrincipal()).thenReturn(userDetails);
        when(jwtUtil.generateToken(any())).thenReturn("jwt-token");

        LoginRequest req = new LoginRequest();
        req.setEmail("shreya@test.com"); req.setPassword("pass123");

        AuthResponse response = authService.login(req);
        assertThat(response.getToken()).isEqualTo("jwt-token");
    }
}
