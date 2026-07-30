package br.com.ubots.flowpay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.resilience.annotation.EnableResilientMethods;

@SpringBootApplication
@EnableResilientMethods
public class FlowpayApplication {

    public static void main(String[] args) {
		SpringApplication.run(FlowpayApplication.class, args);
	}

}
