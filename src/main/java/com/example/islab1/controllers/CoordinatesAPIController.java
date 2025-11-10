package com.example.islab1.controllers;
import com.example.islab1.DBApi.CoordinatesRepository;
import com.example.islab1.DBApi.HumanRepository;
import com.example.islab1.util.Coordinates;
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
public class CoordinatesAPIController {

    @Autowired
    private CoordinatesRepository coordinatesRepository;


    @GetMapping("/getCoordinates")
    public ResponseEntity<Page<Coordinates>> getCoordinates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder) {
        try {
            Sort sort = sortOrder.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Coordinates> coordinates = coordinatesRepository.findAll(pageable);
            return ResponseEntity.ok(coordinates);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/addCoordinates")
    public ResponseEntity<Coordinates> addCoordinates(@RequestBody Coordinates coordinates) {
        try {
            coordinatesRepository.save(coordinates);
        }catch (Exception e){
            return ResponseEntity.status(400).body(null);
        }
        return ResponseEntity.ok(coordinates);
    }
}