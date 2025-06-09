package com.example.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api")
public class CountryStateController {
    private final RestTemplate restTemplate;
    private final String API_URL = "https://countriesnow.space/api/v0.1/countries/states";

    @Autowired
    public CountryStateController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @GetMapping("/countries-states")
    public ResponseEntity<?> getCountriesAndStates() {
        try {
            // Call the external API
            ResponseEntity<Map> response = restTemplate.getForEntity(API_URL, Map.class);
            // Return the response from the API as it is
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            // Handle errors and return a meaningful response
            return ResponseEntity.status(500).body("An error occurred while fetching country and state data.");
        }
    }
}
