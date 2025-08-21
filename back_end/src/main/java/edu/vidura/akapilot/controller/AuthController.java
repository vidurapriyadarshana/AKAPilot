package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.dto.ApiResponse;
import edu.vidura.akapilot.dto.AuthDTO;
import edu.vidura.akapilot.dto.RegisterDTO;
import edu.vidura.akapilot.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(
            @RequestBody RegisterDTO registerDTO){
        return ResponseEntity.ok(
                new ApiResponse(
                        200,
                        "User registered successfully",
                        authService.register(registerDTO)
                )
        );
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthDTO authDTO){
        return ResponseEntity.ok(new ApiResponse(200,
                "OK",authService.authenticate(authDTO)));
    }
}
