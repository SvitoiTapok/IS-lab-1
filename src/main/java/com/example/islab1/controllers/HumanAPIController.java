package com.example.islab1.controllers;

import com.example.islab1.DBApi.HumanRepository;
import com.example.islab1.util.Human;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HumanAPIController {
    @Autowired
    private HumanRepository humanRepository;

    @GetMapping("/getHumans")
    public ResponseEntity<Page<Human>> getHumans(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        try {
            Sort sort = sortOrder.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Human> humans = humanRepository.findAll(pageable);
            return ResponseEntity.ok(humans);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/addHuman")
    public ResponseEntity<Human> addHuman(@RequestBody Human human) {
        try {
            humanRepository.save(human);
        }catch (Exception e){
            return ResponseEntity.status(400).body(null);
        }
        return ResponseEntity.ok(human);
    }
}
