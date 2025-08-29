package edu.vidura.akapilot.service;

import edu.vidura.akapilot.dto.SubjectsDTO;
import edu.vidura.akapilot.dto.TodosDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface TodoService {
    TodosDTO saveTodo(@Valid TodosDTO todosDTO);
    List<TodosDTO> getAllTodo();
    TodosDTO getTodoById(Long id);
    TodosDTO updateTodo(Long id, @Valid TodosDTO todosDTO);
    void deleteTodo(Long id);
}
