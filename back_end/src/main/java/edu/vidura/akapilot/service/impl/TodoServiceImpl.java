package edu.vidura.akapilot.service.impl;

import edu.vidura.akapilot.dto.TodosDTO;
import edu.vidura.akapilot.entity.Subjects;
import edu.vidura.akapilot.entity.Todos;
import edu.vidura.akapilot.entity.User;
import edu.vidura.akapilot.exception.OperationNotAllowedException;
import edu.vidura.akapilot.exception.ResourceNotFoundException;
import edu.vidura.akapilot.exception.SubjectNotFoundException;
import edu.vidura.akapilot.mapper.TodosMapper;
import edu.vidura.akapilot.repo.SubjectRepo;
import edu.vidura.akapilot.repo.TodoRepo;
import edu.vidura.akapilot.repo.UserRepo;
import edu.vidura.akapilot.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepo todoRepo;
    private final UserRepo userRepo;
    private final SubjectRepo subjectRepo;

    @Override
    public TodosDTO saveTodo(TodosDTO todosDTO) {
        // Get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Fetch subject
        Subjects subject = subjectRepo.findById(todosDTO.getSubjectId())
                .orElseThrow(() -> new SubjectNotFoundException("Subject not found with id: " + todosDTO.getSubjectId()));

        // Map DTO → Entity
        Todos todo = TodosMapper.toEntity(todosDTO, user, subject);

        // Save
        Todos saved = todoRepo.save(todo);

        // Return DTO
        return TodosMapper.toDTO(saved);
    }

    @Override
    public List<TodosDTO> getAllTodo() {
        // ✅ get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ fetch todos for this user
        List<Todos> todos = todoRepo.findByUser(user);

        // ✅ map to DTOs
        return todos.stream()
                .map(TodosMapper::toDTO)
                .toList();
    }

    @Override
    public TodosDTO getTodoById(Long id) {
        // ✅ get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ fetch todo
        Todos todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // ✅ check ownership
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this todo");
        }

        // ✅ convert to DTO
        return TodosMapper.toDTO(todo);
    }

    @Override
    public TodosDTO updateTodo(Long id, TodosDTO todosDTO) {
        // ✅ get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ fetch existing todo
        Todos todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // ✅ ownership check
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this todo");
        }

        // ✅ fetch subject for update
        Subjects subject = subjectRepo.findById(todosDTO.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + todosDTO.getSubjectId()));

        // ✅ update fields
        todo.setTitle(todosDTO.getTitle());
        todo.setDescription(todosDTO.getDescription());
        todo.setDueDate(todosDTO.getDueDate());
        todo.setCompleted(todosDTO.isCompleted());
        todo.setPriority(todosDTO.getPriority());
        todo.setSubjects(subject);

        // ✅ save updated todo
        return TodosMapper.toDTO(todoRepo.save(todo));
    }

    @Override
    public void deleteTodo(Long id) {
        // ✅ get logged-in user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ✅ fetch todo
        Todos todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        // ✅ ownership check
        if (!todo.getUser().getId().equals(user.getId())) {
            throw new OperationNotAllowedException("You do not own this todo");
        }

        todoRepo.delete(todo);
    }



}
