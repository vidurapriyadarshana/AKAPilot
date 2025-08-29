package edu.vidura.akapilot.controller;

import edu.vidura.akapilot.api.ApiResponse;
import edu.vidura.akapilot.dto.TodosDTO;
import edu.vidura.akapilot.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveTodo(@Valid @RequestBody TodosDTO todosDTO) {
        TodosDTO saved = todoService.saveTodo(todosDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Subject saved successfully", saved));
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getTodo() {
        List<TodosDTO> todoList = todoService.getAllTodo();
        return ResponseEntity.ok(new ApiResponse(200, "Success", todoService.getAllTodo()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getTodoById(@PathVariable Long id) {
        TodosDTO todo = todoService.getTodoById(id);
        return ResponseEntity.ok(new ApiResponse(200, "Success", todo));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateTodo(@PathVariable Long id, @Valid @RequestBody TodosDTO todosDTO) {
        TodosDTO updated = todoService.updateTodo(id, todosDTO);
        return ResponseEntity.ok(new ApiResponse(200, "Subject updated successfully", updated));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok(new ApiResponse(200, "Subject deleted successfully", null));
    }

}
