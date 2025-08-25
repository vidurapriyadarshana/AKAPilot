package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public ResponseEntity<ApiResponse> getSubject() {
        List<SubjectsDTO> subjectList = subjectService.getAllSubjects();
        return ResponseEntity.ok(new ApiResponse(200, "OK", subjectList));
    }

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> postSubject(@Valid @RequestBody SubjectsDTO subjectsDTO) {
        SubjectsDTO saved = subjectService.saveSubject(subjectsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Subject saved successfully", saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSubject(@PathVariable Long id) {
        SubjectsDTO subject = subjectService.getSubject(id);
        return ResponseEntity.ok(new ApiResponse(200, "OK", subject));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectsDTO subjectsDTO) {

        SubjectsDTO updated = subjectService.updateSubject(id, subjectsDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Subject updated successfully", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(new ApiResponse(200, "Subject deleted successfully", null));
    }

}

