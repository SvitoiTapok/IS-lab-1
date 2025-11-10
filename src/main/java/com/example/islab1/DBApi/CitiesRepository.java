package com.example.islab1.DBApi;

import com.example.islab1.util.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CitiesRepository extends JpaRepository<City, Integer>, JpaSpecificationExecutor<City> {
}
