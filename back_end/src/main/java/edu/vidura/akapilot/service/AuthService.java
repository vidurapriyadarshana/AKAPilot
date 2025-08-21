package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.AuthDTO;
import edu.vidura.akapilot.dto.AuthResponseDTO;
import edu.vidura.akapilot.dto.RegisterDTO;
import edu.vidura.akapilot.entity.Role;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO){
        // validate credentials
        User user=userRepo.findByUsername(authDTO.getUsername())
                .orElseThrow(()->new RuntimeException("User not found"));
        // check password
        if (!passwordEncoder.matches(
                authDTO.getPassword(),
                user.getPassword())){
            throw new BadCredentialsException("Invalid credentials");
        }
        // generate token
        String token=jwtUtil.generateToken(authDTO.username);
        return new AuthResponseDTO(token);
    }
    // register user
    public String register(RegisterDTO registerDTO){
        if (userRepo.findByUsername(registerDTO.getUsername())
                .isPresent()){
            throw new RuntimeException("Username already exists");
        }
        User user=User.builder()
                .username(registerDTO.getUsername())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .role(Role.valueOf(registerDTO.getRole()))
                .build();
        userRepo.save(user);
        return "User registered successfully";
    }

}
