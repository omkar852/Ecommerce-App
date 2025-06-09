package com.example.ecommerce.controller;

import com.example.ecommerce.dto.Purchase;
import com.example.ecommerce.dto.PurchaseResponse;
import com.example.ecommerce.service.CheckoutService;
import com.example.ecommerce.service.CheckoutServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {
     private CheckoutService checkoutService;

     @Autowired
     public CheckoutController(CheckoutService checkoutService) {
         this.checkoutService = checkoutService;
     }

     @PostMapping("/purchase")
     public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
         try {
             ObjectMapper objectMapper = new ObjectMapper();
             String json = objectMapper.writeValueAsString(purchase);
             System.out.println("Incoming Purchase JSON: " + json);
         } catch (Exception e) {
             e.printStackTrace();
         }
         return checkoutService.placeOrder(purchase);
     }
}
