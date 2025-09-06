package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.AuthDTO;
import edu.vidura.akapilot.dto.AuthResponseDTO;
import edu.vidura.akapilot.dto.RegisterDTO;
import edu.vidura.akapilot.enums.Role;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.AuthService;
import edu.vidura.akapilot.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        // validate credentials
        User user = userRepo.findByUsername(authDTO.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // check password
        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // generate token
        String token = jwtUtil.generateToken(authDTO.getUsername());
        return new AuthResponseDTO(token);
    }

    // register user
    public String register(RegisterDTO registerDTO) {
        if (userRepo.findByUsername(registerDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .email(registerDTO.getEmail())
                .build();

        userRepo.save(user);
        return "User registered successfully";
    }


}
