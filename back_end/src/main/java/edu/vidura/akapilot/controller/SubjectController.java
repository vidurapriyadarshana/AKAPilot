package edu.vidura.akapilot.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/subject")
@RequiredArgsConstructor
public class SubjectController {

    @GetMapping
    public String getSubject(){
        return "Subject";
    }

    @PostMapping
    public String postSubject(){
        return "Subject";
    }
}
