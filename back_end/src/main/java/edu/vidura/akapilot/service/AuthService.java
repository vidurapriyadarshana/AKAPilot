package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.AuthDTO;
import edu.vidura.akapilot.dto.AuthResponseDTO;
import edu.vidura.akapilot.dto.RegisterDTO;

public interface AuthService {
    AuthResponseDTO authenticate(AuthDTO authDTO);
    String register(RegisterDTO registerDTO);
}
